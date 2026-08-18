import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegistroPage } from "./pages/Auth/RegistroPage";
import { InicioPage } from "./pages/Inicio/InicioPage";
import { EstoquePage } from "./pages/Estoque/EstoquePage";
import { ComprasIndexPage } from "./pages/Compra/ComprasIndexPage";
import { ListaComprasPage } from "./pages/Compra/ListaComprasPage";
import { HistoricoPage } from "./pages/Historico/HistoricoPage";
import { BottomNav } from "./components/BottomNav";

function AppShell() {
  return (
    <>
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/compras" element={<ComprasIndexPage />} />
        <Route path="/compras/:id" element={<ListaComprasPage />} />
        <Route path="/historico" element={<HistoricoPage />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-surface min-h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<AppShell />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}
