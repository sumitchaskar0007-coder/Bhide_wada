import {useEffect,useState} from 'react'
import {getAdminSession} from '../../api/content'

function goToLogin(){
  history.replaceState({},'','/admin/login')
  dispatchEvent(new Event('popstate'))
}

export default function AdminGuard({children}){
  const [state,setState]=useState({loading:true,error:''})

  useEffect(()=>{
    let active=true
    const expire=()=>goToLogin()
    const timer=setInterval(()=>{getAdminSession().then(data=>{if(active&&!data.authenticated)expire()}).catch(()=>{})},60000)
    getAdminSession()
      .then(({authenticated})=>{
        if(!active)return
        if(!authenticated){goToLogin();return}
        setState({loading:false,error:''})
      })
      .catch(error=>{if(active)setState({loading:false,error:error.message})})
    return ()=>{active=false;clearInterval(timer)}
  },[])

  if(state.loading)return <main className="admin-loading" role="status">Checking admin session…</main>
  if(state.error)return <main className="admin-login-page"><p className="admin-error" role="alert">{state.error}</p><button className="primary" onClick={()=>window.location.reload()}>Retry</button></main>
  return children
}
