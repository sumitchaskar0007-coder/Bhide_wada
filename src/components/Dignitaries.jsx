import {useEffect,useRef} from 'react'

// Government portraits and designations: https://sjsa.maharashtra.gov.in/
const people=[
  {id:'devendra',image:'/assets/images/dignitaries/devendra-fadnavis.jpg',mr:'मा. श्री. देवेंद्रजी सरिताताई गंगाधरराव फडणवीस साहेब',en:'Shri Devendraji Saritatai Gangadharrao Fadnavis Saheb',roleMr:'मा. मुख्यमंत्री, महाराष्ट्र राज्य',roleEn:'Chief Minister, Maharashtra',source:'https://sjsa.maharashtra.gov.in/'},
  {id:'eknath',image:'/assets/images/dignitaries/eknath-shinde.jpg',mr:'मा. श्री. एकनाथजी गंगूबाई संभाजी शिंदे',en:'Shri Eknathji Gangubai Sambhaji Shinde',roleMr:'मा. उपमुख्यमंत्री, महाराष्ट्र राज्य',roleEn:'Deputy Chief Minister, Maharashtra',source:'https://sjsa.maharashtra.gov.in/'},
  {id:'sunetra',image:'/assets/images/dignitaries/sunetra-pawar.png',mr:'मा. श्रीमती सुनेत्राताई अजितदादा पवार',en:'Smt. Sunetratai Ajitdada Pawar',roleMr:'मा. उपमुख्यमंत्री, महाराष्ट्र राज्य',roleEn:'Deputy Chief Minister, Maharashtra',source:'https://sjsa.maharashtra.gov.in/'},
  {id:'nilesh',image:'/assets/images/dignitaries/girme.jpeg',mr:'मा. श्री. निलेशजी राधिकाताई दशरथ गिरमे',en:'Shri Nileshji Radhikatai Dashrath Girme',roleMr:'अध्यक्ष, भिडेवाडा–फुलेवाडा राष्ट्रीय स्मारक समिती महाराष्ट्र राज्य',roleEn:'President, Bhidewada–Phulewada National Memorial Committee, Maharashtra State',path:'/committee'}
]
function Portrait({person,name}){
  return <span className="dignitary-portrait"><img src={person.image} alt={name} loading="lazy" width="200" height="200"/></span>
}
export default function Dignitaries({language='mr'}){
  const en=language==='en'
  const dialogRef=useRef(null)
  useEffect(()=>{
    const dialog=dialogRef.current
    const previousFocus=document.activeElement
    const overflow=document.body.style.overflow
    const restore=()=>{
      document.body.style.overflow=overflow
      previousFocus?.focus({preventScroll:true})
    }
    dialog.addEventListener('close',restore)
    document.body.style.overflow='hidden'
    dialog.showModal()
    return()=>{
      dialog.removeEventListener('close',restore)
      dialog.close()
      restore()
    }
  },[])
  const close=()=>dialogRef.current?.close()
  return <dialog className="dignitaries-popup" ref={dialogRef} aria-labelledby="dignitaries-heading" onClick={event=>{
    if(event.target!==event.currentTarget)return
    const rect=event.currentTarget.getBoundingClientRect()
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close()
  }}>
    <div className="dignitaries-heading">
      <h2 id="dignitaries-heading">{en?'Dignitaries':'मान्यवर'}</h2>
      <button className="dignitaries-popup-close" type="button" onClick={close} aria-label={en?'Close popup':'पॉपअप बंद करा'}>×</button>
    </div>
    <div className="dignitaries-grid">
      {people.map(person=>{
        const label=en?person.en:person.mr
        const designation=en?person.roleEn:person.roleMr
        return <article className="dignitary-card" key={person.id}>
          <Portrait person={person} name={label}/>
          <h3>{label}</h3>
          {designation&&<p className="dignitary-role">{designation}</p>}
        </article>
      })}
    </div>
    <div className="dignitaries-popup-footer"><button className="primary" type="button" onClick={close}>{en?'Continue to website →':'वेबसाइट पहा →'}</button></div>
  </dialog>
}
