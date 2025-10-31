import { useState, useEffect } from "react";
import ThemeToggle from "../../theme/themeToggle";
import "./FileManager.css";
import { FaWindowClose } from "react-icons/fa";

const services = import.meta.env.VITE_SERVICE_API;
const API_URL = `${services}/img`; // 🔹 Ajusta el puerto según tu backend

const FileManager = () => {
  const [imagenes, setImagenes] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [dragValid, setDragValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🟢 Cargar imágenes desde el backend al montar el componente
  useEffect(() => {
    fetchImagenes();
  }, []);

  const fetchImagenes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setImagenes(data);
    } catch (error) {
      console.error("Error al obtener imágenes:", error);
      setErrorMsg("No se pudieron cargar las imágenes del servidor.");
    }
  };

  // 🟠 Subir imágenes al backend
  const handleCargar = (e) => {
    const files = Array.from(e.target.files);
    procesarArchivos(files);
  };

  const procesarArchivos = async (files) => {
    const archivosValidos = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (archivosValidos.length === 0) {
      setErrorMsg("Solo se permiten archivos de imagen o video.");
      setTimeout(() => setErrorMsg(""), 5000);
      return;
    }

    for (const file of archivosValidos) {
      const formData = new FormData();
      formData.append("imagen", file);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error al subir la imagen");

        await fetchImagenes(); // refresca lista
      } catch (error) {
        console.error(error);
        setErrorMsg("Error al subir la imagen.");
      }
    }
  };

  // 🧹 Eliminar imagen del servidor
  const eliminarImagen = async (id) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchImagenes();
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      setErrorMsg("Error al eliminar la imagen.");
    }
  };

  // 🚦 Cambiar estado (activar/desactivar)
  const toggleEstado = async (id, estadoActual) => {
    try {
      await fetch(`${API_URL}/estado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: estadoActual ? 0 : 1 }),
      });
      fetchImagenes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setDragOver(false);
    setDragValid(false);
    procesarArchivos(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
    setDragValid(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
    setDragValid(false);
  };

  return (
    <div className="admin-container">
      <div className="box-card">
        <h3
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          Aquí puedes gestionar las imágenes y videos que aparecen en la
          pantalla principal.
        </h3>
       
        <div
          className={`drop-zone ${
            dragOver ? (dragValid ? "valid" : "invalid") : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            className={`drop-content ${
              dragOver ? (dragValid ? "valid" : "invalid") : ""
            }`}
          >
            <p>
              <span className="drop-icon">📂</span>
              Arrastra y suelta tus <strong>imágenes</strong> o{" "}
              <strong>videos</strong> aquí
            </p>
            <label
              className={`upload-label ${
                dragOver ? (dragValid ? "valid" : "invalid") : ""
              }`}
            >
              <>
                Seleccionar archivos
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleCargar}
                  className="hidden-input"
                />
              </>
            </label>
          </div>
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <h3
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          Las imágenes activas se muestran en la pantalla principal:
        </h3>
        <p>las imagenes se activan o desactivan haciendo click sobre ellas.</p>

        <div style={{ backgroundColor: "#afafafff" }}>
          <hr />
          <div className="imagenes-grid" >
            {imagenes.map((img) => (
              <div key={img.id} title={`Haz click para ${img.estado ? 'desactivar' : 'activar' }`} className={`imagen-wrapper ${img.estado ? 'activo' : 'desactivado'  }`}   onClick={() => toggleEstado(img.id, img.estado)}>
                <img
                  src={`${API_URL}/${img.id}`}
                  alt={img.nombre}
                  className="imagen-thumbnail"
                  style={{ opacity: img.estado ? 1 : 0.3}}
                />

                <div className="img-actions">
                  <button title="Eliminar imagen"
                   
                    className="btn-eliminar"
                    onClick={() => eliminarImagen(img.id)}
                  >
                    <span   style={{position:"absolute", top:1, right:10,}}>X</span>
                  </button>
                  {/* <button
                    className="btn-toggle"
                    onClick={() => toggleEstado(img.id, img.estado)}
                  >
                    {img.estado ? "Desactivar" : "Activar"}
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default FileManager;
