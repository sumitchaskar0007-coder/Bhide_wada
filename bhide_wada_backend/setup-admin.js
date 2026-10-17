import 'dotenv/config'
import {resolve,join} from 'node:path'
import {writeFileSync,unlinkSync} from 'node:fs'
import {randomBytes,randomUUID} from 'node:crypto'
import {hashPassword} from './store.js'
import {createRepository} from './repository.js'

const dataDir=resolve(process.env.DATA_DIR||'.data')
let store
let wroteCredentials=false
const credentialPath=join(dataDir,'initial-admin.txt')
try{
  store=await createRepository({dataDir,mongoUri:process.env.MONGODB_URI,dbName:process.env.MONGODB_DB_NAME||'bhide_wada'})
  if(await store.hasAdmin())throw new Error('An admin account already exists. Use Account settings to change its password.')
  const username=process.env.ADMIN_USERNAME||'admin'
  const password=process.env.ADMIN_PASSWORD||randomBytes(24).toString('base64url')
  if(!/^[a-zA-Z0-9_.-]{3,80}$/.test(username)||password.length<14||password.length>256)throw new Error('Use a username with 3–80 letters/numbers and a password with 14–256 characters.')
  const hashed=await hashPassword(password)
  const {mkdirSync}=await import('node:fs')
  mkdirSync(dataDir,{recursive:true,mode:0o700})
  writeFileSync(credentialPath,`Username: ${username}\nPassword: ${password}\n\nSign in at /admin/login. Change this password in Account settings and delete this file afterwards.\n`,{mode:0o600,flag:'wx'})
  wroteCredentials=true
  await store.createAdmin({id:randomUUID(),username,password:hashed})
  console.log(`Admin account created. Initial credentials saved privately to ${credentialPath}`)
}catch(error){
  if(wroteCredentials)unlinkSync(credentialPath)
  console.error(error.code==='EEXIST'?'Initial credentials already exist. Use db:migrate to preserve your existing administrator, or move the old credential file before setting up a new account.':error.code===11000?'This admin username already exists.':error.message)
  process.exitCode=1
}finally{await store?.close()}
