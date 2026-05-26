import React from 'react'
import { useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function ShortUpload() {
  const history = useHistory();
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [visibility, setVisibility] = useState("public");
  
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, video: "" }));
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!videoFile) newErrors.video = "Please select a video file";
    if (!imageFile) newErrors.image = "Please select a thumbnail image";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setUploading(true);
    
    try {
      // First upload video
      const videoFormData = new FormData();
      videoFormData.append('video', videoFile);
      videoFormData.append('productName', title); // Using title as product name
      
      const videoResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload`, videoFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      // Then upload thumbnail
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);
      imageFormData.append('productName', title);
      
      const imageResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/uploadimg`, imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      // Finally save post data
      const postData = {
        title,
        description,
        tags: tags, // Send as string, not array
        thumbnail: imageResponse.data.filename, // Note: 'thumbnail' not 'thumbnails'
        visibility,
        video: videoResponse.data.filename // Note: 'video' not 'videos'
      };
      
      const postResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts/short/`, postData, {
        withCredentials: true
      });
      
      if (postResponse.status === 200) {
        history.push("/");
      }
      
    } catch (err) {
      console.error("Upload error:", err);
      setErrors({ 
        submit: err.response?.data?.error || "Upload failed. Please try again." 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      {/* TopNavBar - Keep your existing navbar code */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 h-16 bg-[#0b1326]/80 backdrop-blur-24px z-50 shadow-[0_40px_60px_-15px_rgba(11,19,38,0.4)]">
        {/* ... your existing navbar content ... */}
      </header>

      {/* SideNavBar - Keep your existing sidebar code */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col py-6 bg-[#060e20] hidden lg:flex">
        {/* ... your existing sidebar content ... */}
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Studio Upload</h1>
          <p className="text-on-surface-variant">Share your cinematic vision with the global audience.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Video Upload Area */}
              <section className="bg-surface-container-low rounded-xl p-1 bg-gradient-to-br from-primary/10 to-transparent">
                <div 
                  onClick={() => videoInputRef.current.click()}
                  className="border-2 border-dashed border-outline-variant/30 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 backdrop-blur-sm group hover:border-primary/50 transition-all duration-300 cursor-pointer"
                >
                   
                    <>
                      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                      </div>
                      <h3 className="text-xl font-headline font-bold mb-2">Click to upload video</h3>
                      <p className="text-on-surface-variant mb-8 max-w-sm">MP4, MOV, or AVI supported. Max 500MB.</p>
                    </>
                  <input 
                    onChange={handleVideoSelect}
                    ref={videoInputRef}
                    className="hidden"
                    type="file"
                    accept="video/*"
                  />
                </div>
                {errors.video && <p className="text-red-500 text-sm mt-2">{errors.video}</p>}
              </section>

              {/* Metadata Form */}
              <section className="bg-surface-container-low rounded-xl p-8 space-y-8">
                <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  Video Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1">Video Title</label>
                    <input 
                      onChange={e => setTitle(e.target.value)} 
                      value={title}
                      className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/50" 
                      type="text" 
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1">Description</label>
                    <textarea 
                      onChange={e => setDescription(e.target.value)} 
                      value={description}
                      className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/50 resize-none" 
                      rows="5"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1">Tags (comma separated)</label>
                    <input 
                      onChange={e => setTags(e.target.value)} 
                      value={tags}
                      className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/50" 
                      placeholder="cinematic, 4k, tutorial, etc."
                      type="text" 
                    />
                  </div>
                </div>
              </section>

              {/* Thumbnail Selection */}
              <section className="bg-surface-container-low rounded-xl p-8">
                <h2 className="text-xl font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">image</span>
                  Thumbnail
                </h2>
                <div 
                  onClick={() => imageInputRef.current.click()}
                  className="cursor-pointer"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Thumbnail preview" className="w-full max-h-48 object-cover rounded-lg" />
                  ) : (
                    <div className="aspect-video bg-surface-container-lowest rounded-lg border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-surface-container-high transition-all p-8">
                      <span className="material-symbols-outlined text-on-surface-variant text-4xl">add_photo_alternate</span>
                      <span className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Click to upload thumbnail</span>
                    </div>
                  )}
                  <input
                    ref={imageInputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {/* Preview Card */}
              <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video relative bg-black">
                  {videoPreview ? (
                    <video className="w-full h-full object-cover" src={videoPreview} />
                  ) : imagePreview ? (
                    <img className="w-full h-full object-cover" src={imagePreview} alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">play_circle</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-on-surface mb-2">{title || "Video Title"}</h4>
                  <p className="text-xs text-on-surface-variant">{description || "Video description will appear here..."}</p>
                </div>
              </section>

              {/* Visibility Settings */}
              <section className="bg-surface-container-low rounded-xl p-8">
                <h2 className="text-lg font-headline font-bold text-on-surface mb-6">Visibility</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input 
                      onChange={e => setVisibility(e.target.value)} 
                      checked={visibility === "public"} 
                      value="public" 
                      className="w-5 h-5 text-primary" 
                      type="radio" 
                      name="visibility"
                    />
                    <div>
                      <p className="font-bold text-on-surface">Public</p>
                      <p className="text-xs text-on-surface-variant">Everyone can watch your video</p>
                    </div>
                  </label>
                   
                  <label className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input 
                      onChange={e => setVisibility(e.target.value)} 
                      checked={visibility === "private"} 
                      value="private" 
                      className="w-5 h-5 text-primary" 
                      type="radio" 
                      name="visibility"
                    />
                    <div>
                      <p className="font-bold text-on-surface">Private</p>
                      <p className="text-xs text-on-surface-variant">Only you can watch</p>
                    </div>
                  </label>
                </div>
                
                {errors.submit && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-500 text-sm">{errors.submit}</p>
                  </div>
                )}
                
                <div className="mt-8 pt-8 border-t border-outline-variant/10">
                  <button 
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-primary to-on-primary-container text-on-primary py-4 rounded-full font-bold shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Publish Now"}
                  </button>
                  <button 
                    type="button"
                    className="w-full bg-transparent border border-outline-variant/30 text-on-surface py-4 rounded-full font-bold hover:bg-surface-container-high transition-all"
                  >
                    Save as Draft
                  </button>
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ShortUpload;