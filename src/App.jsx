import { useState, useEffect } from "react";
import {supabase} from './services/supabaseClient'
import AuthPages from "./pages/AuthPages";
import Dashboard from "./pages/Dashboard";


export default function App(){
  const[session, setSession] = useState(null);
  const[loading,setLoading] = useState(true);
  useEffect(()=>{
    const getSession =  async () => {
      const {data,error} = await supabase.auth.getSession()
      if(error) console.error(error);
      setSession(data.session)
      setLoading(false)

    }
    getSession()

    // Validar si la Sesion esta Activa o no
    const {data:listener} = supabase.auth.onAuthStateChange(
      (_event,session) =>{
        setSession(session)
      }
    )
    // SE lIMPIA EL LISTENER
    return() => listener.subscription.unsubscribe();
  }, []) //Se Ejecutara una unica vez cuando se renderiza el componente de forma inicial

  const handleLogout = async () =>{
    await supabase.auth.signOut();
    setSession(null);
  }
  if(loading){
    return(
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando....</span>
        </div>
      </div>
    );
  }
  return session? (
    <Dashboard session={session} onLogout = {handleLogout}/>
  ):(
    <AuthPages onAuthSucess={(s) => setSession(s)}/>
  );
}