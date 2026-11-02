import {useState} from 'react'
import {submitEnquiry} from '../api/content'
import PageLayout from './PageLayout'
import HeritageAboutMedia from '../components/HeritageAboutMedia'
import {committeeContent} from '../committeeContent'

const common={
  en:{
    contact:'Contact Us',contactIntro:'Send an enquiry and a committee representative will respond when official details are available.',name:'Full name *',phone:'Mobile number *',email:'Email (optional)',message:'Your message',send:'Send enquiry →'
  },
  mr:{
    contact:'संपर्क',contactIntro:'आपली चौकशी पाठवा. अधिकृत तपशील उपलब्ध झाल्यावर समितीचा प्रतिनिधी प्रतिसाद देईल.',name:'पूर्ण नाव *',phone:'मोबाईल क्रमांक *',email:'ईमेल (ऐच्छिक)',message:'आपला संदेश',send:'चौकशी पाठवा →'
  }
}

const pages={
  en:{
    about:{title:'About Bhide Wada',intro:'Bhide Wada is a landmark of women’s public education and social reform in India.',sections:[
      ['Historical background',['Located at 257, Budhwar Peth, Bhide Wada holds a permanent place in modern Indian history. On 1 January 1848, Savitribai Phule and Jyotirao Phule defied harsh social norms to open India’s first indigenous school for girls here. The building was offered for this work by their progressive associate, Tatyasaheb Bhide.','After a long legal process involving commercial tenancy rights, the site was cleared for redevelopment as a national memorial.']],
      ['A legacy of education and equality',['The school at Bhide Wada challenged the exclusion of girls from formal education. Savitribai and Jyotirao Phule’s work continues to inspire the pursuit of equal learning opportunities.','Bhide Wada in Budhwar Peth and the Phule family home in Ganj Peth are separate heritage sites. Together, their stories connect education with social reform in Pune.']],
      ['Bhide Wada National Memorial Site',['Location: 257, Budhwar Peth, Tulshibaug, Pune, Maharashtra 411002.','Significance: Birthplace of women’s public education in India.']]
    ]},
    projects:{title:'National Memorial: Project Updates',intro:'Published reports describe the Bhide Wada memorial project. Construction figures and progress below are attributed to those reports and are not a live PMC status feed.',sections:[
      ['Reported progress — May 2026',['During a site visit in May 2026, Maharashtra minister Atul Save was reported as saying that work was around 90% complete and would be completed within the following year. This was a reported progress estimate and target, not confirmation that the memorial is now complete. Please check current Pune Municipal Corporation notices for the latest official status.']],
      ['Tender and funding reports — 2024',['Hindustan Times reported that PMC floated a ₹7.26 crore tender in June 2024, with a nine-month construction period. The Indian Express later reported PMC approval of ₹7.19 crore in August 2024. These are amounts from different reported stages; neither is presented here as the final awarded contract value.']]
    ]},
    committee:committeeContent.en,
    news:{title:'News & Updates',intro:'Official notices, meeting outcomes, and project progress will be published here after committee approval.',sections:[]},events:{title:'Events',intro:'Find information about heritage walks, public discussions, resident meetings, and educational programmes.',sections:[]},membership:{title:'Membership / Participate',intro:'Contact the committee to help preserve Bhide Wada’s history, share information, or join its activities.',sections:[]},documents:{title:'Documents / Downloads',intro:'Official reports, notices, applications, circulars, and rehabilitation-related documents will be available here.',sections:[]}
  },
  mr:{
    about:{title:'भिडे वाड्याची ओळख',intro:'भिडे वाडा हा भारतातील स्त्रियांच्या सार्वजनिक शिक्षणाचा आणि सामाजिक सुधारणेचा महत्त्वाचा ऐतिहासिक वारसा आहे.',sections:[
      ['ऐतिहासिक पार्श्वभूमी',['२५७, बुधवार पेठ येथे असलेल्या भिडे वाड्याला आधुनिक भारतीय इतिहासात कायमचे स्थान आहे. १ जानेवारी १८४८ रोजी सावित्रीबाई आणि ज्योतिराव फुले यांनी कठोर सामाजिक रूढींना आव्हान देत येथे भारतातील मुलींसाठी पहिली स्वदेशी शाळा सुरू केली. ही जागा त्यांचे पुरोगामी सहकारी तात्यासाहेब भिडे यांनी उपलब्ध करून दिली होती.','व्यावसायिक भाडेहक्कांबाबतच्या दीर्घ कायदेशीर प्रक्रियेनंतर या ठिकाणाचा राष्ट्रीय स्मारक म्हणून पुनर्विकासाचा मार्ग मोकळा झाला.']],
      ['शिक्षण आणि समतेचा वारसा',['भिडे वाड्यातील शाळेने मुलींना औपचारिक शिक्षणापासून दूर ठेवणाऱ्या रूढींना आव्हान दिले. सावित्रीबाई आणि ज्योतिराव फुले यांचे कार्य आजही शिक्षणातील समान संधींसाठी प्रेरणा देते.','बुधवार पेठेतील भिडे वाडा आणि गंज पेठेतील फुले कुटुंबाचे घर ही दोन वेगवेगळी ऐतिहासिक स्थळे आहेत. या दोन्ही स्थळांचा इतिहास पुण्यातील शिक्षण आणि सामाजिक सुधारणांशी जोडलेला आहे.']],
      ['भिडे वाडा राष्ट्रीय स्मारक स्थळ',['पत्ता: २५७, बुधवार पेठ, तुळशीबाग, पुणे, महाराष्ट्र ४११००२.','महत्त्व: भारतातील स्त्रियांच्या सार्वजनिक शिक्षणाचे जन्मस्थान.']]
    ]},
    projects:{
      title:'राष्ट्रीय स्मारक: प्रकल्प माहिती',
      intro:'प्रकाशित वृत्तांतांमध्ये भिडे वाडा स्मारक प्रकल्पाविषयी दिलेली माहिती येथे स्रोतांसह दिली आहे. ही माहिती थेट पीएमसी प्रगती-नोंद नाही.',
      sections:[
        ['मे २०२६ मधील वृत्तांकित प्रगती',['मे २०२६ मधील स्थळभेटीदरम्यान मंत्री अतुल सावे यांनी काम सुमारे ९०% पूर्ण असून पुढील वर्षभरात पूर्ण होईल, असे सांगितल्याचे वृत्त प्रसिद्ध झाले. हा वृत्तांकित प्रगतीचा अंदाज व लक्ष्य आहे; स्मारक आता पूर्ण झाले आहे याची पुष्टी नव्हे. सध्याच्या अधिकृत स्थितीसाठी पुणे महानगरपालिकेच्या ताज्या सूचना तपासा.']],
        ['२०२४ मधील निविदा व निधीविषयक वृत्त',['हिंदुस्तान टाइम्सने जून २०२४ मध्ये पीएमसीने ₹७.२६ कोटींची निविदा काढल्याचे आणि कामासाठी नऊ महिन्यांचा कालावधी सांगितल्याचे वृत्त दिले. इंडियन एक्सप्रेसने नंतर ऑगस्ट २०२४ मध्ये पीएमसीने ₹७.१९ कोटी मंजूर केल्याचे वृत्त दिले. हे वेगवेगळ्या टप्प्यांबाबतचे वृत्तांकित आकडे आहेत; यापैकी कोणताही अंतिम कंत्राटाचा दर म्हणून येथे सांगितलेला नाही.']]
      ]
    },
    committee:committeeContent.mr,
    news:{title:'बातम्या व अपडेट्स',intro:'समितीच्या मंजुरीनंतर अधिकृत सूचना, बैठकींचे निष्कर्ष आणि प्रकल्प प्रगती येथे प्रसिद्ध केली जाईल.',sections:[]},events:{title:'कार्यक्रम',intro:'वारसा फेऱ्या, जनसंवाद, रहिवासी बैठका आणि शैक्षणिक कार्यक्रमांची माहिती येथे मिळेल.',sections:[]},membership:{title:'सदस्यत्व / सहभागी व्हा',intro:'भिडे वाड्याचा इतिहास जपण्यासाठी, माहिती देण्यासाठी किंवा उपक्रमांत सहभागी होण्यासाठी समितीशी संपर्क साधा.',sections:[]},documents:{title:'दस्तऐवज / डाउनलोड्स',intro:'अधिकृत अहवाल, सूचना, अर्ज, परिपत्रके आणि पुनर्वसनाशी संबंधित कागदपत्रे येथे उपलब्ध केली जातील.',sections:[]}
  }
}

