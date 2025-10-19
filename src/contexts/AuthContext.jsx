import React,{createContext,useContext,useState} from 'react';
const Ctx=createContext(null);
export function AuthProvider({children}){ const [user,setUser]=useState(null); const login=(email,role='user',name='Usuario')=>setUser({email,role,name}); const logout=()=>setUser(null); return <Ctx.Provider value={{user,login,logout}}>{children}</Ctx.Provider> }
export const useAuth=()=>useContext(Ctx);
