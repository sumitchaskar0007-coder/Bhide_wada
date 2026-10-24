import {useEffect,useState} from 'react'
import {getContent} from '../api/content'

export default function usePublishedContent(type){
  const [state,setState]=useState({items:[],loading:true,error:''})
  useEffect(()=>{
    let active=true
    let pending=false
    const load=async()=>{
      if(pending)return
      pending=true
      try{
        const {items}=await getContent(type)
        if(active)setState({items,loading:false,error:''})
      }catch(error){
        if(active)setState(current=>({...current,loading:false,error:error.message}))
      }finally{pending=false}
    }
    const refresh=()=>{if(document.visibilityState!=='hidden')load()}
    setState({items:[],loading:true,error:''})
    load()
    window.addEventListener('focus',refresh)
    document.addEventListener('visibilitychange',refresh)
    return()=>{
      active=false
      window.removeEventListener('focus',refresh)
      document.removeEventListener('visibilitychange',refresh)
    }
  },[type])
  return state
}
