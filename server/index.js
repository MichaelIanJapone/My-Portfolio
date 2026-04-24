import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import nodemailer from 'nodemailer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Load repo-root .env even if the process cwd is not the project folder.
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()

const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'contact_messages.jsonl')

fs.mkdirSync(DATA_DIR, { recursive: true })

const API_PORT = Number(process.env.API_PORT ?? 4000)
const CONTACT_EMAIL_TO =
  process.env.CONTACT_EMAIL_TO ?? 'michaelianjapone@gmail.com'

/** Trim, strip BOM, and remove a single pair of wrapping quotes (common .env mistakes). */
function normalizeEnvString(value) {
  if (value == null) return ''
  let s = String(value).replace(/^\uFEFF/, '').trim()
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s
}

const SMTP_HOST_RAW = normalizeEnvString(process.env.SMTP_HOST)
const SMTP_USER = normalizeEnvString(process.env.SMTP_USER)
/** Gmail app passwords: spaces OK; strip ZWSP/BOM and other invisible chars that break copy-paste. */
function normalizeAppPassword(value) {
  return normalizeEnvString(value)
    .replace(/\s/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
}
const SMTP_PASS = normalizeAppPassword(process.env.SMTP_PASS)
const inferredGmailHost =
  !SMTP_HOST_RAW && /@(gmail|googlemail)\.com$/i.test(SMTP_USER)
const SMTP_HOST = SMTP_HOST_RAW || (inferredGmailHost ? 'smtp.gmail.com' : '')

const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587)
const SMTP_SECURE = String(process.env.SMTP_SECURE ?? 'false') === 'true'
const SMTP_FROM =
  normalizeEnvString(process.env.SMTP_FROM) ||
  `Portfolio Contact <${SMTP_USER || 'noreply@localhost'}>`

const hasSmtpConfig = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)
const useGmailService = SMTP_HOST.toLowerCase() === 'smtp.gmail.com'

const mailTransporter = hasSmtpConfig
  ? useGmailService
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        requireTLS: SMTP_PORT === 587,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
  : null

if (hasSmtpConfig && useGmailService && SMTP_PASS.length !== 16) {
  console.warn(
    `[contact] SMTP_PASS is ${SMTP_PASS.length} character(s) after cleanup; Gmail App Passwords are almost always 16 letters. Check .env for typos or extra characters.`,
  )
}

if (process.env.SMTP_VERIFY_ON_START === '1' && mailTransporter) {
  mailTransporter.verify((err) => {
    if (err) {
      console.error('[contact] SMTP verify failed:', err.message)
    } else {
      console.log('[contact] SMTP verify OK (credentials accepted).')
    }
  })
}

app.use(cors())
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}

function safeString(value) {
  return String(value ?? '')
}

app.post('/api/contact', (req, res) => {
  const body = req.body ?? {}

  const name = safeString(body.name).trim()
  const email = safeString(body.email).trim()
  const message = safeString(body.message).trim()

  const errors = []
  if (name.length < 2) errors.push('Name must be at least 2 characters.')
  if (!validateEmail(email)) errors.push('Email must be a valid email address.')
  if (message.length < 10)
    errors.push('Message must be at least 10 characters.')

  if (errors.length) {
    return res.status(400).json({ ok: false, error: errors.join(' ') })
  }

  const record = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    name,
    email,
    message,
    ip: req.ip,
    userAgent: req.headers['user-agent'] ?? undefined,
  }

  if (!mailTransporter) {
    fs.appendFile(DATA_FILE, `${JSON.stringify(record)}\n`, (err) => {
      if (err) {
        console.error('Failed to store contact message:', err)
        return res.status(500).json({ ok: false, error: 'Failed to store message.' })
      }
      res.json({
        ok: true,
        messageId: record.id,
        notice:
          'Message saved locally (no SMTP). Add SMTP_* variables to email submissions automatically.',
      })
    })
    return
  }

  const emailSubject = `New portfolio contact from ${name}`
  const plainTextBody = [
    `You received a new message from your portfolio contact form.`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
    '',
    `Received At: ${record.receivedAt}`,
    `Message ID: ${record.id}`,
    `IP: ${record.ip ?? 'n/a'}`,
  ].join('\n')

  mailTransporter.sendMail(
    {
      from: SMTP_FROM,
      to: CONTACT_EMAIL_TO,
      replyTo: email,
      subject: emailSubject,
      text: plainTextBody,
    },
    (mailErr) => {
      if (mailErr) {
        const msg = String(mailErr.message ?? '')
        const isAuthFailure =
          mailErr.code === 'EAUTH' ||
          mailErr.responseCode === 535 ||
          msg.includes('Invalid login') ||
          msg.includes('BadCredentials')
        if (isAuthFailure) {
          console.warn(
            '[contact] SMTP login rejected (535/EAUTH). Use a Gmail App Password in SMTP_PASS, same address in SMTP_USER, restart the server.',
          )
        } else {
          console.error('Failed to send contact email:', mailErr)
        }
        const backupRecord = {
          ...record,
          storedBecauseEmailFailed: true,
          emailError: msg.slice(0, 500),
        }

        fs.appendFile(DATA_FILE, `${JSON.stringify(backupRecord)}\n`, (appendErr) => {
          if (appendErr) {
            console.error('Failed to backup contact after email error:', appendErr)
            const ownerAuthHint =
              'SMTP login failed. For Gmail use an App Password in SMTP_PASS (see .env.example). Could not save a backup copy either.'
            return res.status(500).json({
              ok: false,
              error: isAuthFailure ? ownerAuthHint : 'Failed to send or store message.',
            })
          }

          if (isAuthFailure) {
            console.warn(
              '[contact] Message saved after SMTP auth failure. Fix SMTP_USER/SMTP_PASS (Gmail: App Password) to restore email delivery.',
            )
            return res.json({
              ok: true,
              messageId: record.id,
              notice:
                'Your message was received and stored. Automatic email from this form is misconfigured (SMTP login rejected). You can also use the Email link on this page to reach out directly.',
            })
          }

          return res.status(500).json({
            ok: false,
            error: 'Failed to send message email. Please try again later.',
          })
        })
        return
      }

      // Keep a local JSONL copy for backup/auditing.
      fs.appendFile(DATA_FILE, `${JSON.stringify(record)}\n`, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ ok: false, error: 'Failed to store message.' })
        }
        res.json({ ok: true, messageId: record.id })
      })
    },
  )
})

app.listen(API_PORT, () => {
  console.log(`API server listening on http://localhost:${API_PORT}`)
  if (hasSmtpConfig && useGmailService) {
    console.log(
      '[contact] Gmail SMTP on port 465; SMTP_USER must match SMTP_FROM address. App Password: https://myaccount.google.com/apppasswords — set SMTP_VERIFY_ON_START=1 to test login on startup.',
    )
  }
})

