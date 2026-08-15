import { NavLink } from "react-router-dom";
import { Home, Package, ShoppingCart, History } from "lucide-react";

const TABS = [
  { to: "/", label: "Início", icon: Home, end: true },
  { to: "/estoque", label: "Estoque", icon: Package, end: false },
  { to: "/compras", label: "Compras", icon: ShoppingCart, end: false },
  { to: "/historico", label: "Histórico", icon: History, end: false },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-slate-100 bg-white py-2">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-col items-center gap-0.5 px-3 py-1"
        >
          {({ isActive }) => (
            <>
              <Icon
                size={20}
                className={isActive ? "text-brand-600" : "text-slate-400"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[11px] ${isActive ? "text-brand-600 font-semibold" : "text-slate-400"}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
