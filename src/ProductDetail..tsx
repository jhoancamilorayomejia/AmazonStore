import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  lastname: string;
  email: string;
};

export default function WelcomePage() {
  const [user, setUser] = useState<User | null>(null);  // ✅ Guardamos el usuario aquí
  const navigate = useNavigate();

  // ✅ Cargar el usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  // ✅ Verificar si el usuario existe
  useEffect(() => {
    if (user === null) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null; // 🔥 Previene errores si carga lento

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="flex justify-between items-center py-5 px-10 border-b border-neutral-800">
        <h1 className="text-3xl font-bold">MATCHSTORE</h1>

        <div className="text-sm opacity-80">
          👤 Sesión: <strong>{user.name} {user.lastname}</strong>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/", { replace: true });
          }}
          className="hover:text-neutral-400 transition"
        >
          Cerrar sesión
        </button>
      </header>

      <section className="flex justify-center items-center h-[60vh]">
        <h2 className="text-4xl font-bold">
          ¡Bienvenido, {user.name}! 🎉
        </h2>
      </section>
    </div>
  );
}
