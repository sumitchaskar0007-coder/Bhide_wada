const configuredApiUrl=(import.meta.env.VITE_API_URL||'https://api.phulewadarashmarak.com/api').replace(/\/+$/,'')
const apiBaseUrl=/\/api$/i.test(configuredApiUrl)?configuredApiUrl:`${configuredApiUrl}/api`

async function request(url,options={}){
  const response=await fetch(`${apiBaseUrl}${url}`,{credentials:'include',...options})
  const data=await response.json().catch(()=>({}))
  if(!response.ok) throw new Error(data.message||'The request could not be completed.')
  return data
}

export function getContent(type){
  return request(`/${type}`)
}

export function getAdminSession(){
  return request('/admin/session')
}

export function adminRequest(type,options={}){
  return request(`/admin/${type}`,options)
}

export function loginAdmin(credentials){
  return request('/admin/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(credentials)
  })
}

export function logoutAdmin(){
  return request('/admin/logout',{method:'POST'})
}
