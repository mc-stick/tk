import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/context/AuthContext";
import Home from "./Components/pages/Home";
import TicketGenerator from "./Components/pages/TicketGenerator";
import DisplayScreen from "./Components/pages/Display/DisplayScreen";
//import Administrator from "./Components/pages/AdminPages/FileManager";
import OperatorPanel from "./Components/pages/OperatorPanel";
import Login from "./Components/pages/Login";
import ProtectedRoute from "./Components/pages/ProtectRole";
import CreateUser from "./Components/pages/CreateUser";
import { TurnoProvider } from "./Components/context/TurnoContext";
import AddUserForm from "./Components/add/addUser";
import AdminPanel from "./Components/pages/AdminPages/AdminPanel";

 import './App.css'
// import Twilio_app from "./Components/twilio/twiApi";

function App() {
  return (
    <AuthProvider>
      <TurnoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Home/>} />
            <Route path="/" element={<Home />} />
            {/* <Route path="/twilio" element={<Twilio_app />} /> */}
            <Route path="/cliente" element={<TicketGenerator />} />
            <Route path="/pantalla" element={<DisplayScreen />} />
            <Route path="/addUser" element={<AddUserForm />} />

            {/* Login por rol */}
            <Route path="/login/admin" element={<Login role="admin" />} />
            <Route path="/login/operador" element={<Login role="operator" />} />

            <Route path="/createUser" element={<CreateUser />} />

            {/* Rutas protegidas según el rol */}
            <Route
              path="/administrador"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/operador"
              element={
                <ProtectedRoute roles={["operator"]}>
                  <OperatorPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TurnoProvider>
    </AuthProvider>
  );
}

export default App;
