import {DatabaseSync} from 'node:sqlite'
import {mkdirSync} from 'node:fs'
import {dirname} from 'node:path'
import {randomBytes,scrypt,timingSafeEqual,randomUUID} from 'node:crypto'
import {promisify} from 'node:util'

const derive=promisify(scrypt)
export async function hashPassword(password){
  const salt=randomBytes(32).toString('hex')
  const key=await derive(password,salt,64)
  return `${salt}:${key.toString('hex')}`
}
export async function verifyPassword(password,encoded){
  if(typeof password!=='string'||password.length>256)return false
  const [salt,hex]=encoded.split(':')
  const key=await derive(password,salt,64)
  return timingSafeEqual(key,Buffer.from(hex,'hex'))
}
export function openStore(filename){
  if(filename!==':memory:')mkdirSync(dirname(filename),{recursive:true,mode:0o700})
  const db=new DatabaseSync(filename)
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS admins(id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS content(id TEXT PRIMARY KEY, type TEXT NOT NULL, payload TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS content_type ON content(type);
    CREATE TABLE IF NOT EXISTS enquiries(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS activity(id TEXT PRIMARY KEY, actor TEXT NOT NULL, action TEXT NOT NULL, section TEXT NOT NULL, title TEXT NOT NULL, created_at TEXT NOT NULL);
  `)
  const transaction=fn=>{
    db.exec('BEGIN IMMEDIATE')
    try{const result=fn();db.exec('COMMIT');return result}
    catch(error){db.exec('ROLLBACK');throw error}
  }
  const audit=(actor,action,section,title)=>db.prepare('INSERT INTO activity VALUES(?,?,?,?,?,?)').run(randomUUID(),actor,action,section,title,new Date().toISOString())
  return {db,transaction,audit}
}
