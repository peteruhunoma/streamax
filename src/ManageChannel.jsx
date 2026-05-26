import axios from 'axios';
import moment from 'moment';
import React, {useState, useRef, useContext, useEffect} from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from './auth';
import Header from './Header';
import SideNav from './SideNav';

function ManageChannel() {
    const {currentuser} = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [fullname, setFullname] = useState([]);
    const [getSub, setGetSub] = useState([]);
    const [subed, setSubed] = useState([]);
    const[content, setContent] = useState([]);
    const[personalContent, setPersonalContent] = useState([]);
    const[imageview, setImageview] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRefs = useRef({});
    console.log(currentuser, "ggg")
    const [u, i, userid] = useLocation().pathname.split("/");
    console.log(typeof(currentuser.id), "iwiwiw", typeof(userid) );
    const videos = async ()=> {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/profilevideo`, {
            params: { userid }, 
            withCredentials: true
        });

        console.log(res);
        setContent(res.data)
    }
    const getUserImage = async ()=> {
      try{

        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/userimage/${userid}`, {
            withCredentials: true
        });
        setImageview(res.data.userimage[0].userimage)
        console.log(res, "pol");
      }catch(err){
        console.log(err);
      }
      }
    const details = async ()=> {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/details/${userid}`, {
            params: { userid }, 
            withCredentials: true
        });

        console.log(res, "oertt");
        setFullname(res.data[0]);
    }
    const personalvideos = async ()=> {

        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/personalprofile`, {
            params: { userid }, 
            withCredentials: true
        });
        console.log(res);
        setPersonalContent(res.data)
    }
    const deletevideos = async (videoid)=> {
        const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/deletevideo/${videoid}`, { 
            withCredentials: true
        });
        console.log(res);
        videos();
        personalvideos();
        details();
      }
    useEffect(() => {
      videos();
      personalvideos();
      details();
    }, []);
    
    const visibility = async (id, visible) => {
      if (visible === "private") {
        const status = "public";
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/posts/visibility`, { id, status }, { 
          withCredentials: true
        });
        console.log(res);
      }
      
      if (visible === "public") {
        const status = "private";
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/posts/visibility`, { id, status }, { 
          withCredentials: true
        });
        console.log(res);
      }
    };

    const addSubs = async ()=> {
      
      try{
        
        console.log(id);
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/subs`, {userid}, {
          withCredentials: true
        })
        console.log(res);
        
      }catch(err){
        console.log(err);
      }
      
    }
    const getSubs = async ()=> {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/subs/${userid}`,{
          withCredentials: true
        })
        console.log(res);
        setSubed(res.data.message);
        setGetSub(res.data.subs.length);
      }catch(err){
        console.log(err);
      }
      
    }
    useEffect(() => {
      videos();
      getSubs();
      personalvideos();
      getUserImage();
    }, []);
    
    console.log(fullname, "fullname")
    useEffect(() => {
        const handleClickOutside = (event) => {
          // Check if click is outside ALL menus
          const isOutsideAllMenus = Object.values(menuRefs.current).every(
            ref => ref && !ref.contains(event.target)
          );
          
          if (isOutsideAllMenus) {
            setOpenMenuId(null);
          }
        };
      
        if (openMenuId !== null) {
          document.addEventListener('mousedown', handleClickOutside);
        }
      
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [openMenuId]);
      

  return (
<div className="antialiased selection:bg-primary selection:text-on-primary">
  {/* TopNavBar Execution */}
  <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
  {/* SideNavBar Execution */}
  <SideNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
  {isSidebarOpen && (
    <div 
      onClick={() => setIsSidebarOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
    />
  )}

  {/* Main Content Canvas */}
  <main className="lg:ml-64 pt-16 min-h-screen bg-background">
    {/* Channel Info & Actions */}
    <section className="px-6 md:px-12 mt-16 ">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-background ring-4 ring-surface-container-high overflow-hidden">
            <img alt="Studio Nexus Avatar" className="w-full h-full rounded-full object-cover" src={`../public/uploadeduser/${fullname.fullname}/${imageview}`}/>
          </div>
          <div className="text-center md:text-left pt-4">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tighter">{fullname.fullname}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-on-surface-variant">
              <span className="text-sm font-medium tracking-wide">@{fullname.fullname}</span>
              <span className="w-1 h-1 bg-outline-variant/30 rounded-full"></span>
              <span className="text-sm font-medium tracking-wide">{getSub} subscribers</span>
              <span className="w-1 h-1 bg-outline-variant/30 rounded-full"></span>
              {Number(currentuser.id) === Number(userid) ? 
                <span className="text-sm font-medium tracking-wide">{personalContent.length} videos</span> :
                <span className="text-sm font-medium tracking-wide">{content.length} videos</span>
              }
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 self-center md:self-end pb-2">
          <button onClick={()=> addSubs()} className="px-8 py-3 bg-gradient-to-br from-primary to-on-primary-container text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            {subed === "subscribed" ? "subscribed" : "subscribe"}
          </button>
        </div>
      </div>
      {/* Tabs Navigation */}
      <nav className="mt-12 flex items-center gap-8 border-b border-outline-variant/10 overflow-x-auto no-scrollbar">
        <span className="pb-4 text-primary font-bold border-b-2 border-primary whitespace-nowrap" href="#">Home</span>
      </nav>
    </section>

    {/* Content Grids */}
    <section className="px-6 md:px-12 py-8 bg-surface-container-lowest/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-headline text-xl font-bold text-on-surface">Uploads</h3>
      </div>

      {/* FIXED: The responsive grid container wrapper sits outside the map function */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {Number(currentuser.id) === Number(userid) ? 
          (personalContent?.map(item => (
            <div key={item.id} className="group cursor-pointer flex flex-col justify-between h-full">
              <div>
                {/* Video Thumbnail Wrapper */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-surface-container-high">
                  <img 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={`../public/uploads/${item.username}/${item.title}/${item.thumbnails}`}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold rounded text-white">
                    08:45
                  </div>
                </div>
                
                {/* Title and Context Menu */}
                <div className='flex justify-between items-start gap-2'>
                  <h4 className="text-sm font-semibold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1">
                    {item.title}
                  </h4>
                  
                  {/* More Menu Button */}
                  <div className="relative shrink-0" ref={el => menuRefs.current[item.id] = el}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === item.id ? null : item.id);
                      }}
                      className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-2xl">more_vert</span>
                    </button>
                    
                    {/* Popup Menu */}
                    {openMenuId === item.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button 
                          onClick={() => {
                            setOpenMenuId(null);
                            visibility(item.id, item.visibility)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-lg">lock</span>
                          {item.visibility === "private" ? "Make Public" : "Make Private"} 
                        </button>
                        
                        <button 
                          onClick={() => {
                            deletevideos(item.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Metadata Container aligned to bottom */}
              <div className="mt-2 flex flex-col gap-0.5 text-xs text-on-surface-variant">
                <span>{item.views} views • {moment(item.created_at).fromNow()}</span>
              </div>
            </div>
          ))) :
          (content?.map(item => (
            <div key={item.id} className="group cursor-pointer flex flex-col justify-between h-full">
              <div>
                {/* Video Thumbnail Wrapper */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-surface-container-high">
                  <img 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={`../public/uploads/${item.username}/${item.title}/${item.thumbnails}`}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold rounded text-white">
                    08:45
                  </div>
                </div>
                
                <div className='flex justify-between items-start gap-2'>
                  <h4 className="text-sm font-semibold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1">
                    {item.title} 
                  </h4>
                </div>
              </div>
              
              {/* Metadata Container */}
              <div className="mt-2 flex flex-col gap-0.5 text-xs text-on-surface-variant">
                <span>{item.views} views • {moment(item.created_at).fromNow()}</span>
              </div>
            </div>
          )))
        }
      </div>
    </section>

    {/* Footer Branding */}
    <footer className="px-6 md:px-12 py-12 border-t border-outline-variant/5 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xl font-extrabold text-[#b4c5ff] tracking-tighter font-headline">Studio Nexus</span>
        <p className="text-on-surface-variant text-xs font-medium">© 2024 Cinematic Canvas. All creative rights reserved.</p>
      </div>
      <div className="flex items-center gap-6">
        <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest" href="#">Privacy</a>
        <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest" href="#">Terms</a>
        <a className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest" href="#">Contact</a>
      </div>
    </footer>
  </main>
</div>
  )
}

export default ManageChannel