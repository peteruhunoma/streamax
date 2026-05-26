import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import SideNav from './SideNav';
import Header from './Header';
import { AuthContext } from './auth';

function UploadProfile() {
  const { currentuser } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const fileInputRef = useRef(null);
  const history = useHistory();

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, WEBP).' });
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB.' });
      return false;
    }

    setSelectedFile(file);
    setMessage({ type: '', text: '' });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const triggerFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image first.' });
      return;
    }
  
    setUploading(true);
    setMessage({ type: '', text: '' });
  
    try {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);
  
      // Step 1: Upload the image file and get just the filename
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/uploadprofileimg`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
  
      if (uploadResponse.data.success) {
        // Get only the filename from the response
        const filename = uploadResponse.data.filename; // This is just "profile_1234567890.jpg"
        
        // Step 2: Save only the filename to the database
        const profileUpdateResponse = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/auth/profile`,
          { image: filename }, // Send only the filename
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );
  
        if (profileUpdateResponse.status === 200) {
          // Update context with the filename
          
          
          setMessage({ type: 'success', text: 'Profile image updated successfully!' });
          
          setTimeout(() => {
            history.push(`/channel/${currentuser.id}`);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || error.response?.data?.err || 'Failed to upload image. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

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

      {/* Main Container */}
      <main className="md:ml-64 pt-24 px-4 md:px-8 pb-12 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md bg-[#0f1932] border border-[#2d3449]/60 rounded-2xl shadow-2xl p-6 md:p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#dae2fd] tracking-tight">Customize Avatar</h2>
            <p className="text-[#c6c6cd]/60 text-xs mt-1">
              Update your channel's public presentation image
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Visual Preview / Upload Dropzone */}
            <div className="flex flex-col items-center justify-center">
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFilePicker}
                className="group relative w-36 h-36 rounded-full border-2 border-dashed border-[#2d3449] hover:border-[#b4c5ff] bg-[#2d3449]/10 hover:bg-[#2d3449]/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 shadow-inner"
              >
                {previewUrl ? (
                  <>
                    <img 
                      src={previewUrl} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white">
                      <span className="material-symbols-outlined text-2xl">edit</span>
                      <span className="text-[10px] font-semibold mt-0.5">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center px-4">
                    <span className="material-symbols-outlined text-[#c6c6cd]/40 group-hover:text-[#b4c5ff] text-3xl mb-1 transition-colors">
                      account_circle
                    </span>
                    <span className="text-[#c6c6cd]/60 text-[11px] font-medium leading-tight">
                      Drag image here or <span className="text-[#b4c5ff] underline">browse</span>
                    </span>
                  </div>
                )}
              </div>
              
              {/* Hidden Native File Input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <p className="text-[#c6c6cd]/40 text-[10px] mt-2 text-center">
                Supports JPG, PNG or WEBP. Max size 5MB.
              </p>
            </div>

            {/* Notification / Feedback Messages */}
            {message.text && (
              <div className={`p-3 rounded-xl text-xs font-medium text-center border ${
                message.type === 'error' 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                  : 'bg-green-500/10 border-green-500/20 text-green-400'
              }`}>
                {message.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => history.goBack()}
                className="flex-1 px-4 py-2.5 rounded-full border border-[#2d3449] text-[#dae2fd] text-sm font-semibold hover:bg-[#2d3449]/40 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#b4c5ff] text-[#060e20] text-sm font-bold shadow-lg shadow-[#b4c5ff]/10 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#060e20] border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default UploadProfile;