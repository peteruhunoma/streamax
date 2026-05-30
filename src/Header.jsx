import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from './auth';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default function Header({ onMenuToggle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const {currentuser, logout} = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const[imageview, setImageview] = useState([]);
  const history = useHistory();
  const [userid, setUserid] = useState(currentuser?.id)
  // Close the popup menu if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUploadRedirect = () => {
    window.location.href = '/upload';
  };

  const handleManageChannel = () => {
    window.location.href = `/channel/${currentuser.id}`; 
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Pushes query string parameters directly to the search screen path
      history.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    useEffect(() => {
      getUserImage();
    }, [])
    
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between px-6 h-16 w-full max-w-[1920px] mx-auto">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="p-2 hover:bg-[#2d3449] rounded-full transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface">menu</span>
          </button>
          <span className="text-2xl font-extrabold text-[#b4c5ff] tracking-tighter font-headline">Streamax</span>
        </div>
        
        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border-none text-on-surface placeholder:text-on-surface-variant/50 rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/40 transition-all font-body text-sm" 
              placeholder="Explore the canvas..." 
              type="text" 
            />
          </form>
        </div>
   {/* Right: Actions */}
{ currentuser?.id ?   
        (
        <div className="flex items-center gap-3">
          <button 
            onClick={handleUploadRedirect} 
            className="p-2 text-[#b4c5ff] hover:bg-[#2d3449] hover:text-[#dae2fd] transition-all duration-300 rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined" data-icon="video_call">video_call</span>
          </button>

          {/* Profile Picture Container with Dropdown Popup */}
          <div className="relative" ref={menuRef}>
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20 hover:ring-2 ring-primary/50 cursor-pointer transition-all ${isMenuOpen ? 'ring-2 ring-[#b4c5ff]' : ''}`}
            >
<img 
  alt="User Profile Avatar" 
  src={imageview ? `https://res.cloudinary.com/dsypjacgn/image/upload/v1780135714/${imageview}` : "https://res.cloudinary.com/dsypjacgn/image/upload/v1780138445/default_p42fbh.png"} 
/>
            </div>

            {/* Popup Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0f1932] border border-[#2d3449] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                
                <button
                  onClick={handleManageChannel}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#dae2fd] hover:bg-[#2d3449]/60 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-lg text-[#b4c5ff]">account_box</span>
                  <span>Manage Channel</span>
                </button>

                <hr className="border-[#2d3449] my-1" />
                
                <Link to='/uploadprofile'
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#dae2fd] hover:bg-[#2d3449]/60 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-lg text-[#b4c5ff]">account_box</span>
                  <span>Upload Profile Picture</span>
                </Link>

                <hr className="border-[#2d3449] my-1" />

                <button
                  onClick={()=> handleLogout()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Log Out</span>
                </button>

              </div>
            )}

          </div>

        </div> ) : (
       <div className="flex items-center gap-3 font-['Inter']">
       {/* Clean, glassmorphism style Sign Up Button */}
       <button 
         onClick={() => history.push('/signup')} // Replace with your routing logic
         className="px-4 py-2 text-xs md:text-sm font-semibold text-[#b4c5ff] hover:text-[#dae2fd] bg-transparent hover:bg-[#2d3449]/40 border border-[#b4c5ff]/20 hover:border-[#b4c5ff]/40 rounded-full transition-all duration-300 tracking-wide active:scale-95"
       >
        <Link to="/signup">Signup</Link>
       </button>
   
       {/* High-visibility, solid premium Accent Log In Button */}
       <button 
         onClick={() => history.push('/login')} // Replace with your routing logic
         className="px-5 py-2 text-xs md:text-sm font-bold bg-[#b4c5ff] text-[#060e20] rounded-full hover:opacity-90 shadow-[0_4px_20px_-5px_rgba(180,197,255,0.4)] transition-all duration-300 tracking-wide active:scale-95"
       >
         <Link to="/login">Log In</Link>
       </button>
     </div>
        )}
      </div>
    </header>
  );
}