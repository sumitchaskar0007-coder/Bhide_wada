import {useState} from 'react'
import {adminRequest} from '../../api/content'
export default function AccountAdmin(){
  const [form,setForm]=useState({currentPassword:'',newPassword:'',confirmPassword:''})
  const [state,setState]=useState({busy:false,error:'',notice:''})
  const submit=async event=>{
    event.preventDefault()
    if(form.newPassword!==form.confirmPassword){setState({busy:false,error:'New passwords do not match.',notice:''});return}
    setState({busy:true,error:'',notice:''})
    try{const result=await adminRequest('password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword:form.currentPassword,newPassword:form.newPassword})});setForm({currentPassword:'',newPassword:'',confirmPassword:''});setState({busy:false,error:'',notice:result.message})}
    catch(error){setState({busy:false,error:error.message,notice:''})}
  }
  return <section className="admin-manager"><h2>Account settings</h2><p className="admin-intro">Change your password. All other signed-in sessions will be revoked.</p>{state.error&&<p className="admin-error" role="alert">{state.error}</p>}{state.notice&&<p className="admin-notice" role="status">{state.notice}</p>}<form className="admin-content-form admin-account-form" onSubmit={submit}>{[['currentPassword','Current password'],['newPassword','New password'],['confirmPassword','Confirm new password']].map(([name,label])=><label key={name}>{label}<input type="password" required minLength={name==='currentPassword'?undefined:14} maxLength={256} autoComplete={name==='currentPassword'?'current-password':'new-password'} value={form[name]} onChange={event=>setForm(current=>({...current,[name]:event.target.value}))}/></label>)}<small>Use at least 14 characters. A unique passphrase works well.</small><button className="primary" disabled={state.busy}>{state.busy?'Updating…':'Change password'}</button></form></section>
}
