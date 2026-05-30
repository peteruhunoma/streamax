import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import SideNav from './SideNav';
import Header from './Header';
import { AuthContext } from './auth';

function Search() {
  const { currentuser } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const history = useHistory();
  const location = useLocation();

  // Extract query from URL parameters (e.g., /search?q=your-query)
  const query = new URLSearchParams(location.search).get('q') || '';

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      // Adjust this endpoint based on how your backend handles search queries
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts/search?q=${query}`);
      setResults(res.data);
      console.log(res)
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const direct = (id) => {
    history.push(`/watch/${id}`);
  };

  useEffect(() => {
    if (query) {
      const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([fetchSearchResults()]);
        setIsLoading(false);
      };
      
      fetchData();

    }
  }, [query]);

  return (
    <>
    {isLoading ? (
      <div>loading</div>
    ):(
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
      <main className="md:ml-64 pt-20 px-4 md:px-24 pb-24 md:pb-12 min-h-screen max-w-6xl">
        
        {/* Search Metadata Info */}
        <div className="py-4 border-b border-[#2d3449]/30 mb-6">
          <p className="text-[#c6c6cd] text-sm">
            {loading ? "Searching..." : `Showing results for: `}
            <span className="text-[#b4c5ff] font-semibold">"{query}"</span>
          </p>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="flex flex-col gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-64 aspect-video bg-[#2d3449]/30 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-[#2d3449]/50 rounded w-3/4" />
                  <div className="h-3 bg-[#2d3449]/30 rounded w-1/4" />
                  <div className="h-3 bg-[#2d3449]/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
            <span className="material-symbols-outlined text-[#c6c6cd]/30 text-7xl mb-4">
              search_off
            </span>
            <h3 className="text-[#dae2fd] text-lg font-semibold mb-1">No results found</h3>
            <p className="text-[#c6c6cd]/60 text-sm max-w-xs">
              Try checking your spelling or use more general keywords.
            </p>
          </div>
        )}

        {/* Search Results List */}
        {!loading && results.length > 0 && (
          <section className="flex flex-col gap-6">
            {results.map((item) => (
              <div 
                key={item.id} 
                onClick={() => direct(item.id)} 
                className="group cursor-pointer flex flex-col sm:flex-row gap-4 p-2 rounded-2xl hover:bg-[#2d3449]/10 transition-colors duration-200"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full sm:w-72 md:w-80 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-[#2d3449]/30 transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-lg group-hover:shadow-black/20">
                  <img 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                    src={`https://res.cloudinary.com/dsypjacgn/image/upload/v1780135714/${item.thumbnails}`} 
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur text-[11px] font-bold text-white rounded">
                    14:32
                  </div>
                  <div className="absolute inset-0 bg-[#b4c5ff]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-4xl drop-shadow-md">
                      play_circle
                    </span>
                  </div>
                </div>

                {/* Video Info metadata */}
                <div className="flex flex-col gap-2 flex-1 min-w-0 py-1">
                  <h3 className="font-semibold text-[#dae2fd] text-base md:text-lg leading-snug group-hover:text-[#b4c5ff] transition-colors line-clamp-2 capitalize">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#c6c6cd]/60 text-xs">
                    {item.views} views • {moment(item.created_at).fromNow()}
                  </p>

                  {/* Channel Meta Row */}
                  <div className="flex items-center gap-2 my-1">
                    
                    
                    <p className="text-[#c6c6cd] text-xs font-medium truncate capitalize">
                      {item.username}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
    )}
    </>
    
  );
}

export default Search;