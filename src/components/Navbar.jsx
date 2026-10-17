import {useEffect, useRef, useState} from 'react'
import {Link, usePath} from './RouterLink'

export const routes=[['/','मुख्यपृष्ठ'],['/about','आमच्याविषयी'],['/committee','समिती'],['/projects','प्रकल्प / उपक्रम'],['/news','बातम्या'],['/events','कार्यक्रम'],['/gallery','गॅलरी'],['/membership','सदस्यत्व'],['/documents','दस्तऐवज'],['/contact','संपर्क'],['/announcements','घोषणा व सूचना']]
const english=['Home','About','Committee','Projects / Activities','News','Events','Gallery','Membership','Documents','Contact','Announcements']
const menuItems=[
  {mr:'मुख्यपृष्ठ',en:'Home',to:'/'},
  {mr:'विभागाविषयी',en:'About',children:['/about','/committee','/announcements','/contact']},
  {mr:'आयुक्तालय',en:'Commissionerate',children:['/committee','/contact']},
  {mr:'महामंडळे',en:'Corporations',children:['/projects']},
  {mr:'१०० दिवस कार्यक्रम अहवाल',en:'100 Day Programme Report',to:'/news'},
  {mr:'योजना',en:'Schemes',children:['/projects','/membership','/events']},
  {mr:'कागदपत्रे',en:'Documents',children:['/documents','/gallery']},
  {mr:'मॅन्युअल स्कॅव्हेंजर अधिनियम २०१३',en:'Manual Scavengers Act 2013',children:['/documents','/contact']}
]

