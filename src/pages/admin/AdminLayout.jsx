import {useState} from 'react'
import {Link,usePath} from '../../components/RouterLink'
import {logoutAdmin} from '../../api/content'

const links=[
  ['/admin/dashboard','Dashboard'],
  ['/admin/news','News'],
  ['/admin/events','Events'],
  ['/admin/gallery','Gallery'],
  ['/admin/hero','Home hero']
]

export default function AdminLayout({children}){
  const path=usePath()
  const [error,setError]=useState('')
  const logout=async()=>{
    try{
      await logoutAdmin()
      history.replaceState({},'','/admin/login')
      dispatchEvent(new Event('popstate'))
    }catch(requestError){setError(requestError.message)}
  }

  return <main className="admin-shell">
    <header className="admin-header">
      <div><p className="eyebrow gold">Bhide Wada</p><h1>Administration</h1></div>
      <button className="outline" onClick={logout}>Sign out</button>
    </header>
    <nav className="admin-nav" aria-label="Admin pages">
      {links.map(([to,label])=><Link key={to} className={path===to?'active':''} to={to}>{label}</Link>)}
      <Link className="admin-public-link" to="/">View public site ↗</Link>
    </nav>
    {error&&<p className="admin-error" role="alert">{error}</p>}
    <div className="admin-content">{children}</div>
  </main>
}
