import express from 'express'
import cors from 'cors'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.post('/api/enquiries', async (req, res) => {
  const { name, phone, email = '', subject = '', message = '' } = req.body ?? {}
  if (!name?.trim() || !phone?.trim()) {
    return res.status(400).json({ message: 'कृपया आपले नाव आणि मोबाईल क्रमांक भरा.' })
  }

  const entry = {
    id: crypto.randomUUID(),
    name: name.trim(), phone: phone.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(),
    receivedAt: new Date().toISOString()
  }
  await mkdir(join(process.cwd(), 'data'), { recursive: true })
  await appendFile(join(process.cwd(), 'data', 'enquiries.ndjson'), `${JSON.stringify(entry)}\n`)
  return res.status(201).json({ message: 'धन्यवाद! आपली विनंती समितीकडे पाठवली आहे.' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Bhide Wada API listening on http://localhost:${port}`))
}
