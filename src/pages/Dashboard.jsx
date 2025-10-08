import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
//import ProjectDetails from "./ProjectDetails"
export default function Dashboard({onLogout}){
    const [user,setUser] = useState(null);
    const [projects,setProjects] = useState([]);
    // Creacion de Nuevos Projectos
    const [newProjectTitle,setNewProjectTitle] = useState("");
    const [newProjectDescription,setNewProjectDescription] = useState("");
    // Acceder al detalle de X proyecto
    const[selectedProjectId, setSelectedProjectId] = useState();

    useEffect(()=>{
        // oBTENER LA SESSION ACTUAL
        async function loadSession() {
            const{data:{session}} = await supabase.auth.getSession();
            const currentUser = session?.user ??null
            setUser(currentUser)
            if(currentUser) fecthProjects(currentUser.id)

        }
        loadSession()
    }, [] )//Ejecutar una unica vez al renderizar componente inicial

    async function fecthProjects(userId) {
        const {data, error} = await supabase.from("projects").select("*").eq("user_id", userId).order("id", {ascending:false})
        if(error) console.error(error)
        else setProjects(data)
    }

    async function addProject(e){
        e.preventDefault()
        if(newProjectTitle.trim() === ""  || !user) return
        const {data, error} = await supabase
            .from("projects")
            .insert([{
                title: newProjectTitle,
                description: newProjectDescription,
                user_id: user.id,
                status: 'active'
            }]).select()

            if(error){
                console.error("error al crear el proyecto, error")
                alert(`Error: ${error.message}`)
            }
            else{
                console.log("Proyecto Creado: ", data)
                setNewProjectTitle("")
                setNewProjectDescription("")
                fecthProjects(user.id)
            }
    }
    // Eliminar proyecto
    async function deleteProject(id) {
        const{error} = await supabase.from("projects").delete().eq("id", id)
        if(!error && user) fecthProjects(user.id)
    }

    return(
        <>
            <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Proyectos</h2>
        <button className="btn btn-outline-danger" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      {user && (
        <div className="alert alert-info">
          <strong>Usuario:</strong> {user.email}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Crear nuevo proyecto</h4>

          <form onSubmit={addProject} className="mb-3">
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Título del proyecto..."
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Descripción (opcional)..."
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                rows="2"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Agregar Proyecto
            </button>
          </form>

          {projects.length === 0 ? (
            <p className="text-muted">Aún no tienes proyectos.</p>
          ) : (
            <ul className="list-group">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="flex-grow-1">
                    <strong>{project.title}</strong>
                    {project.description && (
                      <p className="mb-1 text-secondary">{project.description}</p>
                    )}
                    <div className="text-muted small">
                      Estado: {project.status} | Creado: {new Date(project.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      Ver detalles
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProject(project.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

        </>
    );
}