import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment'; // Assuming moment is used for timestamps in your pipeline
import Header from './Header';
import SideNav from './SideNav';
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import { AuthContext } from './auth';

export default function LikedVideosPage() {
  // Mobile responsive sidebar navigation drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {currentuser} = useContext(AuthContext);
  const history = useHistory();

  // Mock Data Pipeline State
 const likedVideo = async () => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/likedvideo`, {
        withCredentials: true
      });
      setLikedVideos(res.data);
      console.log(res);
    }catch(err){
      console.log(err);
      if(err){
        history.push("/login");
      }
    }
 }
 const deletelikes = async (videoid)=> {
  try{
  const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/deletelike/${videoid}`, { 
      withCredentials: true
  });
  console.log(res);
  likedVideo();
  } catch(err){
    console.log(err);
    
  }
}
 
  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([ likedVideo() ]);
      setIsLoading(false);
    };
    
    fetchData();
   
  }, [])
  
  return (
 <>
 {isLoading ? (
  <div>loading</div>
 ):(
<div className="custom-scrollbar overflow-x-hidden min-h-screen bg-[#060e20] text-[#dae2fd]">
      
      {/* Navigation Headers */}
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <SideNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Clickable Mobile overlay backdrop dim sheet */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Content Layout Wrapper - Explicit desktop margin offset: md:ml-64 */}
      <main className="md:ml-64 pt-24 px-4 md:px-12 pb-12 min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Header Title Section */}
          <div className="flex items-center justify-between border-b border-[#2d3449]/40 pb-5 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#dae2fd] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#b4c5ff] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                Liked Videos
              </h1>
              <p className="text-xs text-[#c6c6cd]/60 mt-1">
                Your private collection containing <span className="text-[#b4c5ff] font-semibold">{likedVideos.length} items</span>
              </p>
            </div>
          </div>

          {/* Clean Core Videos Stream List */}
          <div className="flex flex-col gap-2">
          {!currentuser?.id ? (
  /* Guest / Not Logged In State */
  <div className="w-full py-28 flex flex-col items-center justify-center text-center border border-dashed border-[#2d3449]/40 rounded-3xl bg-[#2d3449]/5 mt-4">
    <span className="material-symbols-outlined text-5xl text-[#c6c6cd]/20 mb-4">
      account_circle
    </span>
    <h2 className="text-base font-bold text-[#dae2fd] mb-1">You are not logged in</h2>
    <p className="text-xs text-[#c6c6cd]/50 max-w-xs leading-relaxed">
      Please sign in to view and manage your liked videos directory feed.
    </p>
  </div>
) : likedVideos.length > 0 ? (
  /* Logged In & Has Liked Videos */
  likedVideos.map((video, index) => (
    <div 
      key={video.id}
      className="flex items-center gap-4 p-3.5 bg-transparent hover:bg-[#2d3449]/20 border border-transparent hover:border-[#2d3449]/30 rounded-2xl cursor-pointer group transition-all duration-200"
    >
      {/* Item Order Index Counter Indicator */}
      <span className="hidden sm:block text-xs font-bold text-[#c6c6cd]/30 w-5 text-center">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Thumbnail Container */}
      <div className="relative w-32 sm:w-48 shrink-0 aspect-video rounded-xl overflow-hidden bg-[#2d3449]/20 shadow-md">
        <img 
          alt="Video Preview Block" 
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" 
          src={`/uploads/${video.username}/${video.title}/${video.thumbnails}`} 
        />
        <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur text-[10px] px-1.5 py-0.5 rounded text-white font-bold tracking-wider">
          {video.duration}
        </span>
      </div>

      {/* Text Title & Content Creators Meta Space */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <h3 className="text-sm sm:text-base font-bold text-[#dae2fd] leading-snug line-clamp-2 group-hover:text-[#b4c5ff] transition-colors capitalize">
          {video.title}
        </h3>
        <p className="text-xs text-[#c6c6cd]/70 truncate capitalize mt-0.5">
          {video.username}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-[#c6c6cd]/40 font-medium mt-1">
          <span>{video.views} views</span>
          <span className="w-1 h-1 bg-[#2d3449] rounded-full"></span>
          <span>{moment(video.created_at).fromNow()}</span>
        </div>
      </div>

      {/* Unlike Video / Trash Trigger Button Option */}
      <button 
        onClick={() => deletelikes(video.like_id) }
        className="p-2.5 text-[#c6c6cd]/30 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all shrink-0 active:scale-95 ml-2"
        title="Remove from Liked Videos"
      >
        <span className="material-symbols-outlined text-xl">delete</span>
      </button>
    </div>
  ))
) : (
  /* Logged In but Blank Empty Placeholder State */
  <div className="w-full py-28 flex flex-col items-center justify-center text-center border border-dashed border-[#2d3449]/40 rounded-3xl bg-[#2d3449]/5 mt-4">
    <span className="material-symbols-outlined text-5xl text-[#c6c6cd]/20 mb-4 animate-pulse">
      favorite_border
    </span>
    <h2 className="text-base font-bold text-[#dae2fd] mb-1">No Liked Videos Found</h2>
    <p className="text-xs text-[#c6c6cd]/50 max-w-xs leading-relaxed">
      Your liked playlist index directory data feed is empty.
    </p>
  </div>
)}
          </div>

        </div>
      </main>
    </div>
 )}
 </>
 
 
  );
}