import {useEffect,useRef} from 'react'

// Government portraits and designations: https://sjsa.maharashtra.gov.in/
const people=[
  {id:'devendra',image:'/assets/images/dignitaries/devendra-fadnavis.jpg',mr:'मा. श्री. देवेंद्र सरिता गंगाधरराव फडणवीस',en:'Hon. Shri Devendra Sarita Gangadharrao Fadnavis',roleMr:'माननीय मुख्यमंत्री, महाराष्ट्र राज्य',roleEn:'Honourable Chief Minister, Maharashtra State',source:'https://sjsa.maharashtra.gov.in/'},
  {id:'eknath',image:'/assets/images/dignitaries/eknath-shinde.jpg',mr:'मा. श्री. एकनाथ गंगुबाई संभाजी शिंदे',en:'Hon. Shri Eknath Gangubai Sambhaji Shinde',roleMr:'माननीय उपमुख्यमंत्री, महाराष्ट्र राज्य',roleEn:'Honourable Deputy Chief Minister, Maharashtra State',source:'https://sjsa.maharashtra.gov.in/'},
  {id:'sunetra',image:'/assets/images/dignitaries/sunetra-pawar.png',mr:'मा. श्रीमती सुनेत्रा अजित पवार',en:'Hon. Smt. Sunetra Ajit Pawar',roleMr:'माननीय उपमुख्यमंत्री, महाराष्ट्र राज्य',roleEn:'Honourable Deputy Chief Minister, Maharashtra State',source:'https://sjsa.maharashtra.gov.in/'},
  {id:'atul',image:'/assets/images/dignitaries/atulsave.png',mr:'श्री. अतुल लिलावती मोरेश्वर सावे',en:'Shri Atul Lilavati Moreshwar Save',roleMr:'कॅबिनेट मंत्री, महाराष्ट्र राज्य',roleEn:'Cabinet Minister, Maharashtra State',portfoliosMr:'खाती: इतर मागास बहुजन कल्याण, दुग्धविकास, अपारंपरिक ऊर्जा आणि दिव्यांग कल्याण',portfoliosEn:'Portfolios: Other Backward Bahujan Welfare, Dairy Development, Non-Conventional Energy and Welfare of Persons with Disabilities'},
  {id:'nilesh',image:'/assets/images/dignitaries/girme.jpeg',mr:'श्री. निलेश राधिकाताई दशरथ गिरमे',en:'Shri Nilesh Radhikatai Dashrath Girme',roleMr:'अध्यक्ष, भिडेवाडा–फुलेवाडा राष्ट्रीय स्मारक समिती',roleEn:'Chairman, Bhidewada–Phulewada National Memorial Committee',path:'/committee'}
]
function Portrait({person,name}){
  if(person.id==='atul') return <span className="dignitary-portrait dignitary-portrait--atul">
    <span className="dignitary-portrait-crop"><img src={person.image} alt={name} loading="lazy" width="738" height="1600"/></span>
  </span>
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
        const portfolios=en?person.portfoliosEn:person.portfoliosMr
        return <article className="dignitary-card" key={person.id}>
          <Portrait person={person} name={label}/>
          <h3>{label}</h3>
          {designation&&<p className="dignitary-role">{designation}</p>}
          {portfolios&&<p className="dignitary-portfolios">{portfolios}</p>}
        </article>
      })}
    </div>
    <div className="dignitaries-popup-footer"><button className="primary" type="button" onClick={close}>{en?'Continue to website →':'वेबसाइट पहा →'}</button></div>
  </dialog>
}
