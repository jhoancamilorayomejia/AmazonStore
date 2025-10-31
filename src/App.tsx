import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { loginUser, type LoginResponse } from "./services/authService";
import WelcomePage from "./WelcomePage";
import ProductDetail from "./ProductDetail.";


function AppContent() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await loginUser(correo, password);
      setUser(data);
      setShowLogin(false);
      setError("");
      alert(`✅ Bienvenido ${data.name} ${data.lastname}`);
      navigate("/welcome", { state: { user: data } });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("❌ Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    setUser(null);
    alert("Sesión cerrada");
  };

  // Productos base
  const products = [
    {
      id: 1,
      name: "Proteína Whey",
      category: "Proteínas",
      image:
        "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nrx/nrx02905/y/33.jpg",
    },
    {
      id: 2,
      name: "Creatina Monohidratada",
      category: "Creatinas",
      image:
        "https://www.226ers.com/cdn/shop/files/1065.jpg?v=1747710495&width=1080",
    },
    {
      id: 3,
      name: "Ropa Deportiva",
      category: "Ropa deportiva",
      image:
        "https://images.pexels.com/photos/17917175/pexels-photo-17917175/free-photo-of-hombre-mujer-azul-joven.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      id: 4,
      name: "Accesorios de gimnasio",
      category: "Accesorios",
      image:
        "https://todoendeportes.com.co/wp-content/uploads/2022/07/Lazo-Salto-2.jpg",
    },
  ];

  const categories = ["Proteínas", "Creatinas", "Ropa deportiva", "Accesorios"];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
      {/* Navbar */}
      <header className="flex justify-between items-center py-5 px-10 border-b border-neutral-800 relative">
        <div className="flex items-center gap-4">
          {/* Lupa en lugar del menú */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="focus:outline-none"
          >
            <span className="material-icons text-3xl cursor-pointer hover:text-neutral-400 transition">
              search
            </span>
          </button>

          <h1 className="text-2xl font-bold tracking-tight uppercase">
            MATCHSTORE
          </h1>
        </div>

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
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="focus:outline-none"
            >
              <span className="material-icons text-3xl cursor-pointer hover:text-neutral-400 transition">
                account_circle
              </span>
            </button>
          )}
        </div>

        {/* Barra de búsqueda y sugerencias */}
        {showSearch && (
          <div className="absolute top-full left-0 w-full bg-neutral-900 border-t border-neutral-800 px-10 py-4 z-40 animate-fadeIn">
            <div className="max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Buscar productos o categorías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-md bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
              />

              {/* Lista de sugerencias */}
              <ul className="mt-3">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <li
                      key={cat}
                      className="p-2 cursor-pointer hover:bg-neutral-800 rounded-md transition"
                      onClick={() => setSearchQuery(cat)}
                    >
                      {cat}
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500 text-sm p-2">
                    No se encontraron resultados.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] bg-[url('https://images.unsplash.com/photo-1697129392091-d08875930fec?fm=jpg&q=60&w=3000')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/70 text-white px-8 py-10 text-center rounded-lg">
          <h2 className="text-4xl font-bold mb-3 uppercase tracking-wide">
            New in MATCHSTORE
          </h2>
          <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-neutral-200 transition">
            Ver Todos los Productos
          </button>
        </div>
      </section>

      {/* Products */}
      <main className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 transition"
          >
            <div className="overflow-hidden rounded-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="mt-3 text-center text-lg font-semibold">
              {product.name}
            </h3>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 px-10 text-sm text-neutral-400 flex justify-between items-center">
        <p>© 2025 MATCHSTORE. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">TikTok</a>
        </div>
      </footer>

      {/* Modal de inicio de sesión */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-neutral-900 p-8 rounded-2xl shadow-xl w-80 text-center relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white"
            >
              <span className="material-icons">close</span>
            </button>

            <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="p-3 rounded-md bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-md bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="bg-white text-black font-semibold py-2 rounded-md hover:bg-neutral-200 transition"
              >
                Entrar
              </button>
            </form>

            <p className="text-sm text-neutral-400 mt-4">
              ¿No tienes cuenta?{" "}
              <a href="#" className="text-white">
                Regístrate
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal con Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}
