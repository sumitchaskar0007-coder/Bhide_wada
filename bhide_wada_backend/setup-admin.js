import 'dotenv/config'
import {resolve,join} from 'node:path'
import {writeFileSync} from 'node:fs'
import {randomBytes,randomUUID} from 'node:crypto'
import {openStore,hashPassword} from './store.js'

const dataDir=resolve(process.env.DATA_DIR||'.data')
const {db}=openStore(join(dataDir,'admin.sqlite'))
try{
  if(db.prepare('SELECT id FROM admins LIMIT 1').get())throw new Error('An admin account already exists. Use Account settings to change its password.')
  const username=process.env.ADMIN_USERNAME||'admin'
  const password=process.env.ADMIN_PASSWORD||randomBytes(24).toString('base64url')
  if(!/^[a-zA-Z0-9_.-]{3,80}$/.test(username)||password.length<14||password.length>256)throw new Error('Use a username with 3–80 letters/numbers and a password with 14–256 characters.')
  const hashed=await hashPassword(password)
  db.prepare('INSERT INTO admins VALUES(?,?,?)').run(randomUUID(),username,hashed)
  const credentialPath=join(dataDir,'initial-admin.txt')
  writeFileSync(credentialPath,`Username: ${username}\nPassword: ${password}\n\nSign in at /admin/login. Change this password in Account settings and delete this file afterwards.\n`,{mode:0o600,flag:'wx'})
  console.log(`Admin account created. Initial credentials saved privately to ${credentialPath}`)
}catch(error){console.error(error.message);process.exitCode=1}finally{db.close()}
