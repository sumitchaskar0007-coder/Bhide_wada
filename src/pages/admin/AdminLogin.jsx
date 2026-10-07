import {useState} from 'react'
import {loginAdmin} from '../../api/content'
import {Link} from '../../components/RouterLink'

export default function AdminLogin(){
  const [credentials,setCredentials]=useState({username:'',password:''})
  const [state,setState]=useState({busy:false,error:''})

  const submit=async event=>{
    event.preventDefault()
    setState({busy:true,error:''})
    try{
      await loginAdmin(credentials)
      history.replaceState({},'','/admin/dashboard')
      dispatchEvent(new Event('popstate'))
    }catch(error){
      setState({busy:false,error:error.message})
    }
  }

  return <main className="admin-login-page">
    <form className="admin-login-card" onSubmit={submit}>
      <p className="eyebrow">Secure administration</p>
      <h1>Admin login</h1>
      <p>Sign in to manage published news, events, and gallery media.</p>
      {state.error&&<p className="admin-error" role="alert">{state.error}</p>}
      <label>Username<input autoComplete="username" required value={credentials.username} onChange={event=>setCredentials(current=>({...current,username:event.target.value}))}/></label>
      <label>Password<input type="password" autoComplete="current-password" required value={credentials.password} onChange={event=>setCredentials(current=>({...current,password:event.target.value}))}/></label>
      <button className="primary" type="submit" disabled={state.busy}>{state.busy?'Signing in…':'Sign in'}</button>
      <Link to="/">← Return to website</Link>
    </form>
  </main>
}
