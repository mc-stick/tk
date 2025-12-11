import { useState, useEffect } from "react";
import ThemeToggle from "../../theme/themeToggle";
import { FaWindowClose } from "react-icons/fa";

const services = import.meta.env.VITE_SERVICE_API;
const API_URL = `${services}/img`;

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
    <div className="admin-container p-6">
      <div className="box-card bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-center mb-6">
          Aquí puedes gestionar las imágenes y videos que aparecen en la pantalla principal.
        </h3>

        <div
          className={`drop-zone p-6 border-2 border-dashed  rounded-lg mb-6 ${
            dragOver ? (dragValid ? "border-green-500" : "border-red-500") : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            className={`drop-content ${dragOver ? (dragValid ? "text-green-500" : "text-red-500") : ""}`}
          >
            <p className="text-center">
              <span className="text-3xl">📂</span>
              Arrastra y suelta tus <strong>imágenes</strong> o <strong>videos</strong> aquí
            </p>
            <label
              className={`upload-label block mt-4 text-center cursor-pointer ${
                dragOver ? (dragValid ? "text-green-500" : "text-red-500") : "text-blue-500"
              }`}
            >
              Seleccionar archivos
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleCargar}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}

        <h3 className="text-xl font-semibold text-center mb-4">
          Las imágenes activas se muestran en la pantalla principal:
        </h3>
        <p className="text-center mb-6">Las imágenes se activan o desactivan haciendo clic sobre ellas.</p>

        <div className="imagenes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {imagenes.map((img) => (
            <div
              key={img.id}
              title={`Haz click para ${img.estado ? "desactivar" : "activar"}`}
              className={`imagen-wrapper ${img.estado ? "border-green-500" : "border-red-500"} p-1 border-4 rounded-lg cursor-pointer`}
              onClick={() => toggleEstado(img.id, img.estado)}
            ><div className="img-actions relative">
                <button
                  title="Eliminar imagen"
                  className="absolute top-0 right-0 text-red-600 text-xl bg-amber-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarImagen(img.id);
                  }}
                >
                  <FaWindowClose />
                </button>
              </div>
              <img
                src={`${API_URL}/${img.id}`}
                alt={img.nombre}
                className="imagen-thumbnail w-full h-auto rounded-md mb-2"
                style={{ opacity: img.estado ? 1 : 0.3 }}
              />
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
