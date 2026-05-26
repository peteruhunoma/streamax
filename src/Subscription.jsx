import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Header from './Header';
import SideNav from './SideNav';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function SubscriptionsPage() {
  // Mobile responsive sidebar navigation drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filter state for filtering feed by categories or specific content status
  const [activeFilter, setActiveFilter] = useState('All');

  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const history = useHistory()

  const subsChannel = async () =>{
    try{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/viewsubs`, {
        withCredentials: true
    });
    console.log(res);
    setSubscribedChannels(res.data);
    }catch(err){
      if(err){
        history.push("/login");
      }
    }
  }

  

  const playVideo = (id) => {
    console.log(`Routing layout destination targeting instance: ${id}`);
    window.location.href = `/watch/${id}`;

  };
  const channelview = (id) => {
    window.location.href = `/channel/${id}`;

  };


  useEffect(() => {
    subsChannel();
  }, [])
  

  return (
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

      {/* Main Content Layout Wrapper - Desktop margin offset: md:ml-64 */}
      <main className="md:ml-64 pt-24 px-4 md:px-12 pb-12 min-h-screen">
        <div className="max-w-[1500px] mx-auto">
          
          {/* ================= QUICK-ACCESS CHANNELS HORIZONTAL ROW ================= */}
          <div className="flex items-center gap-6 overflow-x-auto pb-4 mb-6 border-b border-[#2d3449]/30 scrollbar-thin scrollbar-thumb-[#2d3449]">
            {subscribedChannels.map((channel) => (
              <div 
                onClick={()=> channelview(channel.id)}
                key={channel.id} 
                className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 min-w-[76px]"
              >
                {/* Standard Channel Avatar Frame */}
                <div className="w-14 h-14 rounded-full p-[2px] bg-[#2d3449]/40 border border-[#2d3449]/60 transition-transform group-hover:scale-105">
                  <img 
                    alt={channel.fullname} 
                    className="w-full h-full object-cover rounded-full bg-[#060e20]" 
                    src={`../public/uploadeduser/${channel.fullname}/${channel.userimage}`} 
                  />
                </div>
                <span className="text-[11px] text-[#c6c6cd]/80 font-medium tracking-tight truncate max-w-[80px] group-hover:text-[#b4c5ff] transition-colors">
                  {channel.fullname}
                </span>
              </div>
            ))}
          </div>

          {/* ================= FILTER ACTIONS BAR ROW ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#dae2fd] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#b4c5ff] text-2xl">subscriptions</span>
                Subscriptions
              </h1>
            </div>

            
          </div>

          {/* ================= SUBSCRIPTION FEED DISPLAY CANVAS ================= */}
          {subscribedChannels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
              {subscribedChannels.map((channel) => (
  // Loop through each channel's videos
  channel.videos?.map((video) => (
    <div 
      key={video.id}
      onClick={() => playVideo(video.id)}
      className="flex flex-col gap-3 group cursor-pointer w-full relative"
    >
      {/* Thumbnail Platform Wrap */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#2d3449]/20 border border-[#2d3449]/20 shadow-lg">
        <img 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" 
          src={`../public/uploads/${channel.fullname}/${video.title}/${video.thumbnails}`} 
        />
        
        {/* Timeline Tracker Duration Overlay */}
        <span className="absolute bottom-2 right-2 backdrop-blur text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider bg-black/85 text-white">
          {video.duration}
        </span>
      </div>

      {/* Creator Avatar & Context Details Metadata Frame */}
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2d3449]/40 shrink-0 mt-0.5 shadow-md">
          <img alt={channel.username} className="w-full h-full object-cover" src={`../public/uploadeduser/${channel.fullname}/${channel.userimage}`} />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-sm font-bold text-[#dae2fd] leading-snug line-clamp-2 group-hover:text-[#b4c5ff] transition-colors capitalize">
            {video.title}
          </h3>
          
          <p className="text-xs text-[#c6c6cd]/70 truncate capitalize mt-1">
            {channel.username}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-[#c6c6cd]/40 font-medium mt-0.5">
            <span>{video.views} views</span>
            <span className="w-0.5 h-0.5 bg-[#2d3449] rounded-full"></span>
            <span>{moment(video.created_at).fromNow()}</span>
          </div>
        </div>
      </div>
    </div>
  ))
))}
            </div>
          ) : (
            /* Blank Placeholder Fallback Frame Configuration */
            <div className="w-full py-32 flex flex-col items-center justify-center text-center border border-dashed border-[#2d3449]/40 rounded-3xl bg-[#2d3449]/5">
              <span className="material-symbols-outlined text-5xl text-[#c6c6cd]/20 mb-4">
                video_library
              </span>
              <h2 className="text-base font-bold text-[#dae2fd] mb-1">No Updates Available</h2>
              <p className="text-xs text-[#c6c6cd]/50 max-w-xs leading-relaxed">
                There are no published updates matching the active filter choice query.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}