export function ContentPage({type,language='mr'}) {
  const t=pages[language]||pages.mr
  const page=t[type]||t.about

  if(type==='committee') return <PageLayout title={page.title} intro={page.intro}>
    <div className="committee-information" lang={language==='en'?'en':'mr'}>
      {page.sections.map(([heading,paragraphs,items=[]])=><section className="content-detail" key={heading}>
        <h2>{heading}</h2>
        {paragraphs.map(text=><p className="lead-copy" key={text}>{text}</p>)}
        {items.map(([title,description])=><article className="committee-information-item" key={title}>
          <h3>{title}</h3>
          <p className="lead-copy">{description}</p>
        </article>)}
      </section>)}
    </div>
  </PageLayout>

  return <PageLayout title={page.title} intro={page.intro}>
    {type==='about'&&<HeritageAboutMedia site="bhide" language={language}/>}
    {page.sections.length
      ?page.sections.map(([heading,paragraphs])=><section className="content-detail" key={heading}>
        <p className="eyebrow">{heading}</p>
        {paragraphs.map(text=><p className="lead-copy" key={text}>{text}</p>)}
      </section>)
      :<p className="lead-copy">{page.intro}</p>}
    {type==='projects'&&<div className="source-note">
      <p>{language==='en'?'Sources (published reports; progress statements are attributed and may not reflect current official status):':'स्रोत (प्रकाशित वृत्तांत; प्रगतीविषयक विधाने संबंधित व्यक्तींना उद्धृत करतात आणि सध्याची अधिकृत स्थिती दर्शवत असतीलच असे नाही):'}</p>
      <ul>
        <li><a href="https://www.hindustantimes.com/cities/pune-news/bhidewada-memorial-work-90-complete-project-to-be-completed-within-a-year-atul-save-101778746675170.html" target="_blank" rel="noreferrer">Hindustan Times, 14 May 2026</a></li>
        <li><a href="https://www.mypunepulse.com/pune-bhidewada-national-memorial-to-be-completed-within-a-year/" target="_blank" rel="noreferrer">Pune Pulse, 13 May 2026</a></li>
        <li><a href="https://www.hindustantimes.com/cities/pune-news/pmc-floats-7-26-crore-tender-for-savitribai-phule-memorial-at-bhidewada-101719944468507.html" target="_blank" rel="noreferrer">Hindustan Times, 3 July 2024</a></li>
        <li><a href="https://indianexpress.com/article/cities/pune/pmc-approves-money-for-bhide-wada-memorial-in-pune-9511474/" target="_blank" rel="noreferrer">The Indian Express, 13 August 2024</a></li>
      </ul>
    </div>}
    {type==='about'&&<div className="source-note">
      <p>{language==='en'?'Historical background source:':'ऐतिहासिक माहितीसाठी स्रोत:'}</p>
      <ul>
        <li><a href="https://indianexpress.com/article/cities/pune/pmc-approves-money-for-bhide-wada-memorial-in-pune-9511474/" target="_blank" rel="noreferrer">The Indian Express, 13 August 2024</a></li>
      </ul>
    </div>}
  </PageLayout>
}
const contactMapEmbedUrl='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2774944450457!2d73.8538015738005!3d18.516358169305626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa6a06b6f%3A0xce2f52914e0bb6a7!2zQkhJREUgV0FEQSDgpK3gpL_gpKHgpYfgpLXgpL7gpKHgpL4gKOCkreCkv-CkoeClh-CkteCkvuCkoeCkviDgpKzgpJrgpL7gpLUg4KSu4KWL4KS54KS_4KSuKeCkuOCkguCkuOCljeCkpeCkvuCkquCklSAt4KSq4KWN4KSw4KS24KS-4KSC4KSkIOCkq-ClgeCksuClhw!5e0!3m2!1sen!2sin!4v1791283093145!5m2!1sen!2sin'

