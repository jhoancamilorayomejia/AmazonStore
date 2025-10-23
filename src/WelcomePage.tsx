import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type LoginResponse } from "./services/authService";

export default function WelcomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { user?: LoginResponse } | undefined;
  const user = state?.user;

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    navigate("/", { replace: true });
    alert("Sesión cerrada");
  };

  if (!user) return null;

  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
      {/* Navbar */}
      <header className="flex justify-between items-center py-5 px-10 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            <span className="material-icons text-3xl cursor-pointer hover:text-neutral-400 transition">
              menu
            </span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            MATCHSTORE
          </h1>
        </div>

         {/* Menú lateral */}
      {menuOpen && (
        <div className="absolute top-0 left-0 w-64 h-full bg-neutral-900 shadow-lg z-40 p-6 animate-slideIn">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-neutral-400 hover:text-white mb-6 flex items-center gap-2"
          >
            <span className="material-icons">close</span> Cerrar
          </button>
          <ul className="flex flex-col gap-4 text-lg">
            <li>
              <a href="#" className="hover:text-neutral-400 transition">
                Ropa deportiva
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-neutral-400 transition">
                Proteínas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-neutral-400 transition">
                Creatinas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-neutral-400 transition">
                Accesorios
              </a>
            </li>
          </ul>
        </div>
      )}

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm text-neutral-300">
                Hola, {user.name} {user.lastname}
              </span>
              <button
                onClick={handleLogout}
                className="hover:text-neutral-400 text-sm transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : null}
        </div>
      </header>

     

      {/* Hero Section modificado */}
     <section className="relative h-[60vh] bg-[url('https://images.unsplash.com/photo-1697129392091-d08875930fec?fm=jpg&q=60&w=3000')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/70 text-white px-8 py-10 text-center rounded-lg">
          <h2 className="text-4xl font-bold mb-3 uppercase tracking-wide">
            ¡Bienvenido, {user.name}!
          </h2>
          <p className="text-sm mb-6 text-neutral-300">
            Has iniciado sesión correctamente en MATCHSTORE.
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-neutral-200 transition">
            Agregar Productos nuevos
          </button>
        </div>
      </section>

        {/* Footer */}
<footer className="border-t border-neutral-800 py-3 px-6 text-xs text-neutral-400 flex justify-between items-center mt-8">
  <p>© 2025 MATCHSTORE. Todos los derechos reservados.</p>
  <div className="flex gap-3">
    <a href="#" className="hover:text-white">
      Instagram
    </a>
    <a href="#" className="hover:text-white">
      Facebook
    </a>
    <a href="#" className="hover:text-white">
      TikTok
    </a>
  </div>
</footer>

    </div>
  );
}
