import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';
import moment from "moment";
import {Link, useHistory} from "react-router-dom";
import SideNav from './SideNav';
import Header from './Header';
import { AuthContext } from './auth';


function Home() {
  const {currentuser} = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const history = useHistory();
const video = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`);
  console.log(res);
  setVideos(res.data)
}
const short = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/short`);
  console.log(res);
  setShorts(res.data);
}

const direct = async (id) => {
  history.push(`/watch/${id}`)
}
useEffect(() => {
   video();
   short();
}, [])

return (

  <div className="font-body min-h-screen bg-[#060e20] text-on-surface selection:bg-primary selection:text-on-primary">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <SideNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
        />
      )}

  {/* Main Content Area */}
  <main className="md:ml-64 pt-20 px-4 md:px-8 pb-24 md:pb-12 min-h-screen">
    {/* Category Pill Bar */}
    <div className="sticky top-16 z-30 bg-[#060e20] py-4 -mx-4 px-4 overflow-x-auto hide-scrollbar flex items-center gap-3">
      <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-[#b4c5ff] text-[#060e20] font-semibold text-sm transition-all hover:opacity-90">
        All
      </button>

    </div>

    {/* Video Grid */}
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {videos && videos.map((item) => (
        <div 
          key={item.id} 
          onClick={() => direct(item.id)} 
          className="group cursor-pointer flex flex-col gap-3"
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#2d3449]/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/30">
            <img 
              alt={item.title} 
              className="w-full h-full object-cover" 
              src={`/uploads/${item.username}/${item.title}/${item.thumbnails}`} 
            />
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur text-[11px] font-bold text-white rounded">
              14:32
            </div>
            <div className="absolute inset-0 bg-[#b4c5ff]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-5xl drop-shadow-md">
                play_circle
              </span>
            </div>
          </div>

          {/* Video Info metadata */}
          <div className="flex gap-3 px-1">
            <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden border border-[#b4c5ff]/20">
              <img 
                alt="Channel Avatar" 
                className="w-full h-full object-cover"
                src={`../public/uploadeduser/${item.username}/${item.userimage}`} 
              />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <h3 className="font-semibold text-[#dae2fd] text-sm leading-snug group-hover:text-[#b4c5ff] transition-colors line-clamp-2 capitalize">
                {item.title}
              </h3>
              <p className="text-[#c6c6cd] text-xs font-medium truncate capitalize mt-0.5">
                {item.username}
              </p>
              <p className="text-[#c6c6cd]/60 text-[11px]">
                {item.views} views • {moment(item.created_at).fromNow()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  </main>


  
</div>
);
}

export default Home;