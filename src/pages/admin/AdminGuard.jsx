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
    getAdminSession()
      .then(({authenticated})=>{
        if(!active)return
        if(!authenticated){goToLogin();return}
        setState({loading:false,error:''})
      })
      .catch(error=>{if(active)setState({loading:false,error:error.message})})
    return ()=>{active=false}
  },[])

  if(state.loading)return <main className="admin-loading" role="status">Checking admin session…</main>
  if(state.error)return <main className="admin-login-page"><p className="admin-error" role="alert">{state.error}</p><button className="primary" onClick={()=>window.location.reload()}>Retry</button></main>
  return children
}
