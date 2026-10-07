import PageLayout from './PageLayout'

const heritageImages={
  about:[
    {src:'https://commons.wikimedia.org/wiki/Special:FilePath/MAHATMA_fule_vada_(22).JPG?width=1200',alt:'Mahatma Phule Wada in Pune',credit:'Mahatma Phule Wada, Wikimedia Commons',source:'https://commons.wikimedia.org/wiki/File:MAHATMA_fule_vada_(22).JPG'},
    {src:'https://commons.wikimedia.org/wiki/Special:FilePath/Savitribai_Phule_with_Fatima_Sheikh.jpg?width=700',alt:'Savitribai Phule with Fatima Sheikh and students',credit:'Savitribai Phule with Fatima Sheikh, Wikimedia Commons',source:'https://commons.wikimedia.org/wiki/File:Savitribai_Phule_with_Fatima_Sheikh.jpg'}
  ],
  committee:[
    {src:'https://commons.wikimedia.org/wiki/Special:FilePath/Mahatma_Jyotiba_Phule.jpg?width=700',alt:'Portrait of Mahatma Jyotiba Phule',credit:'Mahatma Jyotiba Phule, Wikimedia Commons',source:'https://commons.wikimedia.org/wiki/File:Mahatma_Jyotiba_Phule.jpg'},
    {src:'https://commons.wikimedia.org/wiki/Special:FilePath/Savitribai_Phule_1998_stamp_of_India.jpg?width=700',alt:'Savitribai Phule commemorative stamp',credit:'Savitribai Phule stamp, Wikimedia Commons',source:'https://commons.wikimedia.org/wiki/File:Savitribai_Phule_1998_stamp_of_India.jpg'}
  ]
}

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
      ['Historical highlights',['The Historic Well — In 1868, Mahatma Phule opened his private courtyard well to the public. This courageous act gave Dalit and formerly untouchable communities access to clean water, directly challenging caste discrimination.','The Living Museum — Visitors can explore preserved rooms and galleries with vintage photographs, handwritten scripts, and timelines tracing the rise of the Satyashodhak Samaj (Society of Truth Seekers).','The Central Court — The central courtyard honours Jyotirao and Savitribai Phule through bronze busts beneath the historic tree canopy.']],
      ['Bhide Wada National Memorial Site',['Location: 257, Budhwar Peth, Tulshibaug, Pune, Maharashtra 411002.','Significance: Birthplace of women’s public education in India.']]
    ]},
    projects:{title:'National Memorial: Project Updates',intro:'Published reports describe the Bhide Wada memorial project. Construction figures and progress below are attributed to those reports and are not a live PMC status feed.',sections:[
      ['Reported progress — May 2026',['During a site visit in May 2026, Maharashtra minister Atul Save was reported as saying that work was around 90% complete and would be completed within the following year. This was a reported progress estimate and target, not confirmation that the memorial is now complete. Please check current Pune Municipal Corporation notices for the latest official status.']],
      ['Tender and funding reports — 2024',['Hindustan Times reported that PMC floated a ₹7.26 crore tender in June 2024, with a nine-month construction period. The Indian Express later reported PMC approval of ₹7.19 crore in August 2024. These are amounts from different reported stages; neither is presented here as the final awarded contract value.']]
    ]},
    committee:{title:'Committee Information',intro:'We could not verify an official, current committee roster, mandate, or contact channel in a government or municipal notice. Published reports use different committee names, so their identities are not assumed to be the same.',sections:[
      ['What published reports say',['Hindustan Times identified Nilesh Girme as president of the Mahatma Phule Smarak Rahivashi Kruti Samiti. Pune Pulse referred to Ajay Khedekar as chairman of the Bhidewada National Memorial Committee. The reports do not establish that these are the same body or verify a current office-holder list.']],
      ['Official information',['This website does not publish unverified committee roles, social profiles, or contact details as official. Please rely on a committee or Pune Municipal Corporation notice for confirmed names and contact information.']]
    ]},
    news:{title:'News & Updates',intro:'Official notices, meeting outcomes, and project progress will be published here after committee approval.',sections:[]},events:{title:'Events',intro:'Find information about heritage walks, public discussions, resident meetings, and educational programmes.',sections:[]},membership:{title:'Membership / Participate',intro:'Contact the committee to help preserve Bhide Wada’s history, share information, or join its activities.',sections:[]},documents:{title:'Documents / Downloads',intro:'Official reports, notices, applications, circulars, and rehabilitation-related documents will be available here.',sections:[]}
  },
  mr:{
    about:{title:'भिडे वाड्याची ओळख',intro:'भिडे वाडा हा भारतातील स्त्रियांच्या सार्वजनिक शिक्षणाचा आणि सामाजिक सुधारणेचा महत्त्वाचा ऐतिहासिक वारसा आहे.',sections:[
      ['ऐतिहासिक पार्श्वभूमी',['२५७, बुधवार पेठ येथे असलेल्या भिडे वाड्याला आधुनिक भारतीय इतिहासात कायमचे स्थान आहे. १ जानेवारी १८४८ रोजी सावित्रीबाई आणि ज्योतिराव फुले यांनी कठोर सामाजिक रूढींना आव्हान देत येथे भारतातील मुलींसाठी पहिली स्वदेशी शाळा सुरू केली. ही जागा त्यांचे पुरोगामी सहकारी तात्यासाहेब भिडे यांनी उपलब्ध करून दिली होती.','व्यावसायिक भाडेहक्कांबाबतच्या दीर्घ कायदेशीर प्रक्रियेनंतर या ठिकाणाचा राष्ट्रीय स्मारक म्हणून पुनर्विकासाचा मार्ग मोकळा झाला.']],
      ['ऐतिहासिक वैशिष्ट्ये',['ऐतिहासिक विहीर — १८६८ मध्ये महात्मा फुले यांनी त्यांच्या खाजगी अंगणातील विहीर सर्वांसाठी खुली केली. या धाडसी निर्णयामुळे दलित आणि तत्कालीन अस्पृश्य समाजाला स्वच्छ पाण्याचा हक्क मिळाला आणि जातीय भेदभावाला थेट आव्हान दिले गेले.','जिवंत संग्रहालय — जतन केलेल्या खोल्या व दालनांमध्ये दुर्मीळ जुनी छायाचित्रे, हस्तलिखिते आणि सत्यशोधक समाजाच्या उदयाचा इतिहास सांगणारी कालरेषा पाहता येईल.','मध्यवर्ती अंगण — ऐतिहासिक वृक्षछायेतील मध्यवर्ती अंगणात ज्योतिराव आणि सावित्रीबाई फुले यांच्या कांस्य प्रतिमांना अभिवादन करता येईल.']],
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
    committee:{
      title:'समितीविषयक माहिती',
      intro:'शासकीय किंवा महानगरपालिका सूचनेतून समितीची अधिकृत व अद्ययावत पदाधिकारी यादी, कार्यकक्षा किंवा संपर्क माध्यम आम्हाला पडताळता आले नाही. प्रकाशित वृत्तांतांत वेगवेगळी समिती-नावे आढळतात; त्यांना एकच संस्था मानलेले नाही.',
      sections:[
        ['प्रकाशित वृत्तांतांतील उल्लेख',['हिंदुस्तान टाइम्सने निलेश गिर्मे यांचा उल्लेख महात्मा फुले स्मारक रहिवासी कृती समितीचे अध्यक्ष असा केला आहे. पुणे पल्सने अजय खेडेकर यांचा उल्लेख भिडेवाडा राष्ट्रीय स्मारक समितीचे अध्यक्ष असा केला आहे. ही एकच संस्था असल्याचे किंवा सध्याच्या पदाधिकाऱ्यांची यादी असल्याचे हे वृत्तांत सिद्ध करत नाहीत.']],
        ['अधिकृत माहिती',['पडताळणी न केलेली पदे, सामाजिक प्रोफाइल किंवा संपर्क तपशील या संकेतस्थळावर अधिकृत म्हणून दिलेले नाहीत. पुष्टी केलेली नावे व संपर्कासाठी समितीची किंवा पुणे महानगरपालिकेची अधिकृत सूचना पहावी.']]
      ]
    },
    news:{title:'बातम्या व अपडेट्स',intro:'समितीच्या मंजुरीनंतर अधिकृत सूचना, बैठकींचे निष्कर्ष आणि प्रकल्प प्रगती येथे प्रसिद्ध केली जाईल.',sections:[]},events:{title:'कार्यक्रम',intro:'वारसा फेऱ्या, जनसंवाद, रहिवासी बैठका आणि शैक्षणिक कार्यक्रमांची माहिती येथे मिळेल.',sections:[]},membership:{title:'सदस्यत्व / सहभागी व्हा',intro:'भिडे वाड्याचा इतिहास जपण्यासाठी, माहिती देण्यासाठी किंवा उपक्रमांत सहभागी होण्यासाठी समितीशी संपर्क साधा.',sections:[]},documents:{title:'दस्तऐवज / डाउनलोड्स',intro:'अधिकृत अहवाल, सूचना, अर्ज, परिपत्रके आणि पुनर्वसनाशी संबंधित कागदपत्रे येथे उपलब्ध केली जातील.',sections:[]}
  }
}

export function ContentPage({type,language='mr'}) {
  const t=pages[language]||pages.mr
  const page=t[type]||t.about
  const images=heritageImages[type]

  return <PageLayout title={page.title} intro={page.intro}>
    {images&&<div className="heritage-image-grid">{images.map(image=><figure className="heritage-image" key={image.src}>
      <img src={image.src} alt={image.alt}/>
      <figcaption><a href={image.source} target="_blank" rel="noreferrer">{image.credit}</a></figcaption>
    </figure>)}</div>}
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
    {type==='committee'&&<div className="source-note">
      <p>{language==='en'?'These are media reports, not official committee notices.':'हे माध्यमांतील वृत्तांत आहेत; अधिकृत समिती सूचना नाहीत.'}</p>
      <ul>
        <li><a href="https://www.hindustantimes.com/cities/pune-news/bhidewada-memorial-work-90-complete-project-to-be-completed-within-a-year-atul-save-101778746675170.html" target="_blank" rel="noreferrer">Hindustan Times, 14 May 2026</a></li>
        <li><a href="https://www.mypunepulse.com/pune-bhidewada-national-memorial-to-be-completed-within-a-year/" target="_blank" rel="noreferrer">Pune Pulse, 13 May 2026</a></li>
      </ul>
    </div>}
  </PageLayout>
}
const contactMapEmbedUrl='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2774944450457!2d73.8538015738005!3d18.516358169305626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa6a06b6f%3A0xce2f52914e0bb6a7!2zQkhJREUgV0FEQSDgpK3gpL_gpKHgpYfgpLXgpL7gpKHgpL4gKOCkreCkv-CkoeClh-CkteCkvuCkoeCkviDgpKzgpJrgpL7gpLUg4KSu4KWL4KS54KS_4KSuKeCkuOCkguCkuOCljeCkpeCkvuCkquCklSAt4KSq4KWN4KSw4KS24KS-4KSC4KSkIOCkq-ClgeCksuClhw!5e0!3m2!1sen!2sin!4v1791283093145!5m2!1sen!2sin'

export function ContactPage({language='mr'}){
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
      <form className="contact-form"><input placeholder={t.name} required/><input placeholder={t.phone} required/><input type="email" placeholder={t.email}/><textarea placeholder={t.message} rows="5"/><button className="primary">{t.send}</button></form>
    </div>
  </PageLayout>
}
