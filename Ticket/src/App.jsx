import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/context/AuthContext";
import Home from "./Components/pages/Home";
import TicketGenerator from "./Components/pages/TicketGenerator";
import OperatorPanel from "./Components/pages/OperatorPanel";
import Login from "./Components/pages/Login";
import ProtectedRoute from "./Components/pages/ProtectRole";
import CreateUser from "./Components/pages/CreateUser";
import { TurnoProvider } from "./Components/context/TurnoContext";
import AddUserForm from "./Components/add/addUser";
import AdminPanel from "./Components/pages/AdminPages/AdminPanel";

import TicketPanel from "./Components/pages/Display/FetchDisplay";
import { SocketProvider } from "./Components/context/socketContext";
import { useEffect } from "react";
import App_params_config from "@/Params_config";

function App() {
  useEffect(() => {
    document.title = App_params_config.text.shortname
      ? App_params_config.text.shortname + " | Gestor de Turnos"
      : "Gestor de Turnos";
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = App_params_config.images.web_icon;
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <TurnoProvider>
          <BrowserRouter basename="/tk/">
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/cliente" element={<TicketGenerator />} />
              <Route path="/pantalla" element={<TicketPanel />} />
              <Route path="/addUser" element={<AddUserForm />} />
              <Route path="/login/admin" element={<Login role="admin" />} />
              <Route
                path="/login/operador"
                element={<Login role="operador" />}
              />

              <Route path="/createUser" element={<CreateUser />} />

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
                  <ProtectedRoute roles={["operador"]['admin']}>
                    <OperatorPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TurnoProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
