import { useState } from 'react';
import ThemeToggle from '../theme/themeToggle';
import "./Administrator.css";

const Administrador = () => {
  const [imagenes, setImagenes] = useState(() => {
    return JSON.parse(localStorage.getItem('imagenes')) || [];
  });

  const [dragOver, setDragOver] = useState(false);
  const [dragValid, setDragValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isFileValid = (file) =>
    file.type.startsWith("image/") || file.type.startsWith("video/");

  const handleCargar = (e) => {
    const files = Array.from(e.target.files);
    procesarArchivos(files);
  };

  const procesarArchivos = (files) => {
    const nuevos = [];
    const archivosValidos = files.filter(isFileValid);
    const archivosInvalidos = files.filter((file) => !isFileValid(file));

    if (archivosInvalidos.length > 0) {
      setErrorMsg("Solo se permiten archivos de imagen o video.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    archivosValidos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        nuevos.push(event.target.result);
        if (nuevos.length === archivosValidos.length) {
          const nuevasImagenes = [...imagenes, ...nuevos];
          setImagenes(nuevasImagenes);
          localStorage.setItem('imagenes', JSON.stringify(nuevasImagenes));
          window.dispatchEvent(new Event("imagenesActualizadas")); // Evento disparado aquí
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const eliminarImagen = (index) => {
    const actualizadas = imagenes.filter((_, i) => i !== index);
    setImagenes(actualizadas);
    localStorage.setItem('imagenes', JSON.stringify(actualizadas));
    window.dispatchEvent(new Event("imagenesActualizadas")); // Evento disparado aquí
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const isValid = files.every(isFileValid);
    setDragOver(false);
    setDragValid(false);

    if (!isValid) {
      setErrorMsg("Solo se permiten archivos de imagen o video.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    procesarArchivos(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.items);
    const valid = files.every((item) => {
      const type = item.type;
      return type.startsWith("image/") || type.startsWith("video/");
    });

    setDragOver(true);
    setDragValid(valid);
  };

  const handleDragLeave = () => {
    setDragOver(false);
    setDragValid(false);
  };

  return (
    <div className="admin-container">
      <ThemeToggle />
      <h1 className="admin-title">Administrador de Archivos</h1>

      <div
        className={`drop-zone ${dragOver ? (dragValid ? "valid" : "invalid") : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="drop-content">
          <span className="drop-icon">📂</span>
          <p>Arrastra y suelta tus <strong>imágenes</strong> o <strong>videos</strong> aquí</p>
          <p>o haz clic para seleccionarlos</p>
          <label className="upload-label">
            Seleccionar archivos
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleCargar}
              className="hidden-input"
            />
          </label>
        </div>
      </div>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <div className="imagenes-grid">
        {imagenes.map((archivo, i) => (
          <div key={i} className="imagen-wrapper">
            {archivo.startsWith("data:image") ? (
              <img src={archivo} alt={`img-${i}`} className="imagen-thumbnail" />
            ) : (
              <video src={archivo} className="imagen-thumbnail" controls />
            )}
            <button className="btn-eliminar" onClick={() => eliminarImagen(i)}>✖</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Administrador;
