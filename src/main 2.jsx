import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const programs = [
  ['⌂', 'वारसा संवर्धन', 'भिडे वाड्याचा ऐतिहासिक ठेवा जपण्यासाठी सातत्यपूर्ण प्रयत्न.'],
  ['♟', 'समुदाय सहभाग', 'रहिवासी, हितचिंतक आणि नागरिकांना जोडणारा संवाद.'],
  ['▣', 'शैक्षणिक उपक्रम', 'वारसा, नागरिकत्व आणि संस्कृतीवरील उपक्रम व कार्यशाळा.'],
  ['♧', 'कायदेशीर मार्गदर्शन', 'पुनर्वसन प्रक्रियेसाठी आवश्यक माहिती व मदत.'],
  ['♡', 'भागीदारी व दान', 'उपक्रमांसाठी सहकार्य आणि सामाजिक सहभागाचे व्यासपीठ.'],
]

const news = [
  ['समितीचा संवाद मेळावा', 'रहिवाशांसोबतच्या बैठकीत पुढील टप्प्यांवर चर्चा झाली.', '20 जून 2024'],
  ['स्वच्छता व वृक्षारोपण', 'परिसर अधिक स्वच्छ आणि हिरवा करण्यासाठी सामुदायिक उपक्रम.', '15 जून 2024'],
  ['वारसा संवाद सत्र', 'स्थानिक इतिहास व संरक्षणाबाबत अभ्यासपूर्ण चर्चा.', '10 जून 2024'],
]

const events = [
  ['25', 'जून', 'भिडे वाडा मार्गदर्शन फेरी', 'सकाळी 9:00 वा.'],
  ['02', 'जुलै', 'समिती संवाद बैठक', 'सायंकाळी 6:00 वा.'],
  ['15', 'जुलै', 'सांस्कृतिक कार्यक्रम', 'स्थळ लवकरच जाहीर होईल'],
]

