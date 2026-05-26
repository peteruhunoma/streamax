import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import {VideoPlayer} from 'react-video-master'; 
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom';
import moment from 'moment';
import Header from './Header';
import SideNav from './SideNav';


const Watch = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [video, setVideo] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [videos, setVideos] = useState([]);
  const [getSub, setGetSub] = useState([]);
  const [subed, setSubed] = useState([]);
  const [getLike, setGetLike] = useState([]);
  const [comment, setComment] = useState("");
  const [commentLike, setCommentLike] = useState([]);
  const [getComment, setGetComment] = useState([]);
  // const [getCommentLikes, setGetCommentLikes] = useState([]);
  const [likesData, setLikesData] = useState({});
  const [u, i, id] = useLocation().pathname.split("/");
  const hasCountedView = useRef(false);
  const [showToast, setShowToast] = useState(false);
  const [userimage, setUserimage] = useState([]);
  const history = useHistory();

   
useEffect(() => {
  const controller = new AbortController();
  addview();
  
  return () => controller.abort();
}, []);
useEffect(() => {
  getComment.forEach(item => {
    getCommentLikes(item.id).then(videolike => {
      setLikesData(prev => ({ ...prev, [item.id]: videolike }));
    });
  });
}, [getComment]); 





  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

const fetchvideos = async ()=> {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
          withCredentials: true
        })
        console.log(res);
        setVideos(res.data);

      }catch(err){
        console.log(err);
      }
      
    }
