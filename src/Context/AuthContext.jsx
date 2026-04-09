import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();
export default function AuthContextProvider({ children }) {
  const [userLogin, setuserLogin] = useState(null);
  const [userid, setuserid] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setuserLogin(localStorage.getItem("userToken"));
    }
  }, []);
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      const { user } = jwtDecode(localStorage.getItem("userToken"));
      console.log("decodedToken", user);
      setuserid(user);
    }
  }, [userLogin]);

  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userid }}>
      {children}
    </AuthContext.Provider>
  );
}
