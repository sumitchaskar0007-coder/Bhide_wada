import express from 'express'
import cors from 'cors'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

const demoBonafideRequests = [
  { id: 4, studentName: 'Gaurav Hajare', admissionNo: 'STU-6197-2026-163092', department: 'MBA', submittedAt: '31 Aug 2026', reason: 'FOR BUS PASS', status: 'PRINCIPAL_PENDING' }
]

app.get('/api/bonafide', (_req, res) => {
  res.json({ requests: demoBonafideRequests.filter(request => request.status === 'PRINCIPAL_PENDING') })
})

app.post('/api/bonafide/:id/approve', async (req, res) => {
  const id = Number(req.params.id)
  const request = demoBonafideRequests.find(item => item.id === id)
  if (!request) return res.status(404).json({ message: 'Bonafide request not found.' })
  if (request.status !== 'PRINCIPAL_PENDING') {
    return res.status(409).json({ message: 'This bonafide request has already been processed.' })
  }
  request.status = 'APPROVED'
  request.approvedBy = req.body?.approvedBy?.trim() || 'Principal'
  request.approvedAt = new Date().toISOString()
  await mkdir(join(process.cwd(), 'data'), { recursive: true })
  await appendFile(join(process.cwd(), 'data', 'bonafide-approvals.ndjson'), `${JSON.stringify(request)}\n`)
  return res.json({ request, message: 'Bonafide request approved successfully.' })
})

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