const fetchvideo = async ()=> {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/watch/${id}`, {
          withCredentials: true
        })
        console.log(res);
        setVideo(res.data.watch[0]);
        getSubs(res.data.watch[0].user_id);
        setUserimage(res.data.userimage[0].userimage)


      }catch(err){
        console.log(err);
      }
      
    }
    const getSubs = async (userid)=> {
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
    const getLikes = async ()=> {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/likes/${id}`,{
          withCredentials: true
        })
        console.log(res, "lol");
        setGetLike(res.data.likes.length);
      }catch(err){
        console.log(err);
      }
      
    }
    const getComments = async ()=> {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/comment/${id}`,{
          withCredentials: true
        });
        console.log(res);
        setGetComment(res.data.comments);
      }catch(err){
        console.log(err);
      }
      
    }
    const addSubs = async ()=> {
      
      try{
        const userid = video.user_id;
        console.log(id);
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/subs`, {userid}, {
          withCredentials: true
        })
        console.log(res);
        
      }catch(err){
        console.log(err);
        if(err){
          history.push("/login");
        }
      }
      
    }
    const addLikes = async ()=> {
      
      try{
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/likes`, {id}, {
          withCredentials: true
        })
        console.log(res);
        getLikes();
      }catch(err){
        console.log(err);
        if(err){
          history.push("/login");
        }
      }
      
    }
    const addCommentLikes = async (commentid)=> {
      
      try{
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/commentlikes`, {id, commentid}, {
          withCredentials: true
        })
        console.log(res);
        getCommentLikes(commentid);
      }catch(err){
        console.log(err);
        if(err){
          history.push("/login");
        }
      }
      
    }
    const getCommentLikes = async (commentid)=> {
      console.log(commentid);
      try{
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/commentlikes/${id}/${commentid}`, {
          withCredentials: true
        })
        console.log(res);
        // setLikesData(prev => ({
        //   ...prev,
        //   [commentid]: res.data.comm || 0
        // }));
      }catch(err){
        console.log(err);
      }
      
    }
    const addview = async ()=> {
      
      try{
        console.log(id);
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/posts/views`, {id}, {
          withCredentials: true,
          headers: { 'X-Timestamp': Date.now() }
        })
        console.log(res);
        
      }catch(err){
        console.log(err);
      }
      
    }
    const addcomment = async ()=> {
      
      try{
        console.log(id)
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/comment`, {id, comment}, {
          withCredentials: true
        })
        console.log(res);
        getComments()
      }catch(err){
        console.log(err);
        if(err){
          history.push("/login");
        }
      }
      
    }

    const profileRedirect =  async (userid)=> {
      history.push(`/channel/${userid}`)
    }

    const redirect = async (videoid) => {
      window.location.href = `/watch/${videoid}`
    }



    useEffect(() => {
       fetchvideo();
       fetchvideos();
       getComments();
       getLikes();
    }, [])
    const filteredVideos = selectedTag === 'All' 
    ? videos 
    : videos.filter(video => 
        video.tags && video.tags.includes(selectedTag)
      );

  return (
<div className="custom-scrollbar overflow-x-hidden min-h-screen bg-[#060e20] text-on-surface">
      {/* Toast Alert Notification */}
      {showToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#2d3449] text-[#dae2fd] px-6 py-3 rounded-xl font-medium text-sm shadow-2xl border border-[#b4c5ff]/20 z-[1000] transition-all animate-fade-in">
          Link copied to clipboard!
        </div>
      )}

      {/* Navigation Headers */}
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* 3. Pass active state values down to the SideNav menu block */}
      <SideNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

{isSidebarOpen && (
  <div 
    onClick={() => setIsSidebarOpen(false)}
    className="fixed inset-0 bg-black/40  z-40 md:hidden  duration-300"
  />
)}

      <main className="transition-all duration-300 pt-20 px-4 md:px-8 pb-12 min-h-screen md:ml-64">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column Area: Main Video Stream, Metadata, and Comments */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Native Video Canvas Instance Container */}
            <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl shadow-black/40">
              <VideoPlayer 
                src={`/uploads/${video.username}/${video.title}/${video.video}`} 
              />
            </div>

            {/* Video Meta Title Block */}
            <div className="mt-6">
              <h1 className="text-xl md:text-2xl font-black text-[#dae2fd] tracking-tight leading-snug">
                {video.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-3 border-b border-[#2d3449]/40 pb-5">
                <div className="flex items-center gap-2 text-xs md:text-sm text-[#c6c6cd]/80 font-medium">
                  <span>{video.views} views</span>
                  <span className="w-1 h-1 bg-[#2d3449] rounded-full"></span>
                  <span>{moment(video.created_at).fromNow()}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button onClick={addLikes} className="flex items-center gap-2 px-4 py-2 bg-[#2d3449]/40 hover:bg-[#2d3449]/80 text-[#dae2fd] transition-colors rounded-full text-xs md:text-sm font-semibold border border-[#2d3449]/60">
                    <span className="material-symbols-outlined text-lg">thumb_up</span>
                    <span>{getLike}</span>
                  </button>
                  <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-[#2d3449]/40 hover:bg-[#2d3449]/80 text-[#dae2fd] transition-colors rounded-full text-xs md:text-sm font-semibold border border-[#2d3449]/60">
                    <span className="material-symbols-outlined text-lg">share</span>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Channel Profile Reference Bar */}
            <div className="flex items-center justify-between py-5 border-b border-[#2d3449]/20">
              <div 
                onClick={() => profileRedirect(video.user_id)} 
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#b4c5ff]/20 group-hover:border-[#b4c5ff]/60 transition-colors">
                  <img alt="Channel Avatar" className="w-full h-full object-cover" src={`../public/uploadeduser/${video.username}/${userimage}`} />
                </div>
                <div>
                  <h3 className="font-bold text-[#dae2fd] text-sm md:text-base flex items-center gap-1 group-hover:text-[#b4c5ff] transition-colors">
                    {video.username}
                    <span className="material-symbols-outlined text-[#b4c5ff] text-sm font-fill">check_circle</span>
                  </h3>
                  <p className="text-xs text-[#c6c6cd]/60">{getSub} subscribers</p>
                </div>
              </div>
              <button onClick={() => addSubs()} className="px-5 py-2 bg-[#b4c5ff] text-[#060e20] font-bold text-xs md:text-sm rounded-full active:scale-95 transition-transform hover:opacity-90 shadow-md">
                {subed === "subscribed" ? "subscribed" : "subscribe"}
               
              </button>
            </div>

            {/* Interactive Expandable Description Wrapper */}
            <div className="bg-[#2d3449]/20 border border-[#2d3449]/30 rounded-2xl p-4 text-xs md:text-sm text-[#c6c6cd] leading-relaxed mt-5">
              <p className="font-bold text-[#dae2fd] mb-1">Description</p>
              <p>
                {video.description} 
                <span className="text-[#b4c5ff] cursor-pointer ml-1 font-semibold hover:underline">...more</span>
              </p>
            </div>

            {/* User Interaction Comments Space Container */}
            <section className="mt-8">
              <div className="flex items-center gap-6 mb-6">
                <h2 className="text-lg font-bold text-[#dae2fd]">Comments</h2>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#c6c6cd]/80 hover:text-[#dae2fd]">
                  <span className="material-symbols-outlined text-sm">sort</span>
                  Sort by
                </button>
              </div>

              {/* Native Authored User Post Input Box */}
              <div className="flex gap-4 mb-8">
                <div className="w-9 h-9 rounded-full bg-[#2d3449]/40 border border-[#2d3449]/60 shrink-0 flex items-center justify-center text-[#c6c6cd]">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <div className="flex-1">
                  <input 
                    onChange={e => setComment(e.target.value)} 
                    className="w-full bg-transparent border-b border-[#2d3449]/60 focus:border-[#b4c5ff] focus:ring-0 outline-none text-sm py-1.5 transition-colors text-[#dae2fd] placeholder:text-[#c6c6cd]/30" 
                    placeholder="Add a public comment..." 
                    type="text" 
                  />
                  <div className="flex justify-end gap-2.5 mt-3">
                    <button className="px-4 py-1.5 text-xs font-bold text-[#c6c6cd] hover:bg-[#2d3449]/40 rounded-full transition-colors">
                      Cancel
                    </button>
                    <button onClick={addcomment} className="px-4 py-1.5 text-xs font-bold bg-[#b4c5ff] text-[#060e20] rounded-full hover:opacity-90 transition-all">
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Mapping Loop List */}
              <div className="space-y-6">
                {getComment && getComment.map(items => (
                  <div className="flex gap-4" key={items.id}>
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2d3449]/60 shrink-0">
                      <img alt="Commenter" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJAFPbRQdBiVZ4sIzTB7hj4tecVLt25xJbcAEh-p8sQte6xkqTvMX3MBxFYBh50NeP4325CRN-UDrB3usAjlSEpxuX8u1DIUz8HbqLNyY5n0G8hBT09o-udDU913dwXDGISfPAPGIwCYGPRsbZca880TXk_6W8Zh9I0Hydk1Voi081NM5QNW090pZMLJVO207HWfzBn32cDdd54b0kENwKw3oQFHcc1tL1pq8MhcEQsueDbXJvvV-akQyQoHdrmmBns2RjcuxkyP1e" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-[#dae2fd]">{items.username}</span>
                        <span className="text-[11px] text-[#c6c6cd]/50">{moment(items.created_at).fromNow()}</span>
                      </div>
                      <p className="text-xs md:text-sm text-[#c6c6cd]/90 leading-relaxed">{items.comment}</p>
                      <div className="flex items-center gap-4 mt-2.5">
                        <button onClick={() => addCommentLikes(items.id)} className="flex items-center gap-1 group text-[#c6c6cd]/60 hover:text-[#dae2fd] transition-colors">
                          <span className="material-symbols-outlined text-base">thumb_up</span>
                          <span className="text-[11px]"></span>
                        </button>
                        <button className="flex items-center text-[#c6c6cd]/60 hover:text-[#dae2fd] transition-colors">
                          <span className="material-symbols-outlined text-base">thumb_down</span>
                        </button>
                        <button className="text-[11px] font-bold text-[#c6c6cd]/60 hover:text-[#dae2fd] transition-colors tracking-wide uppercase">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column Area: Up Next Recommendations / Sidebar Sidebar Filter */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Category Dynamic Filter Pills Element Row */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar border-b border-[#2d3449]/20">
              <button 
                onClick={() => setSelectedTag('All')} 
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full shrink-0 transition-colors ${
                  selectedTag === 'All' 
                    ? 'bg-[#b4c5ff] text-[#060e20]' 
                    : 'bg-[#2d3449]/40 text-[#c6c6cd] hover:bg-[#2d3449]/80'
                }`}
              >
                All
              </button>
              
              {/* Extracting safe nested unique tags maps */}
              {filteredVideos && filteredVideos[0]?.tags?.map((tag, tagIndex) => (
                <button 
                  key={tagIndex} 
                  onClick={() => setSelectedTag(tag)} 
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full shrink-0 transition-all ${
                    selectedTag === tag
                      ? 'bg-[#b4c5ff] text-[#060e20]'
                      : 'bg-[#2d3449]/40 text-[#c6c6cd] hover:bg-[#2d3449]/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Content Video Recommendations Cards List */}
            <div className="flex flex-col gap-4">
              {filteredVideos && filteredVideos.map((recVideo) => (
                <div key={recVideo.id} onClick={()=> redirect(recVideo.id)} className="flex gap-3 group cursor-pointer items-start">
                  <div className="relative w-36 md:w-40 shrink-0 aspect-video rounded-xl overflow-hidden bg-[#2d3449]/20">
                    <img 
                      alt="Video Thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" 
                      src={`/uploads/${recVideo.username}/${recVideo.title}/${recVideo.thumbnails}`} 
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur text-[10px] px-1.5 py-0.5 rounded text-white font-bold tracking-wider">
                      12:45
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <h4 className="text-xs md:text-sm font-bold text-[#dae2fd] leading-snug line-clamp-2 group-hover:text-[#b4c5ff] transition-colors capitalize">
                      {recVideo.title}
                    </h4>
                    <p className="text-[11px] text-[#c6c6cd]/70 truncate capitalize mt-0.5">{recVideo.username}</p>
                    <p className="text-[10px] text-[#c6c6cd]/50">{recVideo.views} views • {moment(recVideo.created_at).fromNow()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ads Pro Promotion Static Banner */}
            <div className="mt-2 p-4 rounded-2xl bg-gradient-to-b from-[#2d3449]/30 to-[#0b1326] border border-[#2d3449]/40 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <span className="text-[9px] font-black text-[#b4c5ff] uppercase tracking-widest mb-1 block">Featured Overlay</span>
                <h5 className="text-xs font-bold text-[#dae2fd] mb-1">Cinematic Pro Workspace</h5>
                <p className="text-[11px] text-[#c6c6cd]/70 mb-4 leading-normal">Ad-free workflows and ultra-fidelity pipeline delivery views.</p>
                <button className="w-full py-2 bg-[#b4c5ff] text-[#060e20] text-xs font-bold rounded-full shadow-md hover:opacity-90 transition-opacity">
                  Upgrade Now
                </button>
              </div>
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-[#b4c5ff]/5 rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Watch;