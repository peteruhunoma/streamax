 import {createContext, useState, useEffect} from "react";
 import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
 import axios from "axios";

 export const AuthContext = createContext();

 export const AuthContextProvider = ({children}) => { 
    const [currentuser, setCurrentuser] = useState(JSON.parse(localStorage.getItem("user") || null));
    const [oldShippingAddress, setOldShippingAddress] = useState([]);
    const history = useHistory();
    
    const login = async (input) => {
        if (currentuser && currentuser.length) {
            setCurrentuser(null)
        };
      
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`,
          input,                       
          { withCredentials: true } 
        );
        setCurrentuser(res.data);
        return res;
      };
    
    const logout = async () => {
      const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
          {}, 
          {
              withCredentials: true 
          }
      );
      console.log(res);
      setCurrentuser(null);
  }
    useEffect (()=>{
        localStorage.setItem("user", JSON.stringify(currentuser));
    }, [currentuser])
    return(
         <AuthContext.Provider value={{currentuser,  login,  logout}} >
            {children}
        </AuthContext.Provider>
    );
    


 }
