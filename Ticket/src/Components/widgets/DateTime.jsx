// DateTime.jsx
import { useEffect, useState } from "react";

import ImgLogo from "../../assets/img/UcneLogoIcon.png";
import ImgCustoms from "./ImgCustoms";
import "./DateTime.css"


const DateTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      {/* Logo */}
      <div style={styles.logo}>
        <ImgCustoms src={ImgLogo}  width="40px" />
        
        <h4 className="text" style={{flexDirection:'column', marginLeft:'20px', fontSize:'2rem'}}>UCNE</h4>
        {/* <ImgCustoms src={ImgLogo} width="50px" /> */}
      </div>

      {/* Fecha y hora */}
      <div style={styles.datetime}>
        <h4 style={styles.text}>
          
          {now.toLocaleTimeString()}
          <span style={{marginLeft:'40px'}}></span>
          {/* <hr style={{ margin: "5px 0", borderColor: "#fff" }} /> */}
          {now.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h4>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    top: 0,
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#004da5ff",
    color: "#fff",
    padding: "10px 100px 10px 10px",
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  },
  logo: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  datetime: {
    flex: "1",
    textAlign: "right",
  },
  text: {
    margin: 0,
    fontSize: "1.5rem",
    lineHeight: "1.4",
  },
  Title_cn: {
    display:'grid',
  textAlign: 'center',
  fontSize: '3.5rem',
  fontWeight: 'bold',
  color: '#ffffffff',
  borderBottom: '2px solid #00eeff',
}
};
export default DateTime;
