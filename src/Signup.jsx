import React, {useState, useContext} from "react";
import {useHistory, Link} from "react-router-dom";
import axios from "axios";
import moment from "moment";


function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordText, setPasswordText] = useState("");
  const history = useHistory();
  
  let emailrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleValidation = ()=>{
    if (!email.trim()){
      setEmailError("email field is empty");
    }else{
      setEmailError("");
    }
    if (!password.trim()){
      setPasswordError("password field is empty");
    } else if(password.length < 6 ){
      setPasswordError("password must be more than 8 characters");
    }else{
      setPasswordError("");
    }
  
    if (!fullName.trim()){
      setFullNameError("fullname field is empty");
    }else if(fullName.length > 30){
      setFullNameError("name has exceeded 30 character");
    }
    else{
      setFullNameError("");
    }  
  }
  
  const handleVisibility = ()=>{
      
    console.log(passwordVisibility === false)
      if (passwordVisibility === false){
          setPasswordText("text");
          setPasswordVisibility(true);
      }else if (passwordVisibility === true){
          setPasswordText("password");
          setPasswordVisibility(false);
      }
  }
  
  const handleSubmit = async (e)=> {
    e.preventDefault();
    if(!handleValidation()) {
      console.log("validation success");
    }
  try{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, {
      email, fullName, password, date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    }, {
    method: "POST",
    header: {"Content-Type":"application/json"},  
    withcredentials: true,
    });
    res;
    if(res.status === 200){
      history.push("/login");
    }
  }catch(err){
    console.log(err);
   
  }
  }  
  return (
    <div className="dark">
      <main className="bg-background font-body text-on-surface selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden">
        
        {/* Background Atmospheric Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-on-primary-container/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Main Content Shell */}
        <div className="relative z-10 w-full max-w-lg px-6 py-12 flex flex-col items-center">
          
          {/* Brand Identity */}
          <div className="mb-10 text-center">
            <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface uppercase mb-2">
              Cinematic Canvas
            </h1>
            <p className="text-on-surface-variant font-label tracking-wide text-xs uppercase">
              Atmospheric Immersion
            </p>
          </div>

          {/* Signup Card */}
          <div className="glass-card w-full rounded-xl p-8 md:p-10 shadow-2xl border border-outline-variant/15">
            
            <div className="mb-8">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">
                Create Account
              </h2>
              <p className="text-on-surface-variant text-sm">
                Join the elite gallery of cinematic experiences.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} method='post' className="space-y-5">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="name">
                  Full Name
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input onChange={e => setFullName(e.target.value)} className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-low transition-all duration-300" id="name" placeholder="Enter your full name" type="text" />
                </div>
                <p className="text-red mt-2 mt-2">{fullNameError}</p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <input onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-low transition-all duration-300" id="email" placeholder="name@example.com" type="email" />
                </div>
                <p className='text-red mt-2 mt-2'>{emailError}</p>

              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                      lock
                    </span>
                    <input onChange={e => setPassword(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-low transition-all duration-300" id="password" placeholder="••••••••" type="password" />
                  </div>
                  <p className="text-red mt-2 mt-2">{passwordError}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label text-xs font-medium text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="confirm-password">
                    Confirm
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                      shield
                    </span>
                    <input type={passwordText} onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-primary focus:bg-surface-container-low transition-all duration-300" id="confirm-password" placeholder="••••••••"  />
                  </div>
                  <p className='text-red mt-2 mt-2'>{confirmPasswordError}</p>

                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-on-primary-container focus:ring-primary transition-colors" id="terms" type="checkbox" />
                </div>
                <label className="text-xs text-on-surface-variant leading-relaxed" htmlFor="terms">
                  I agree to the{" "}
                  <a className="text-primary hover:underline transition-all" href="#">Terms of Service</a>{" "}
                  and{" "}
                  <a className="text-primary hover:underline transition-all" href="#">Privacy Policy</a>
                </label>
              </div>

              {/* CTA */}
              <button className="w-full primary-gradient-cta text-primary-container font-headline font-bold py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-on-primary-container/20 mt-4" type="submit">
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20"></div>
              </div>
              <span className="relative bg-surface-container-highest px-4 text-[10px] font-bold text-outline uppercase tracking-[0.2em]">
                Or Sign Up With
              </span>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container transition-colors duration-300 group">
                <img className="w-4 h-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeTy5WBig8PX2TE5h2f5UKhDRXXHNPRVbSTvXroierNmryE2pg6SVDhczoLaTvDZcDm4gCQfcxoW7XWjEp1lNxs6VYv7lBuHmAoF_e5gvt5IFi7URnFVrSz-xqOh2s0n5U5T1VfHLMRqvkyY4VBmoYtfZNsn7XOH908DIRd2YyuxzDE_qzPPETaJSpXAm9e6y1dLCw-9zQR9X4emzlZ6O-kPwkI1bRhBrSdSr_LxbkrK4syJpl6IXNVpdCjFT6Vt-FEXF1mfiYm-NF" alt="Google" />
                <span className="font-label text-xs font-semibold text-on-surface">Google</span>
              </button>

              <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container transition-colors duration-300 group">
                <span className="material-symbols-outlined text-lg text-on-surface/70 group-hover:text-on-surface transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                  ios
                </span>
                <span className="font-label text-xs font-semibold text-on-surface">Apple</span>
              </button>
            </div>
          </div>

          {/* Footer Redirect */}
          <p className="mt-8 text-on-surface-variant font-label text-sm">
            Already have an account?{" "}
            <a className="text-primary font-bold hover:underline transition-all underline-offset-4" href="#">
              Log In
            </a>
          </p>
        </div>

        {/* Footer */}
        <footer className="w-full py-12 px-12 mt-auto border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-lowest">
          <div className="text-on-surface-variant font-inter text-[10px] tracking-tight uppercase opacity-60">
            © 2024 Cinematic Canvas. Atmospheric Immersion.
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-on-surface-variant text-[10px] uppercase hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant text-[10px] uppercase hover:text-on-surface transition-colors" href="#">Terms of Service</a>
            <a className="text-on-surface-variant text-[10px] uppercase hover:text-on-surface transition-colors" href="#">Cookie Settings</a>
            <a className="text-on-surface-variant text-[10px] uppercase hover:text-on-surface transition-colors" href="#">Help Center</a>
          </div>
        </footer>

      </main>
    </div>
  );
}
export default Signup;