import { Routes, Route } from 'react-router-dom';
import { InicioPage } from './pages/Inicio/InicioPage';
import { EstoquePage } from './pages/Estoque/EstoquePage';
import { ComprasIndexPage } from './pages/Compra/ComprasIndexPage';
import { ListaComprasPage } from './pages/Compra/ListaComprasPage';
import { HistoricoPage } from './pages/Historico/HistoricoPage';
import { BottomNav } from './components/BottomNav';

export default function App() {
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
