import React,{useEffect,useState}from'react';
import emailjs from '@emailjs/browser';
import{Routes,Route,Link,NavLink,useParams,useNavigate}from'react-router-dom';import{Briefcase,Code2,Award,Mail,MapPin,Download,ArrowRight,ThumbsUp,ThumbsDown,Plus,Pencil,Trash2,LogOut,Eye,Menu,Video,ExternalLink,Sun,Moon,Upload,Save,ArrowLeft,ShieldCheck,BarChart3,FolderOpen,Settings,GraduationCap,Search}from'lucide-react';import{configured,supabase,dateLabel,fileUrl,uploadFile}from'./lib';import{seedProfile,seedExperience,seedSkills}from'./data';

const tables=['work_experiences','achievements','skills','certifications','projects','portfolio_videos'];const fields={work_experiences:[['company','Company'],['position','Job title'],['employment_type','Employment type'],['location','Location'],['start_date','Start date','date'],['end_date','End date','date'],['is_current','Currently employed','check'],['summary','Summary','textarea'],['responsibilities','Responsibilities (one per line)','lines'],['skills','Skills used (one per line)','lines'],['achievements','Role achievements (one per line)','lines'],['logo_path','Company logo','image']],achievements:[['title','Achievement title'],['date','Date','date'],['category','Category'],['description','Description','textarea'],['image_path','Supporting image','image']],skills:[['name','Skill'],['category','Category'],['description','Description']],certifications:[['title','Certificate title'],['issuer','Issuing organization'],['issue_date','Issue date','date'],['expiration_date','Expiry date','date'],['credential_id','Credential ID'],['credential_url','Verification URL'],['file_path','Certificate image or PDF','file']],projects:[['title','Project title'],['category','Category'],['date','Date','date'],['description','Description','textarea'],['problem','Business problem','textarea'],['solution','Solution','textarea'],['impact','Business impact','textarea'],['technologies','Technologies (one per line)','lines'],['image_path','Project screenshot','image'],['github_url','GitHub URL'],['demo_url','Live demo URL'],['featured','Featured','check']],portfolio_videos:[['title','Video title'],['category','Category'],['description','Description','textarea'],['video_path','Upload video (MP4 or WebM)','video'],['thumbnail_path','Thumbnail','image'],['project_id','Related project ID (optional)']]};const pretty={work_experiences:'Work Experience',achievements:'Achievements',skills:'Skills',certifications:'Certifications',projects:'Projects',portfolio_videos:'Videos'};const IconButton=({children,...props})=><button className="btn" {...props}>{children}</button>;function useSite(){const[profile,setProfile]=useState(seedProfile),[data,setData]=useState({work_experiences:seedExperience,skills:seedSkills,achievements:[],certifications:[],projects:[],portfolio_videos:[]}),[loading,setLoading]=useState(configured);const reload=async()=>{if(!supabase)return;const results=await Promise.all([supabase.from('profiles').select('*').eq('id',1).maybeSingle(),...tables.map(t=>supabase.from(t).select('*').eq('published',true))]);if(results[0].data)setProfile({...seedProfile,...results[0].data});const next={};tables.forEach((t,i)=>next[t]=results[i+1].data||[]);setData(next);setLoading(false)};useEffect(()=>{reload()},[]);return{profile,data,loading,reload,setProfile}}function Header({profile,dark,setDark}){const[open,setOpen]=useState(false);const links=[['/','Home'],['/experience','Experience'],['/skills','Skills'],['/achievements','Achievements'],['/projects','Projects'],['/certifications','Certifications'],['/videos','Videos'],['/contact','Contact']];return <header className="site-header"><div className="shell nav-inner"><Link to="/" className="brand">PERRY <span>DAVE</span> GERON</Link><nav className={`${open?'nav-open':''} site-nav`}>{links.map(([url,name])=><NavLink key={url} to={url} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'selected':''}>{name}</NavLink>)}</nav><div className="nav-actions"><button className="theme-switch" aria-label="Toggle theme" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button><Link to="/contact" className="btn btn-primary nav-contact">Contact Me</Link><button aria-label="Open navigation" className="mobile-menu" onClick={()=>setOpen(!open)}><Menu size={22}/></button></div></div></header>}function Footer({profile}){return <footer className="border-t border-blue-100 py-8 mt-16"><div className="shell flex justify-between gap-3 flex-wrap text-sm muted"><span>© {new Date().getFullYear()} {profile.name}. Built with React & Supabase.</span><div className="flex gap-4"><Link to="/contact">Contact</Link><Link to="/admin">Admin</Link></div></div></footer>}function Page({title,subtitle,children}){return <div className="shell section min-h-[60vh]"><h1 className="section-title">{title}</h1>{subtitle&&<p className="muted mb-8">{subtitle}</p>}{children}</div>}function Home({profile,data}){const stats=[['10+','Years Experience',Briefcase],[data.skills.length||'—','Key Skills',Code2],[data.projects.length||'—','Projects',BarChart3],[data.certifications.length||'—','Certifications',Award]];return <><section className="hero-bg"><div className="shell hero-grid"><div className="hero-copy"><p className="hero-greeting">Hello, I'm</p><h1 className="hero-title">{profile.name}</h1><h2 className="hero-role">{profile.title}</h2><p className="hero-tagline">{profile.tagline}</p><p className="hero-description">{profile.bio}</p><div className="hero-facts"><span><MapPin size={17}/>{profile.location}</span><span><Briefcase size={17}/>10+ Years Experience</span></div><div className="hero-buttons">{profile.resume_url&&<a className="btn btn-primary" href={profile.resume_url} target="_blank" rel="noreferrer"><Download size={17}/>Download Resume</a>}<Link to="/projects" className="btn btn-primary"><FolderOpen size={17}/>View Projects</Link><Link to="/contact" className="btn btn-outline"><Mail size={17}/>Contact Me</Link></div><div className="hero-socials">{profile.linkedin&&<a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}<a href={profile.github||'https://github.com/geronpd09'} target="_blank" rel="noreferrer">GitHub ↗</a>{profile.email&&<a href={`mailto:${profile.email}`}>Email ↗</a>}</div></div><div className="hero-visual"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="portrait-frame">{profile.photo_url?<img src={profile.photo_url} alt={`Portrait of ${profile.name}`}/>:<div className="portrait-placeholder"><span>PDG</span><p>Your professional photo</p><small>Upload from the admin dashboard</small></div>}</div></div></div></section><div className="shell stats-overlap"><div className="stats-bar">{stats.map(([n,t,I])=><div className="stat-item" key={t}><I size={25}/><strong>{n}</strong><span>{t}</span></div>)}</div></div><section className="shell section about-section"><div><p className="section-kicker">GET TO KNOW ME</p><h2 className="section-title">About Me</h2></div><p className="about-copy">{profile.about}</p></section><section className="shell section"><div className="section-heading"><div><p className="section-kicker">SELECTED WORK</p><h2 className="section-title">Featured Projects</h2></div><Link className="section-more" to="/projects">View all projects <ArrowRight size={16}/></Link></div><ProjectCards items={data.projects.filter(p=>p.featured).slice(0,3)}/></section><section className="shell section"><div className="section-heading"><div><p className="section-kicker">PROJECT DEMONSTRATIONS</p><h2 className="section-title">My Work in Action</h2><p className="muted">Watch demonstrations of dashboards, analytics and automation.</p></div><Link className="section-more" to="/videos">All videos <ArrowRight size={16}/></Link></div><VideoCards items={data.portfolio_videos.slice(0,3)}/></section></>}function Experience({data}){const[q,setQ]=useState('');const items=[...data.work_experiences].filter(x=>`${x.company} ${x.position}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>String(b.start_date||'').localeCompare(String(a.start_date||'')));return <Page title="Work Experience" subtitle="My professional journey across data analytics, reporting and automation."><div className="panel experience-panel"><div className="experience-search"><Search size={18}/><input aria-label="Search work experience" placeholder="Search company, position or keyword..." value={q} onChange={e=>setQ(e.target.value)}/></div><div className="tablewrap"><table className="datatable experience-table"><thead><tr>{['Company','Position','Period','Duration','Location',''].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{items.map(x=><tr key={x.id}><td><div className="company-cell"><div className="company-mark">{x.logo_path?<img src={fileUrl('portfolio-public',x.logo_path)} alt=""/>:x.company?.slice(0,2).toUpperCase()}</div><strong>{x.company}</strong></div></td><td>{x.position}</td><td>{dateLabel(x.start_date)} – {x.is_current?'Present':dateLabel(x.end_date)}</td><td>{durationLabel(x.start_date,x.is_current?null:x.end_date)}</td><td>{x.location}</td><td><Link aria-label={`View ${x.position} details`} className="row-arrow" to={`/experience/${x.id}`}><ArrowRight size={18}/></Link></td></tr>)}</tbody></table>{!items.length&&<Empty/>}</div></div></Page>}function durationLabel(start,end){if(!start)return '—';const a=new Date(start),b=end?new Date(end):new Date();if(Number.isNaN(a.getTime())||Number.isNaN(b.getTime()))return '—';const months=Math.max(0,(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth());return `${Math.floor(months/12)} yrs ${months%12} mos`;}function ExperienceDetail({data}){const{id}=useParams();const x=data.work_experiences.find(v=>String(v.id)===id);const[tab,setTab]=useState('Overview'),[reaction,setReaction]=useState(null),[counts,setCounts]=useState({like:0,dislike:0}),[busy,setBusy]=useState(false);useEffect(()=>{if(!supabase||!x||String(x.id).startsWith('sample'))return;supabase.from('reaction_counts').select('*').eq('experience_id',id).maybeSingle().then(({data:r})=>r&&setCounts({like:r.likes||0,dislike:r.dislikes||0}))},[id,x]);async function vote(kind){if(!supabase||String(id).startsWith('sample'))return alert('Reactions require Supabase setup.');setBusy(true);try{const{data:r,error}=await supabase.functions.invoke('react-experience',{body:{experience_id:id,reaction:reaction===kind?null:kind}});if(error)throw error;setReaction(reaction===kind?null:kind);if(r?.counts)setCounts(r.counts)}catch(e){alert(e.message)}finally{setBusy(false)}}if(!x)return <Page title="Experience not found"><Link to="/experience">Back to experience</Link></Page>;const panels={'Overview':<><h3>About This Role</h3><p className="muted leading-7">{x.summary}</p><div className="role-facts"><div><span>Employment Type</span><strong>{x.employment_type||'—'}</strong></div><div><span>Location</span><strong>{x.location||'—'}</strong></div><div><span>Duration</span><strong>{durationLabel(x.start_date,x.is_current?null:x.end_date)}</strong></div><div><span>Period</span><strong>{dateLabel(x.start_date)} – {x.is_current?'Present':dateLabel(x.end_date)}</strong></div></div></>,'Responsibilities':<><h3>Roles & Responsibilities</h3><ul className="detail-list">{(x.responsibilities||[]).map((v,i)=><li key={i}>{v}</li>)}</ul></>,'Skills':<><h3>Skills Used</h3><div className="flex flex-wrap gap-2">{(x.skills||[]).map((v,i)=><span className="tag" key={i}>{v}</span>)}</div></>,'Achievements':<><h3>Key Achievements</h3><ul className="detail-list">{(x.achievements||[]).map((v,i)=><li key={i}>{v}</li>)}</ul></>,'Projects':<><h3>Related Projects</h3><p className="muted">Explore relevant work in the projects section.</p><Link className="section-more" to="/projects">View projects <ArrowRight size={16}/></Link></>};return <div className="shell section detail-page"><Link className="back-link" to="/experience"><ArrowLeft size={16}/> Back to Work Experience</Link><div className="role-banner panel"><div className="company-mark company-mark-large">{x.logo_path?<img src={fileUrl('portfolio-public',x.logo_path)} alt=""/>:x.company?.slice(0,2).toUpperCase()}</div><div className="role-heading"><h1>{x.position}</h1><p>{x.company}</p><div className="role-meta"><span>{dateLabel(x.start_date)} – {x.is_current?'Present':dateLabel(x.end_date)}</span><span>{durationLabel(x.start_date,x.is_current?null:x.end_date)}</span><span>{x.location}</span></div></div>{x.is_current&&<span className="employment-status">Currently Employed</span>}</div><div className="panel role-body"><div className="role-tabs" role="tablist" aria-label="Experience details">{Object.keys(panels).map(t=><button role="tab" aria-selected={tab===t} className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div><div className="role-content" role="tabpanel">{panels[tab]}</div><div className="reaction-panel"><strong>Was this experience helpful or interesting?</strong><div className="reaction-buttons"><button disabled={busy} onClick={()=>vote('like')} className={`btn ${reaction==='like'?'btn-primary':'btn-outline'}`}><ThumbsUp size={16}/> Like {counts.like}</button><button disabled={busy} onClick={()=>vote('dislike')} className={`btn ${reaction==='dislike'?'btn-primary':'btn-outline'}`}><ThumbsDown size={16}/> Dislike {counts.dislike}</button></div><small>Reactions become available after Supabase is connected.</small></div></div></div>}function Empty(){return <p className="text-center muted py-10">No published entries yet. Add them from the admin dashboard.</p>}function Skills({data}){const groups={};data.skills.forEach(s=>(groups[s.category||'Other']??=[]).push(s));return <Page title="Technical Skills" subtitle="Tools and technologies I use in my work."><div className="grid md:grid-cols-2 gap-5">{Object.entries(groups).map(([cat,items])=><div className="panel p-6" key={cat}><h3 className="font-extrabold mb-4">{cat}</h3><div className="flex flex-wrap gap-2">{items.map(s=><span className="tag" key={s.id}>{s.name}</span>)}</div></div>)}</div>{!data.skills.length&&<Empty/>}</Page>}function Achievements({data}){return <Page title="Key Achievements" subtitle="Professional accomplishments, awards, and improvements."><div className="panel tablewrap"><table className="datatable"><thead><tr><th>Date</th><th>Achievement</th><th>Category</th><th>Description</th></tr></thead><tbody>{[...data.achievements].sort((a,b)=>String(b.date).localeCompare(String(a.date))).map(a=><tr key={a.id}><td>{dateLabel(a.date)}</td><td className="font-bold">{a.title}</td><td><span className="tag">{a.category}</span></td><td>{a.description}</td></tr>)}</tbody></table>{!data.achievements.length&&<Empty/>}</div></Page>}function Certifications({data}){return <Page title="Certifications" subtitle="Credentials, learning and professional development."><div className="grid md:grid-cols-3 gap-5">{data.certifications.map(c=><div className="panel p-6" key={c.id}><GraduationCap size={28} className="text-blue-600 mb-4"/><h3 className="font-extrabold">{c.title}</h3><p className="muted mt-2">{c.issuer}</p><p className="text-xs muted mt-2">{dateLabel(c.issue_date)}</p><div className="flex gap-3 mt-4">{c.credential_url&&<a href={c.credential_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">Verify ↗</a>}{c.file_path&&<a href={fileUrl('portfolio-public',c.file_path)} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">View file ↗</a>}</div></div>)}</div>{!data.certifications.length&&<Empty/>}</Page>}





function ProjectImageViewer({ src, title, onClose }) {

  const [zoom, setZoom] = useState(1);



  useEffect(() => {

    const handleKeyDown = (event) => {

      if (event.key === 'Escape') onClose();

    };



    document.addEventListener('keydown', handleKeyDown);

    document.body.style.overflow = 'hidden';



    return () => {

      document.removeEventListener('keydown', handleKeyDown);

      document.body.style.overflow = '';

    };

  }, [onClose]);



  return (

    <div

      className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4"

      role="dialog"

      aria-modal="true"

      aria-label={`Image viewer: ${title}`}

      onClick={onClose}

    >

      <div

        className="flex items-center gap-3 mb-4 text-white"

        onClick={(e) => e.stopPropagation()}

      >

        <button

          className="btn bg-white text-black"

          onClick={() => setZoom(z => Math.max(1, z - 0.25))}

        >

          Zoom −

        </button>



        <span>{Math.round(zoom * 100)}%</span>



        <button

          className="btn bg-white text-black"

          onClick={() => setZoom(z => Math.min(3, z + 0.25))}

        >

          Zoom +

        </button>



        <button

          className="btn bg-white text-black"

          onClick={onClose}

          aria-label="Close image viewer"

        >

          ✕

        </button>

      </div>



      <div

        className="max-w-[95vw] max-h-[80vh] overflow-auto"

        onClick={(e) => e.stopPropagation()}

      >

        <img

          src={src}

          alt={title}

          style={{

            width: `${zoom * 100}%`,

            maxWidth: 'none'

          }}

          className="block rounded-lg"

        />

      </div>



      <p className="text-white text-sm mt-3">{title}</p>

    </div>

  );

}







function ProjectCards({ items }) {

  const [selectedImage, setSelectedImage] = useState(null);



  if (!items.length) return <Empty />;



  return (

    <>

      <div className="grid md:grid-cols-3 gap-5">

        {items.map(p => (

          <div className="panel overflow-hidden" key={p.id}>

            {p.image_path ? (

              <button

                type="button"

                className="block w-full cursor-zoom-in"

                aria-label={`View full image of ${p.title}`}

                onClick={() => setSelectedImage({

                  src: fileUrl('portfolio-public', p.image_path),

                  title: p.title

                })}

              >

                <img

                  src={fileUrl('portfolio-public', p.image_path)}

                  alt={p.title}

                  className="w-full h-44 object-cover hover:opacity-90 transition"

                />

              </button>

            ) : (

              <div className="h-44 bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">

                <BarChart3 className="text-blue-500" size={54} />

              </div>

            )}



            <div className="p-5">

              <span className="tag">{p.category || 'Project'}</span>

              <h3 className="font-extrabold text-lg mt-3">{p.title}</h3>

              <p className="muted text-sm my-3">{p.description}</p>



              <div className="flex gap-3 text-blue-600 text-sm font-bold">

                {p.github_url && (

                  <a href={p.github_url} target="_blank" rel="noreferrer">

                    Code ↗

                  </a>

                )}

                {p.demo_url && (

                  <a href={p.demo_url} target="_blank" rel="noreferrer">

                    Live demo ↗

                  </a>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>



      {selectedImage && (

        <ProjectImageViewer

          src={selectedImage.src}

          title={selectedImage.title}

          onClose={() => setSelectedImage(null)}

        />

      )}

    </>

  );

}

function Projects({data}){return <Page title="Featured Projects" subtitle="Selected analytics, dashboard, and automation work."><ProjectCards items={data.projects}/></Page>}function VideoCards({items}){return items.length?<div className="grid md:grid-cols-3 gap-5">{items.map(v=><Link to={`/videos/${v.id}`} target="_blank" rel="noopener noreferrer" className="panel overflow-hidden block group" key={v.id}><div className="relative h-44 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">{v.thumbnail_path&&<img className="absolute inset-0 w-full h-full object-cover" src={fileUrl('portfolio-public',v.thumbnail_path)} alt="Video thumbnail"/>}<div className="relative bg-blue-600 text-white rounded-full p-4 group-hover:scale-110 transition"><Video size={26}/></div></div><div className="p-5"><h3 className="font-extrabold">{v.title}</h3><p className="muted text-sm my-2">{v.description}</p><span className="text-blue-600 text-sm font-bold">Watch video ↗</span></div></Link>)}</div>:<Empty/>}function Videos({data}){return <Page title="My Work in Action" subtitle="Video walkthroughs and demonstrations of my projects."><VideoCards items={data.portfolio_videos}/></Page>}function VideoDetail({data}){const{id}=useParams();const v=data.portfolio_videos.find(x=>String(x.id)===id);return <Page title={v?.title||'Video not found'} subtitle={v?.description}>{v?.video_path?<div className="panel p-4"><video controls preload="metadata" poster={v.thumbnail_path?fileUrl('portfolio-public',v.thumbnail_path):undefined} className="w-full rounded-lg" src={fileUrl('portfolio-videos',v.video_path)}>Your browser does not support HTML5 video.</video></div>:<Empty/>}<Link className="btn mt-5" to="/videos"><ArrowLeft size={16}/> All videos</Link></Page>}



function Contact({ profile }) {

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [subject, setSubject] = useState('');

  const [message, setMessage] = useState('');

  const [status, setStatus] = useState('');



  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus('Sending your message...');
    try {
      await emailjs.send(
        'service_tq38eaf',
        'template_mbej7m6',
        {
          from_name: name,
          reply_to: email,
          subject,
          message,
        },
        { publicKey: 'nDN94apSgSCadY7we' }
      );
      setStatus('Message sent successfully! Thank you for reaching out.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  }
  return (

    <Page

      title="Let's Connect"

      subtitle="Have a question or opportunity? Send me a message."

    >

      <div className="grid md:grid-cols-5 gap-6">

        <div className="panel p-6 md:col-span-2">

          <h3 className="font-extrabold text-lg mb-4">Contact Details</h3>

          <p className="muted mb-3">

            <MapPin className="inline mr-2" size={17} />

            {profile.location}

          </p>



          {profile.email ? (

            <a className="text-blue-600 break-all" href={`mailto:${profile.email}`}>

              {profile.email}

            </a>

          ) : (

            <p className="muted">Email will appear once configured.</p>

          )}



          <div className="mt-5 flex gap-4 text-blue-600">

            {profile.linkedin && (

              <a href={profile.linkedin} target="_blank" rel="noreferrer">

                LinkedIn ↗

              </a>

            )}

            {profile.github && (

              <a href={profile.github} target="_blank" rel="noreferrer">

                GitHub ↗

              </a>

            )}

          </div>

        </div>



        <form onSubmit={submit} className="panel p-6 md:col-span-3 space-y-4">

          <h3 className="font-extrabold text-lg">Send a Message</h3>



          {[

            ['Your name', name, setName],

            ['Your email', email, setEmail],

            ['Subject', subject, setSubject]

          ].map(([label, value, setter]) => (

            <label key={label} className="block">

              <span className="label">{label}</span>

              <input

                required

                maxLength={150}

                type={label === 'Your email' ? 'email' : 'text'}

                className="field"

                value={value}

                onChange={e => setter(e.target.value)}

              />

            </label>

          ))}



          <label className="block">

            <span className="label">Message</span>

            <textarea

              required

              maxLength={4000}

              rows={5}

              className="field"

              value={message}

              onChange={e => setMessage(e.target.value)}

            />

          </label>



          <button type="submit" className="btn btn-primary" disabled={sending}>

            {sending ? "Sending..." : "Send Message"}

          </button>



          {status && (

            <p role="status" className="text-sm muted">{status}</p>

          )}

        </form>

      </div>

    </Page>

  );

}

function Admin({reload,profile}){const[session,setSession]=useState(null),[ready,setReady]=useState(false),[section,setSection]=useState('overview'),[items,setItems]=useState([]),[editing,setEditing]=useState(null),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[form,setForm]=useState({}),[authEmail,setAuthEmail]=useState(''),[authPassword,setAuthPassword]=useState('');useEffect(()=>{if(!supabase){setReady(true);return}supabase.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)});const{data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);useEffect(()=>{if(session&&tables.includes(section))load()},[section,session]);async function load(){const{data,error}=await supabase.from(section).select('*').order('created_at',{ascending:false});if(error)setNotice(error.message);else setItems(data||[])}async function login(e){e.preventDefault();setBusy(true);const{error}=await supabase.auth.signInWithPassword({email:authEmail,password:authPassword});setNotice(error?error.message:'Signed in');setBusy(false)}async function save(e){e.preventDefault();setBusy(true);try{let obj={...form};for(const [name,,type] of fields[section]){if(type==='lines')obj[name]=String(obj[name]||'').split('\n').map(x=>x.trim()).filter(Boolean);if(type==='date'&&!obj[name])obj[name]=null;if(type==='image'||type==='file'||type==='video'){if(obj[name] instanceof File){const file=obj[name];const allowed=type==='video'?['video/mp4','video/webm']:type==='file'?['image/png','image/jpeg','image/webp','application/pdf']:['image/png','image/jpeg','image/webp'];if(!allowed.includes(file.type))throw Error('Unsupported file type');if(file.size>(type==='video'?50:10)*1024*1024)throw Error('File too large. Video limit: 50 MB; other files: 10 MB.');obj[name]=await uploadFile(type==='video'?'portfolio-videos':'portfolio-public',file)}else if(!obj[name])obj[name]=null}}const id=obj.id;delete obj.id;delete obj.created_at;delete obj.updated_at;const result=id?await supabase.from(section).update(obj).eq('id',id):await supabase.from(section).insert(obj);if(result.error)throw result.error;setEditing(null);setNotice('Saved successfully');await load();reload()}catch(err){setNotice(err.message)}finally{setBusy(false)}}async function remove(id){if(!confirm('Delete this entry permanently?'))return;const{error}=await supabase.from(section).delete().eq('id',id);setNotice(error?error.message:'Deleted');load();reload()}async function saveProfile(e){e.preventDefault();setBusy(true);try{const p={...form,id:1};if(p.photo_file instanceof File){if(!['image/jpeg','image/png','image/webp'].includes(p.photo_file.type)||p.photo_file.size>10*1024*1024)throw Error('Choose a JPG, PNG or WebP under 10 MB');p.photo_url=fileUrl('portfolio-public',await uploadFile('portfolio-public',p.photo_file))}delete p.photo_file;if(p.resume_file instanceof File){if(p.resume_file.type!=='application/pdf'||p.resume_file.size>10*1024*1024)throw Error('Resume must be PDF under 10 MB');p.resume_url=fileUrl('portfolio-public',await uploadFile('portfolio-public',p.resume_file))}delete p.resume_file;const{error}=await supabase.from('profiles').upsert(p);if(error)throw error;setNotice('Profile updated');reload()}catch(err){setNotice(err.message)}finally{setBusy(false)}}if(!configured)return <Page title="Admin Setup"><div className="panel p-6"><p>Connect Supabase first. Copy <code>.env.example</code> to <code>.env</code> and enter your project URL and publishable key. See README.md.</p></div></Page>;if(!ready)return <Page title="Loading admin..."/>;if(!session)return <div className="shell max-w-md py-20"><form className="panel p-8 space-y-4" onSubmit={login}><ShieldCheck className="text-blue-600" size={36}/><h1 className="text-2xl font-extrabold">Admin Sign In</h1><p className="muted text-sm">Only approved administrator accounts can change your portfolio.</p><input required className="field" type="email" placeholder="Email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)}/><input required className="field" type="password" placeholder="Password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)}/><button className="btn btn-primary w-full" disabled={busy}>Sign In</button>{notice&&<p className="muted text-sm" role="status">{notice}</p>}</form></div>;const nav=[['overview','Overview',BarChart3],['profile','Personal Information',Settings],...tables.map(t=>[t,pretty[t],t==='portfolio_videos'?Video:Briefcase])];return <div className="shell py-8"><div className="flex admin-layout gap-6"><aside className="panel p-4 w-60 admin-side shrink-0 h-fit"><p className="font-extrabold px-3 py-3">Portfolio Admin</p><nav className="admin-nav">{nav.map(([key,label,I])=><a href="#" className={section===key?'active':''} key={key} onClick={e=>{e.preventDefault();setSection(key);setEditing(null);setNotice('')}}><I size={17}/>{label}</a>)}<a href="#" onClick={async e=>{e.preventDefault();await supabase.auth.signOut()}}><LogOut size={17}/>Logout</a></nav></aside><main className="flex-1 min-w-0"><div className="flex justify-between items-center gap-3 mb-5"><div><h1 className="section-title !mb-0">{section==='overview'?'Dashboard Overview':section==='profile'?'Personal Information':pretty[section]}</h1><p className="muted text-sm">Manage your published portfolio content.</p></div>{tables.includes(section)&&<button className="btn btn-primary" onClick={()=>{setForm({published:true});setEditing('new')}}><Plus size={16}/> Add New</button>}</div>{notice&&<p role="status" className="panel p-3 mb-4 text-sm text-blue-700">{notice}</p>}{section==='overview'&&<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[['Experiences','work_experiences'],['Achievements','achievements'],['Skills','skills'],['Certifications','certifications'],['Projects','projects'],['Videos','portfolio_videos']].map(([name,t])=><div className="panel p-6" key={t}><p className="muted text-sm">{name}</p><p className="text-3xl font-extrabold mt-2">{t==='work_experiences'? 'Manage →':'View →'}</p><button className="text-blue-600 text-sm mt-2" onClick={()=>setSection(t)}>Open manager</button></div>)}<div className="panel p-6"><p className="muted">Visitor analytics</p><p className="text-sm mt-2">Available after deploying the visitor tracking Edge Function.</p></div></div>}{section==='profile'&&<form className="panel p-6 grid md:grid-cols-2 gap-4" onSubmit={saveProfile}>{[['name','Full Name'],['title','Job Title'],['tagline','Professional Tagline'],['location','Location'],['email','Contact Email'],['linkedin','LinkedIn URL'],['github','GitHub URL'],['bio','Short Introduction'],['about','About Me']].map(([key,label])=><label key={key}><span className="label">{label}</span>{['bio','about'].includes(key)?<textarea className="field" rows={4} value={form[key]??profile[key]??''} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>:<input className="field" value={form[key]??profile[key]??''} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>}</label>)}<label><span className="label">Profile Photo</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setForm(f=>({...f,photo_file:e.target.files[0]}))}/></label><label><span className="label">Resume PDF</span><input type="file" accept="application/pdf" onChange={e=>setForm(f=>({...f,resume_file:e.target.files[0]}))}/></label><div className="md:col-span-2"><button disabled={busy} className="btn btn-primary"><Save size={16}/> Save Profile</button></div></form>}{tables.includes(section)&&<div className="panel tablewrap"><table className="datatable"><thead><tr><th>Title / Name</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{items.map(x=><tr key={x.id}><td className="font-bold">{x.title||x.name||x.position||x.company}</td><td><span className="tag">{x.published?'Published':'Draft'}</span></td><td>{x.created_at?new Date(x.created_at).toLocaleDateString():'—'}</td><td><div className="flex gap-2"><button aria-label="Edit" onClick={()=>{setForm(x);setEditing(x.id)}}><Pencil size={17} className="text-blue-600"/></button><button aria-label="Delete" onClick={()=>remove(x.id)}><Trash2 size={17} className="text-red-500"/></button></div></td></tr>)}</tbody></table>{!items.length&&<Empty/>}</div>}</main></div>{editing!==null&&<div className="modal-back" onClick={()=>setEditing(null)}><form className="modal" onClick={e=>e.stopPropagation()} onSubmit={save}><div className="flex justify-between items-center mb-5"><h2 className="text-xl font-extrabold">{editing==='new'?'Add':'Edit'} {pretty[section]}</h2><button type="button" onClick={()=>setEditing(null)}>✕</button></div><div className="grid md:grid-cols-2 gap-4">{fields[section].map(([key,label,type])=><label key={key} className={['textarea','lines'].includes(type)?'md:col-span-2':''}><span className="label">{label}</span>{type==='check'?<input type="checkbox" checked={Boolean(form[key])} onChange={e=>setForm(f=>({...f,[key]:e.target.checked}))}/>:['textarea','lines'].includes(type)?<textarea className="field" rows={4} value={type==='lines'&&Array.isArray(form[key])?form[key].join('\n'):form[key]||''} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>:['image','video','file'].includes(type)?<input type="file" accept={type==='video'?'video/mp4,video/webm':type==='file'?'image/*,application/pdf':'image/png,image/jpeg,image/webp'} onChange={e=>setForm(f=>({...f,[key]:e.target.files[0]}))}/>:<input className="field" type={type==='date'?'date':'text'} value={form[key]||''} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>}</label>)}<label className="flex gap-2 items-center md:col-span-2"><input type="checkbox" checked={Boolean(form.published)} onChange={e=>setForm(f=>({...f,published:e.target.checked}))}/> Publish publicly</label></div><div className="flex gap-3 mt-6 justify-end"><button type="button" className="btn" onClick={()=>setEditing(null)}>Cancel</button><button disabled={busy} className="btn btn-primary">{busy?'Saving...':'Save Entry'}</button></div></form></div>}</div>}

export default function App(){const{profile,data,loading,reload}=useSite();const[dark,setDark]=useState(false);return <div className={dark?'dark min-h-screen':'min-h-screen'}><Header profile={profile} dark={dark} setDark={setDark}/>{loading?<Page title="Loading portfolio..."/>:<Routes><Route path="/" element={<Home profile={profile} data={data}/>}/><Route path="/experience" element={<Experience data={data}/>}/><Route path="/experience/:id" element={<ExperienceDetail data={data}/>}/><Route path="/skills" element={<Skills data={data}/>}/><Route path="/achievements" element={<Achievements data={data}/>}/><Route path="/certifications" element={<Certifications data={data}/>}/><Route path="/projects" element={<Projects data={data}/>}/><Route path="/videos" element={<Videos data={data}/>}/><Route path="/videos/:id" element={<VideoDetail data={data}/>}/><Route path="/contact" element={<Contact profile={profile}/>}/><Route path="/admin" element={<Admin reload={reload} profile={profile}/>}/><Route path="*" element={<Page title="Page not found"><Link to="/">Return home</Link></Page>}/></Routes>}<Footer profile={profile}/></div>}