function Icon({name}){
  const paths={search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,menu:<path d="M3 5h18M3 12h18M3 19h18"/>,close:<path d="m5 5 14 14M5 19 19 5"/>,access:<><circle cx="12" cy="4" r="2"/><path d="M3 8h18M12 7v7m0 0-5 8m5-8 5 8M8 8l1 7m7-7-1 7"/></>,login:<><path d="M13 4h8v16h-8M3 12h12m-4-4 4 4-4 4M3 5h5M3 19h5"/></>}
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function Navbar({language='mr',setLanguage}){
  const [open,setOpen]=useState(false)
  const [dropdown,setDropdown]=useState(null)
  const [query,setQuery]=useState('')
  const [searchOpen,setSearchOpen]=useState(false)
  const [accessOpen,setAccessOpen]=useState(false)
  const [largeText,setLargeText]=useState(false)
  const [contrast,setContrast]=useState(false)
  const headerRef=useRef(null)
  const path=usePath().replace(/\/+$/,'')||'/'
  const en=language==='en'
  const name=en?'Bhide Wada Fule Wada Rashtriy Smark Samiti':'भिडे वाडा फुले वाडा राष्ट्रीय स्मारक समिती'
  const labels=en?english:routes.map(route=>route[1])
  const close=()=>{setOpen(false);setDropdown(null);setSearchOpen(false);setAccessOpen(false)}
  useEffect(()=>{
    const dismiss=event=>{if(!headerRef.current?.contains(event.target)) close()}
    const escape=event=>{if(event.key==='Escape'){close();headerRef.current?.querySelector('.reference-menu-toggle')?.focus()}}
    document.addEventListener('pointerdown',dismiss)
    document.addEventListener('keydown',escape)
    return()=>{document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape)}
  },[])
  useEffect(()=>{
    document.documentElement.classList.toggle('nav-large-text',largeText)
    document.documentElement.classList.toggle('nav-high-contrast',contrast)
    return()=>{document.documentElement.classList.remove('nav-large-text','nav-high-contrast')}
  },[largeText,contrast])
  const results=routes.filter((route,i)=>`${route[1]} ${english[i]}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  const routeLink=(routePath)=>{
    const index=routes.findIndex(route=>route[0]===routePath)
    return <Link key={routePath} to={routePath} onClick={close} aria-current={path===routePath?'page':undefined}>{labels[index]}</Link>
  }

  return <header className="reference-header" ref={headerRef}>
    <div className="reference-utility">
      <div className="reference-shell reference-utility-inner">
        <div className="reference-identity"><span className="india-flag" role="img" aria-label="India"><span>☸</span></span><span>महाराष्ट्र</span><span className="reference-identity-en">MAHARASHTRA</span></div>
        <div className="reference-tools">
          <Link to="/admin/login" aria-label={en?'Admin login':'प्रशासक लॉगिन'} title={en?'Admin login':'प्रशासक लॉगिन'}><Icon name="login"/></Link>
          <button className="reference-language" onClick={()=>setLanguage(en?'mr':'en')} aria-label={en?'Switch to Marathi':'Switch to English'} title={en?'मराठी':'English'}><span>अ</span><span>A</span></button>
          <button onClick={()=>setAccessOpen(!accessOpen)} aria-expanded={accessOpen} aria-controls="header-accessibility" aria-label={en?'Accessibility options':'सुलभता पर्याय'}><Icon name="access"/></button>
        </div>
        {accessOpen&&<div className="reference-access-panel" id="header-accessibility">
          <strong>{en?'Accessibility':'सुलभता'}</strong>
          <button onClick={()=>setLargeText(!largeText)} aria-pressed={largeText}>{en?'Larger text':'मोठा मजकूर'} <span>A+</span></button>
          <button onClick={()=>setContrast(!contrast)} aria-pressed={contrast}>{en?'High contrast':'उच्च कॉन्ट्रास्ट'} <span>◐</span></button>
          <button onClick={()=>{setLargeText(false);setContrast(false)}}>{en?'Reset':'पूर्ववत करा'}</button>
        </div>}
      </div>
    </div>
    <div className="reference-shell reference-masthead">
      <Link className="reference-brand" to="/" onClick={close}>
        <img className="reference-brand-logo" src="/assets/images/logo.png" width="794" height="507" alt=""/>
        <span className="reference-brand-copy"><span>{en?'Heritage · Education · Equality':'वारसा · शिक्षण · समता'}</span><b>{name}</b>{!en&&<small>Bhide Wada Fule Wada Rashtriy Smark Samiti</small>}</span>
      </Link>
      <div className="reference-search-wrap">
        <form className="reference-search" role="search" onSubmit={event=>{event.preventDefault();setSearchOpen(true)}}>
          <input aria-label={en?'Search website pages':'वेबसाइटवरील पृष्ठे शोधा'} placeholder={en?'Search':'शोधा'} value={query} onFocus={()=>setSearchOpen(true)} onChange={event=>{setQuery(event.target.value);setSearchOpen(true)}}/>
          <button type="submit" aria-label={en?'Search':'शोधा'}><Icon name="search"/></button>
        </form>
        {searchOpen&&<div className="reference-search-results" aria-label={en?'Search results':'शोध परिणाम'}>
          {results.length?results.map(route=>routeLink(route[0])):<p>{en?'No matching pages found.':'जुळणारी पृष्ठे सापडली नाहीत.'}</p>}
        </div>}
      </div>
      <img className="reference-portraits" src="/assets/images/header.png" width="2170" height="725" alt={en?'Dr. B. R. Ambedkar, Mahatma Jyotirao Phule, Savitribai Phule, Rajarshi Shahu Maharaj and Annabhau Sathe':'डॉ. बाबासाहेब आंबेडकर, महात्मा ज्योतिराव फुले, सावित्रीबाई फुले, राजर्षी शाहू महाराज आणि अण्णाभाऊ साठे'}/>
    </div>
    <div className="reference-nav-bar">
      <div className="reference-shell reference-nav-inner">
        <nav className="reference-nav" aria-label={en?'Main navigation':'मुख्य नेव्हिगेशन'}>
          {menuItems.map((item,index)=>{
            const active=item.to===path||item.children?.includes(path)
            return <div className="reference-nav-item" key={item.en}>
              {item.to?<Link to={item.to} onClick={close} className={active?'is-active':''} aria-current={active?'page':undefined}>{en?item.en:item.mr}</Link>:<>
                <button className={active?'is-active':''} onClick={()=>setDropdown(dropdown===index?null:index)} aria-expanded={dropdown===index} aria-controls={`header-dropdown-${index}`}>{en?item.en:item.mr}<span className="reference-chevron" aria-hidden="true"/></button>
                {dropdown===index&&<div className="reference-dropdown" id={`header-dropdown-${index}`}>{item.children.map(routeLink)}</div>}
              </>}
            </div>
          })}
        </nav>
        <button className="reference-menu-toggle" onClick={()=>{setOpen(!open);setDropdown(null)}} aria-expanded={open} aria-controls="header-all-pages" aria-label={en?(open?'Close menu':'All pages'):(open?'मेनू बंद करा':'सर्व पृष्ठे')}><Icon name={open?'close':'menu'}/></button>
        {open&&<nav id="header-all-pages" className="reference-all-pages" aria-label={en?'All pages':'सर्व पृष्ठे'}>{routes.map(route=>routeLink(route[0]))}</nav>}
      </div>
    </div>
  </header>
}
