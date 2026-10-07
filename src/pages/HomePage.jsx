import {useEffect,useState} from 'react'
import {Link} from '../components/RouterLink'
import {getContent} from '../api/content'
const missionCollage=[
  {src:'/assets/images/about1.png',alt:'Bhide Wada Rehabilitation Committee heritage artwork'}
]
const copy={
  en:{eyebrow:'Heritage • Rehabilitation • Community',title:'Bhide Wada',emphasis:'Rehabilitation Committee',tagline:'Preserve heritage • Enable rehabilitation • Strengthen community',note:'A community-led initiative to preserve the legacy of Bhide Wada in Pune.',about:'Discover the history →',projects:'Memorial plans →',mission:'Our mission',heading:'Preserving a landmark of women’s education',body:'Bhide Wada in Budhwar Peth is the historic site where Savitribai Phule and Jyotirao Phule started a girls’ school in 1848.',history:'Why Bhide Wada matters',historyBody:'This landmark represents a defining chapter in social reform, women’s public education, and the struggle for equality. The proposed national memorial will carry that legacy forward for future generations.',well:'The historic well',wellText:'In 1868, Mahatma Phule opened his private courtyard well to communities denied access to clean water, challenging caste discrimination.',museum:'A living history',museumText:'The memorial vision brings together preserved heritage, historical timelines, rare photographs, and stories of the Satyashodhak Samaj.',future:'A memorial for the future',futureText:'Plans include interactive audio-visual galleries, a public amphitheatre, and a dedicated computer-training and skill-guidance centre for girls and women.',committee:'Committee information',committeeText:'This website shares historical information and published memorial-project updates. News reports use different committee names; their relationship and current office-bearers have not been verified here. Confirmed committee notices can be published with their sources.',committeeRoles:['Historical information about Bhide Wada','Memorial project updates with publication dates and citations','Committee notices and contacts when verified'],committeeAction:'Committee information →',location:'National Memorial Site',address:'257, Budhwar Peth, Tulshibaug, Pune, Maharashtra 411002',imageCredit:'Wikimedia Commons image sources',instagramTitle:'From Instagram',instagramIntro:'Stories and updates shared on Instagram.',instagramLink:'View post on Instagram ↗'},
  mr:{eyebrow:'वारसा • पुनर्वसन • समुदाय',title:'भिडे वाडा',emphasis:'पुनर्वसन समिती',tagline:'वारसा जपूया • पुनर्वसन घडवूया • समुदाय मजबूत करूया',note:'पुण्यातील भिडे वाड्याचा वारसा जपण्यासाठी समुदायाचा पुढाकार.',about:'इतिहास जाणून घ्या →',projects:'स्मारकाची योजना →',mission:'आमचे ध्येय',heading:'स्त्रियांच्या शिक्षणाच्या महत्त्वपूर्ण वारशाचे जतन',body:'बुधवार पेठेतील भिडे वाडा हे ते ऐतिहासिक स्थळ आहे जिथे सावित्रीबाई आणि ज्योतिराव फुले यांनी १८४८ मध्ये मुलींसाठी शाळा सुरू केली.',history:'भिडे वाडा महत्त्वाचा का आहे',historyBody:'हा वारसा सामाजिक सुधारणा, स्त्रियांचे सार्वजनिक शिक्षण आणि समतेच्या संघर्षातील महत्त्वपूर्ण अध्याय आहे. प्रस्तावित राष्ट्रीय स्मारक हा वारसा पुढील पिढ्यांपर्यंत पोहोचवेल.',well:'ऐतिहासिक विहीर',wellText:'१८६८ मध्ये महात्मा फुले यांनी त्यांच्या खाजगी अंगणातील विहीर स्वच्छ पाण्यापासून वंचित असलेल्या समुदायांसाठी खुली करून जातीय भेदभावाला आव्हान दिले.',museum:'जिवंत इतिहास',museumText:'स्मारकाच्या संकल्पनेत जतन केलेला वारसा, ऐतिहासिक कालरेषा, दुर्मीळ छायाचित्रे आणि सत्यशोधक समाजाच्या कथा समाविष्ट आहेत.',future:'भविष्यासाठी स्मारक',futureText:'संवादात्मक ध्वनी-दृश्य दालने, सार्वजनिक ॲम्फीथिएटर आणि मुली व महिलांसाठी संगणक प्रशिक्षण व कौशल्य मार्गदर्शन केंद्राची योजना आहे.',committee:'समितीविषयक माहिती',committeeText:'या संकेतस्थळावर भिडे वाड्याचा इतिहास आणि प्रकाशित स्मारक-प्रकल्प वृत्तांत दिले आहेत. वृत्तांतांत वेगवेगळी समिती-नावे आढळतात; त्यांचा परस्पर संबंध आणि सध्याचे पदाधिकारी येथे पडताळलेले नाहीत. पुष्टी केलेल्या समिती सूचना स्रोतांसह प्रसिद्ध करता येतील.',committeeRoles:['भिडे वाड्याविषयी ऐतिहासिक माहिती','दिनांक व संदर्भांसह स्मारक प्रकल्पाची माहिती','पडताळणीनंतर समितीच्या सूचना व संपर्क तपशील'],committeeAction:'समितीची माहिती →',location:'राष्ट्रीय स्मारक स्थळ',address:'२५७, बुधवार पेठ, तुळशीबाग, पुणे, महाराष्ट्र ४११००२',imageCredit:'विकिमीडिया कॉमन्स छायाचित्र स्रोत',instagramTitle:'इन्स्टाग्रामवरील पोस्ट',instagramIntro:'इन्स्टाग्रामवर शेअर केलेल्या बातम्या आणि माहिती.',instagramLink:'इन्स्टाग्रामवर पोस्ट पहा ↗'}
}
const instagramPosts=['DeHivr8MxI1','DbX4x6yM0ya']
export default function HomePage({language='mr'}){
  const t=copy[language]||copy.mr
  const [heroImages,setHeroImages]=useState([])
  const [heroIndex,setHeroIndex]=useState(0)
  const [heroError,setHeroError]=useState('')
  const [heroPaused,setHeroPaused]=useState(false)

  useEffect(()=>{
    let active=true
    getContent('hero')
      .then(({items})=>{if(active)setHeroImages(items)})
      .catch(error=>{if(active)setHeroError(error.message||'Unable to load managed hero images.')})
    return ()=>{active=false}
  },[])

  useEffect(()=>{
    if(heroImages.length<2||heroPaused)return undefined
    const timer=setInterval(()=>setHeroIndex(index=>(index+1)%heroImages.length),7000)
    return ()=>clearInterval(timer)
  },[heroImages.length,heroPaused])

  const activeHero=heroImages[heroIndex]
  const changeSlide=direction=>{
    setHeroIndex(index=>(index+direction+heroImages.length)%heroImages.length)
  }
  return <><section className="hero">
    {activeHero&&<img className="hero-background-image" src={activeHero.mediaUrl} alt={activeHero.altText} key={activeHero._id}/>}
    <div className="hero-shade"><div className="shell hero-content">{(activeHero?.title||heroError)&&<div className="hero-caption-card">{activeHero?.title&&<h1 className="managed-hero-title">{activeHero.title}</h1>}{heroError&&<span className="hero-media-status" role="status">{language==='en'?'Using the default hero image.':'मूळ मुख्य प्रतिमा वापरली जात आहे.'}</span>}</div>}</div></div>
    {heroImages.length>1&&<div className="hero-carousel-controls" onMouseEnter={()=>setHeroPaused(true)} onMouseLeave={()=>setHeroPaused(false)} onFocus={()=>setHeroPaused(true)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setHeroPaused(false)}}>
      <button className="hero-arrow hero-arrow-previous" type="button" aria-label={language==='en'?'Previous hero image':'मागील मुख्य प्रतिमा'} onClick={()=>changeSlide(-1)}>‹</button>
      <div className="hero-slide-controls" role="group" aria-label={language==='en'?'Choose hero image':'मुख्य प्रतिमा निवडा'}>
        {heroImages.map((image,index)=><button key={image._id} type="button" className={index===heroIndex?'active':''} aria-label={`${language==='en'?'Show image':'प्रतिमा दाखवा'} ${index+1}: ${image.title}`} aria-current={index===heroIndex?'true':undefined} onClick={()=>setHeroIndex(index)}/>)}
      </div>
      <span className="hero-slide-count" aria-live="polite">{heroIndex+1} / {heroImages.length}</span>
      <button className="hero-arrow hero-arrow-next" type="button" aria-label={language==='en'?'Next hero image':'पुढील मुख्य प्रतिमा'} onClick={()=>changeSlide(1)}>›</button>
    </div>}
  </section><section className="section shell home-intro"><div><p className="eyebrow">{t.mission}</p><h2>{t.heading}</h2><p className="lead-copy">{t.body}</p><p className="lead-copy">{t.historyBody}</p><div className="actions"><Link className="outline" to="/about">{t.about}</Link></div></div><div className="mission-collage mission-single-image"><img src="/assets/images/about1.png" alt="Bhide Wada Rehabilitation Committee heritage artwork"/></div></section><section className="home-highlights"><div className="shell"><div className="section-heading"><p className="eyebrow">{t.history}</p><h2>{t.history}</h2></div><div className="highlight-grid"><article><span>01</span><h3>{t.well}</h3><p>{t.wellText}</p></article><article><span>02</span><h3>{t.museum}</h3><p>{t.museumText}</p></article><article><span>03</span><h3>{t.future}</h3><p>{t.futureText}</p></article></div></div></section><section className="section shell home-committee"><div><p className="eyebrow">{t.committee}</p><h2>{t.committee}</h2><p className="lead-copy">{t.committeeText}</p><ul className="committee-roles">{t.committeeRoles.map(role=><li key={role}>{role}</li>)}</ul><Link className="primary" to="/committee">{t.committeeAction}</Link></div><aside><span>⌖</span><p className="eyebrow">{t.location}</p><b>{t.address}</b></aside></section><section className="home-instagram-section"><div className="shell"><div className="section-heading"><p className="eyebrow">Instagram</p><h2>{t.instagramTitle}</h2><p>{t.instagramIntro}</p></div><div className="home-instagram-grid">{instagramPosts.map((post,index)=><article className="home-instagram-card" key={post}><iframe src={`https://www.instagram.com/p/${post}/embed/`} title={`${t.instagramTitle} ${index+1}`} loading="lazy" allowFullScreen/><a href={`https://www.instagram.com/p/${post}/`} target="_blank" rel="noreferrer">{t.instagramLink}</a></article>)}</div></div></section></>
}