function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [formState, setFormState] = useState({ loading: false, message: '' })
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    setFormState({ loading: true, message: '' })
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      setFormState({ loading: false, message: result.message })
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch (error) {
      setFormState({ loading: false, message: error.message || 'काहीतरी अडचण आली. कृपया पुन्हा प्रयत्न करा.' })
    }
  }
  const nav = [['मुखपृष्ठ', 'home'], ['आमच्याविषयी', 'about'], ['उपक्रम', 'programs'], ['समितीचे काम', 'work'], ['बातम्या', 'news'], ['कार्यक्रम', 'events'], ['संपर्क', 'contact']]
  const go = (id) => { setMenuOpen(false); scrollTo(id) }

  return <>
    <div className="utility"><div className="shell utility-inner"><span>⌂ भिडे वाडा, पुणे — आपला वारसा, आपली जबाबदारी</span><span>☎ +91 2345 67890 &nbsp; · &nbsp; ✉ info@bhidewada.org</span></div></div>
    <header className="header"><div className="shell nav-wrap">
      <button className="brand" onClick={() => go('home')} aria-label="मुखपृष्ठावर जा"><span className="brand-mark">⌂</span><span><b>भिडे वाडा पुनर्वसन समिती</b><small>Bhide Wada Rehabilitation Committee</small></span></button>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>☰</button>
      <nav className={menuOpen ? 'nav show' : 'nav'}>{nav.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}<button className="nav-cta" onClick={() => go('contact')}>♡ सहभागी व्हा</button></nav>
    </div></header>

    <main>
      <section className="hero" id="home"><div className="hero-shade"><div className="shell hero-content">
        <p className="eyebrow">भिडे वाडा पुनर्वसन समिती</p><h1>भिडे वाडा वाचवूया,<br/><em>वारसा पुढे नेऊया!</em></h1>
        <p className="hero-copy">भिडे वाडा ही केवळ एक वास्तू नाही; तो आपल्या इतिहासाचा, संस्कृतीचा आणि अस्मितेचा श्वास आहे. चला, एकत्र येऊन हा वारसा सुरक्षित ठेवूया.</p>
        <div className="actions"><button className="primary" onClick={() => go('about')}>आमच्याबद्दल जाणून घ्या <span>→</span></button><button className="secondary" onClick={() => go('contact')}>सहभाग घ्या <span>→</span></button></div>
      </div></div></section>

      <section className="shell stats" aria-label="समितीची माहिती">
        {[['⌂', '120+', 'कुटुंबे जोडली'], ['♙', '500+', 'सहभागी सदस्य'], ['♧', '25+', 'उपक्रम'], ['₹', '10L+', 'सामाजिक योगदान'], ['♧', '1000+', 'नागरिक सहभागी']].map(([icon, value, label]) => <div className="stat" key={label}><span className="stat-icon">{icon}</span><b>{value}</b><small>{label}</small></div>)}
      </section>

      <section className="section shell" id="programs"><div className="section-heading"><p className="eyebrow">आमचे कार्यक्षेत्र</p><h2>आपले प्रमुख उपक्रम</h2><span className="ornament">◆</span></div><div className="program-grid">{programs.map(([icon, title, body]) => <article className="program" key={title}><span className="program-icon">{icon}</span><h3>{title}</h3><p>{body}</p><button onClick={() => go('contact')}>अधिक माहिती <span>→</span></button></article>)}</div></section>

      <section className="section soft-bg" id="work"><div className="shell"><div className="section-heading"><p className="eyebrow">समितीचे काम</p><h2>पुनर्वसनासाठी एकत्रित प्रयत्न</h2></div><div className="work-grid"><article><span>01</span><h3>माहिती व मार्गदर्शन</h3><p>प्रक्रिया, हक्क आणि आवश्यक कागदपत्रांबाबत सुलभ माहिती.</p></article><article><span>02</span><h3>समन्वय व संवाद</h3><p>रहिवासी, तज्ज्ञ आणि संबंधित विभागांमध्ये पारदर्शक संवाद.</p></article><article><span>03</span><h3>वारसा जतन</h3><p>इतिहासाची जपणूक करत सुरक्षित व सन्मानजनक भविष्यासाठी काम.</p></article></div></div></section>

      <section className="section shell info-layout"><div id="news"><div className="section-title-row"><div><p className="eyebrow">काय सुरू आहे</p><h2>नवीन बातम्या</h2></div><button className="text-link" onClick={() => go('contact')}>सर्व बातम्या →</button></div><div className="news-list">{news.map(([title, body, date], index) => <article className="news-item" key={title}><div className={`news-photo p${index}`}><span>भिडे वाडा</span></div><div><small>{date}</small><h3>{title}</h3><p>{body}</p><button>अधिक वाचा →</button></div></article>)}</div></div>
        <div id="events"><div className="section-title-row"><div><p className="eyebrow">पुढील वाटचाल</p><h2>येणारे कार्यक्रम</h2></div></div><div className="event-list">{events.map(([date, month, title, time]) => <article className="event" key={title}><div className="date"><b>{date}</b><span>{month}</span></div><div><h3>{title}</h3><p>◉ {time}</p></div></article>)}</div></div>
        <aside className="message-card"><div className="portrait">श्री</div><p className="quote">“भिडे वाडा हा आपल्या पुण्याच्या इतिहासाचा महत्त्वाचा धागा आहे. सर्वांच्या सहभागातून त्याचे संवर्धन आणि रहिवाशांचे सन्मानजनक पुनर्वसन शक्य आहे.”</p><b>— समिती अध्यक्ष</b></aside>
      </section>

      <section className="section shell" id="about"><div className="about"><div className="about-image"><div className="window-light"></div><span>इतिहास जपणारी<br/>वास्तू</span></div><div><p className="eyebrow">आमच्याविषयी</p><h2>परंपरेचा सन्मान,<br/>उद्याचा विश्वास</h2><p>भिडे वाडा पुनर्वसन समिती ही रहिवासी व हितचिंतकांना एकत्र आणणारी सामुदायिक संस्था आहे. वारसा टिकवून सुरक्षित, समावेशक आणि सन्मानजनक पुनर्वसनासाठी आम्ही कटिबद्ध आहोत.</p><button className="outline" onClick={() => go('contact')}>समितीशी संपर्क करा →</button></div></div></section>

      <section className="quick"><div className="shell quick-grid">{[['♥', 'सदस्य व्हा', 'समितीच्या प्रवासात सहभागी व्हा'], ['▤', 'प्रकल्प पहा', 'कामाची माहिती आणि प्रगती'], ['▣', 'दस्तऐवज', 'सूचना, परिपत्रके व अहवाल'], ['☎', 'संपर्क साधा', '+91 2345 67890']].map(([icon, title, body]) => <button onClick={() => go('contact')} key={title}><span>{icon}</span><div><b>{title}</b><small>{body}</small></div><i>→</i></button>)}</div></section>

      <section className="contact" id="contact"><div className="shell contact-inner"><div><p className="eyebrow gold">माहिती हवी आहे?</p><h2>आपल्याशी जोडलेले राहूया</h2><p>आपला क्रमांक सोडा. समितीचा प्रतिनिधी लवकरच आपल्याशी संपर्क साधेल.</p></div><form onSubmit={submit}><label className="sr-only" htmlFor="name">नाव</label><input id="name" name="name" value={form.name} onChange={change} placeholder="आपले पूर्ण नाव *" required/><label className="sr-only" htmlFor="phone">मोबाईल</label><input id="phone" name="phone" value={form.phone} onChange={change} placeholder="मोबाईल क्रमांक *" required/><label className="sr-only" htmlFor="email">ईमेल</label><input id="email" name="email" type="email" value={form.email} onChange={change} placeholder="ईमेल (ऐच्छिक)"/><label className="sr-only" htmlFor="message">संदेश</label><textarea id="message" name="message" value={form.message} onChange={change} placeholder="आपला संदेश (ऐच्छिक)" rows="2"/><button className="primary" disabled={formState.loading}>{formState.loading ? 'पाठवत आहोत...' : 'विनंती पाठवा →'}</button>{formState.message && <p className="form-message">{formState.message}</p>}</form></div></section>
    </main>
    <footer><div className="shell footer-main"><div><div className="footer-brand"><span className="brand-mark">⌂</span><b>भिडे वाडा पुनर्वसन समिती</b></div><p>वारसा जपत, पुनर्वसनाचा विश्वासपूर्ण प्रवास.</p><div className="socials"><a href="#home" aria-label="Facebook">f</a><a href="#home" aria-label="Instagram">◎</a><a href="#home" aria-label="YouTube">▶</a><a href="#home" aria-label="WhatsApp">◉</a></div></div><div><h3>द्रुत दुवे</h3><button onClick={() => go('about')}>आमच्याविषयी</button><button onClick={() => go('programs')}>उपक्रम</button><button onClick={() => go('news')}>बातम्या</button></div><div><h3>संपर्क</h3><p>भिडे वाडा, पुणे, महाराष्ट्र</p><p>+91 2345 67890</p><p>info@bhidewada.org</p></div></div><div className="shell footer-bottom">© 2026 भिडे वाडा पुनर्वसन समिती <span>ही नमुना माहिती आहे; प्रकाशित करण्यापूर्वी समितीने तपासून मंजूर करावी.</span></div></footer>
  </>
}

createRoot(document.getElementById('root')).render(<App />)