export function ContactPage({language='mr'}){
  const [form,setForm]=useState({name:'',phone:'',email:'',message:''})
  const [state,setState]=useState({busy:false,error:'',notice:''})
  const submit=async event=>{
    event.preventDefault();setState({busy:true,error:'',notice:''})
    try{await submitEnquiry(form);setForm({name:'',phone:'',email:'',message:''});setState({busy:false,error:'',notice:language==='en'?'Your enquiry has been received.':'आपली चौकशी प्राप्त झाली आहे.'})}
    catch(error){setState({busy:false,error:error.message,notice:''})}
  }
  const t=common[language]||common.mr
  const isEnglish=language==='en'
  return <PageLayout title={t.contact} intro={t.contactIntro}>
    <div className="contact-page-grid">
      <aside className="contact-location">
        <p className="eyebrow">{isEnglish?'Visit the memorial site':'स्मारक स्थळाला भेट द्या'}</p>
        <h2>{isEnglish?'Bhide Wada National Memorial':'भिडे वाडा राष्ट्रीय स्मारक'}</h2>
        <p>{isEnglish?'Located in the historic Budhwar Peth area of Pune.':'पुण्यातील ऐतिहासिक बुधवार पेठ परिसरात स्थित.'}</p>
        <div className="location-address"><span>⌖</span><b>{isEnglish?'257, Budhwar Peth, Tulshibaug':'२५७, बुधवार पेठ, तुळशीबाग'}</b><small>{isEnglish?'Pune, Maharashtra 411002':'पुणे, महाराष्ट्र ४११००२'}</small></div>
        <a className="map-link" href="https://www.google.com/maps/search/?api=1&query=Bhide+Wada+Budhwar+Peth+Pune" target="_blank" rel="noreferrer">{isEnglish?'Open in Google Maps →':'Google Maps वर उघडा →'}</a>
        <iframe className="contact-map-embed" src={contactMapEmbedUrl} title={isEnglish?'Map to Bhide Wada':'भिडे वाड्याचा नकाशा'} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>
      </aside>
      <form className="contact-form" onSubmit={submit}>{[['name',t.name,'text'],['phone',t.phone,'tel'],['email',t.email,'email']].map(([name,label,type])=><input key={name} type={type} aria-label={label} placeholder={label} required={name!=='email'} maxLength={name==='name'?100:name==='phone'?20:254} value={form[name]} onChange={event=>setForm(current=>({...current,[name]:event.target.value}))}/>)}<textarea aria-label={t.message} placeholder={t.message} rows="5" maxLength={5000} value={form.message} onChange={event=>setForm(current=>({...current,message:event.target.value}))}/>{state.error&&<p className="content-error" role="alert">{state.error}</p>}{state.notice&&<p className="admin-notice" role="status">{state.notice}</p>}<button className="primary" disabled={state.busy}>{state.busy?(language==='en'?'Sending…':'पाठवत आहे…'):t.send}</button></form>
    </div>
  </PageLayout>
}
