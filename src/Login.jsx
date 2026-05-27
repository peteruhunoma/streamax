import React, {useState, useEffect, useContext} from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from "axios";
import { AuthContext } from './auth.jsx';

function Login(){
    const history = useHistory();
    const {login, currentuser} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [passwordText, setPasswordText] = useState("");



    useEffect(() => {
        setPasswordText("password");
     }, [])
     
    
   const handleSubmit = async(e) =>{
     e.preventDefault();
      
   try{
   
     const res = await login({email, password});
     
     if(res.status == 200){
       
           history.push("/");
       
       
   
     }
     
     
   }catch(err){
   console.log(err);
     if (err?.response?.data == "All fields are required") {
       setPhoneError("email or username field is empty");
       setPasswordError("password field is empty");
     } else if (err?.response?.data == "Email or username is required") {
       setPhoneError("email or username field is empty");
       setPasswordError(""); 
     } else if (err?.response?.data == "Password is required") {
       setPasswordError("password field is empty");
       setPhoneError(""); 
     } else if (err?.response?.data == "invalid login information") {
       setPhoneError("email or username invalid");
       setPasswordError(""); 
     } else if (err?.response?.data == "password is wrong") {
       setPasswordError("password is wrong");
       setPhoneError(""); 
     } else {
       setPhoneError("");
       setPasswordError("");
     }
   
     
   }
     
   }

return(
<div className="bg-mesh font-body text-on-surface min-h-screen flex flex-col">
  {/* <!-- Top Navigation Anchor (Suppressed Shell for focus) --> */}
  <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20">
    <div className="text-2xl font-headline font-bold tracking-tighter text-on-surface uppercase">
      Cinematic Canvas
    </div>
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
        help
      </span>
    </div>
  </header>

  {/* <!-- Main Content Canvas --> */}
  <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12">
    <div className="w-full max-w-md">
      {/* <!-- Login Card --> */}
      <div className="glass-panel rounded-xl p-8 md:p-10 shadow-2xl border border-outline-variant/15">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-on-surface-variant text-sm tracking-wide">
            Enter your credentials to access the canvas.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} method="post">
          {/* <!-- Email Field --> */}
          <div className="space-y-2">
            <label
              className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
              />
            </div>
          </div>
          {emailError && (
            <p className="text-red-500 mt-2 mb-2">{emailError}</p>
          )}

          {/* <!-- Password Field --> */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant"
                htmlFor="password"
              >
                Password
              </label>
              <a
                className="text-xs text-on-primary-container hover:underline underline-offset-4 transition-all"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>
          {passwordError && (
            <p className="text-red-500 mt-2 mb-2">{passwordError}</p>
          )}

          {/* <!-- Login Button --> */}
          <button
            className="w-full primary-gradient text-on-primary font-headline font-bold py-4 rounded-full hover:shadow-[0_0_20px_rgba(66,120,255,0.4)] transition-all transform active:scale-[0.98]"
            type="submit"
          >
            Log In
          </button>
        </form>

        {/* <!-- Divider --> */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/15"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-surface-container-highest px-4 text-on-surface-variant">
              Or continue with
            </span>
          </div>
        </div>

        {/* <!-- Social Logins --> */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-high transition-colors group">
            <svg
              className="w-5 h-5 fill-on-surface group-hover:fill-primary transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"></path>
            </svg>
            <span className="text-sm font-medium">Google</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-high transition-colors group">
            <svg
              className="w-5 h-5 fill-on-surface group-hover:fill-primary transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.93-.05 2.02-.83 3.38-.76 1.44.07 2.53.6 3.18 1.58-2.85 1.71-2.41 5.44.42 6.58-.58 1.44-1.38 2.84-2.06 3.79zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.19 2.25-1.99 4.27-3.74 4.25z"></path>
            </svg>
            <span className="text-sm font-medium">Apple</span>
          </button>
        </div>
      </div>

      {/* <!-- Signup Redirect --> */}
      <div className="mt-8 text-center">
        <p className="text-on-surface-variant text-sm">
          New to the gallery?
          <a
            className="text-primary font-semibold hover:underline underline-offset-4 ml-1"
            href="#"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  </main>

  {/* <!-- Footer Shell --> */}
  <footer className="w-full py-12 bg-[#060e20] border-t border-[#45464d]/15">
    <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6">
      <div className="font-inter text-xs tracking-tight uppercase text-[#c6c6cd]">
        © 2024 Cinematic Canvas. Atmospheric Immersion.
      </div>
      <div className="flex gap-8">
        <a
          className="font-inter text-xs tracking-tight uppercase text-[#c6c6cd] hover:text-[#dae2fd] underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100"
          href="#"
        >
          Privacy Policy
        </a>
        <a
          className="font-inter text-xs tracking-tight uppercase text-[#c6c6cd] hover:text-[#dae2fd] underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100"
          href="#"
        >
          Terms of Service
        </a>
        <a
          className="font-inter text-xs tracking-tight uppercase text-[#c6c6cd] hover:text-[#dae2fd] underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100"
          href="#"
        >
          Cookie Settings
        </a>
        <a
          className="font-inter text-xs tracking-tight uppercase text-[#c6c6cd] hover:text-[#dae2fd] underline-offset-4 hover:underline transition-opacity opacity-80 hover:opacity-100"
          href="#"
        >
          Help Center
        </a>
      </div>
    </div>
  </footer>

  {/* <!-- Background Decoration Images (Decorative) --> */}
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full bg-primary/20"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full bg-on-primary-container/20"></div>
  </div>
</div>
);
}

export default Login;