import React from "react";
import { NavLink } from 'react-router-dom';

export default function SideNav({ isOpen, onClose }) {
  // Styles applied to ALL links
  const baseLinkStyles = "flex items-center gap-4 px-4 py-3 rounded-xl font-['Inter'] text-sm tracking-wide transition-all group";
  
  // Styles applied ONLY when the path matches the current URL
  const activeLinkStyles = "text-[#b4c5ff] bg-[#b4c5ff]/10 font-semibold";
  const inactiveLinkStyles = "text-[#c6c6cd] hover:bg-[#2d3449]/50 hover:text-[#dae2fd] font-medium";

  return (
    <nav className={`
      fixed left-0 top-0 h-full mt-16 w-64 pt-7 pb-6 bg-[#060e20] z-50
      flex flex-col justify-between border-r border-[#2d3449]/30
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0
    `}>
      <div className="flex flex-col w-full gap-1 px-3">
        
        {/* Home Item */}
        <NavLink 
          exact
          to="/"
          onClick={onClose}
          className={`${baseLinkStyles} ${inactiveLinkStyles}`}
          activeClassName={activeLinkStyles}
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-105">
            home
          </span>
          <span className="tracking-wide">Home</span>
        </NavLink>

        {/* Subscriptions Item */}
        <NavLink 
          to="/subs"
          onClick={onClose}
          className={`${baseLinkStyles} ${inactiveLinkStyles}`}
          activeClassName={activeLinkStyles}
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-105">
            subscriptions
          </span>
          <span className="tracking-wide">Subscriptions</span>
        </NavLink>

        {/* Liked Videos Item */}
        <NavLink 
          to="/likedvideo" 
          onClick={onClose}
          className={`${baseLinkStyles} ${inactiveLinkStyles}`}
          activeClassName={activeLinkStyles}
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-105">
            thumb_up
          </span>
          <span className="tracking-wide">Liked Videos</span>
        </NavLink>

      </div>
    </nav>
  );
}