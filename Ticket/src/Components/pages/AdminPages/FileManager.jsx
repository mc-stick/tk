import { useState } from "react";
import ThemeToggle from "../../theme/themeToggle";
import "./FileManager.css";

const Administrador = () => {
  const [imagenes, setImagenes] = useState(() => {
    return JSON.parse(localStorage.getItem("imagenes")) || [];
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
      setTimeout(() => setErrorMsg(""), 5000);
      return;
    }

    archivosValidos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        nuevos.push(event.target.result);
        if (nuevos.length === archivosValidos.length) {
          const nuevasImagenes = [...imagenes, ...nuevos];
          setImagenes(nuevasImagenes);
          localStorage.setItem("imagenes", JSON.stringify(nuevasImagenes));
          window.dispatchEvent(new Event("imagenesActualizadas")); // Evento disparado aquí
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const eliminarImagen = (index) => {
    const actualizadas = imagenes.filter((_, i) => i !== index);
    setImagenes(actualizadas);
    localStorage.setItem("imagenes", JSON.stringify(actualizadas));
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
      setTimeout(() => setErrorMsg(""), 10000);
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
      {/* <ThemeToggle /> */}

      <div className="box-card">
        <p>Aquí puedes gestionar el contenido que aparece en la pantalla principal, imagenes, anuncios, videos, etc...</p>
        <div
          className={`drop-zone ${
            dragOver ? (dragValid ? "valid" : "invalid") : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}>
          <div
            className={`drop-content ${
              dragOver ? (dragValid ? "valid" : "invalid") : ""
            }`}>
            <p>
              <span className="drop-icon">📂</span>
              Arrastra y suelta tus <strong>imágenes</strong> o{" "}
              <strong>videos</strong> aquí
            </p>
            <label
              className={`upload-label ${
                dragOver ? (dragValid ? "valid" : "invalid") : ""
              }`}><>
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
          }}>
          Las imagenes debajo se mostrarán en la pantalla principal.
          <br />
        </h3>
        <div
          style={{
            backgroundColor: "#afafafff",
          }}>
          <hr />
          <div className="imagenes-grid">
            {imagenes.map((archivo, i) => (
              <div key={i} className="imagen-wrapper">
                {archivo.startsWith("data:image") ? (
                  <img
                    src={archivo}
                    alt={`img-${i}`}
                    className="imagen-thumbnail"
                  />
                ) : (
                  <video src={archivo} className="imagen-thumbnail" controls />
                )}
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarImagen(i)}>
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Administrador;
