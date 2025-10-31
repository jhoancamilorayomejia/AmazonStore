import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type LoginResponse } from "./services/authService";



type Product = {
  IDProduct: number;    
  Section: string;       
  Ref: string;           
  Name: string;          
  Marca?: string;        
  Tipo?: string;         
  Tamano?: string;       
  Price: number;         
  Description?: string;  
  Image?: string;      
  quantity?: number;
};

export default function WelcomePage() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);

  // ✅ NUEVOS ESTADOS PARA EL MODAL DE PRODUCTO
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [quantity, setQuantity] = useState(1);



  
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement | null>(null);

  const state = location.state as { user?: LoginResponse } | undefined;
  const user = state?.user;

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSearch(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") setShowProductModal(false);
  }

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []);


  const handleLogout = () => {
    navigate("/", { replace: true });
    alert("Sesión cerrada");
  };

  const removeFromCart = (index: number) => {
  setCart((prev) => prev.filter((_, i) => i !== index));
};


  const addToCart = (product: Product, qty: number = 1) => {
  setCart((prev) => {
    const existing = prev.find((p) => p.IDProduct === product.IDProduct);

    if (existing) {
      return prev.map((p) =>
        p.IDProduct === product.IDProduct
          ? { ...p, quantity: (p.quantity || 1) + qty }
          : p
      );
    }

    return [...prev, { ...product, quantity: qty }];
  });

  alert(`🛒 Añadido al carrito: ${product.Name} x${qty}`);
};




  const categories = ["Proteínas", "Creatinas", "Ropa deportiva", "Accesorios"];
  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSearchQuery(cat);
    setShowSearch(false);
    alert(`Buscando categoría: ${cat}`);
  };

  useEffect(() => {
  if (!user) return;

  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  fetchProducts();
}, [user]);


  if (!user) return null;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!selectedSection) {
    alert("⚠️ Debes seleccionar una sección antes de guardar");
    return;
  }

  const form = e.currentTarget;
  const formData = new FormData(form);

  const data = {
    section: selectedSection,
    ref: formData.get("ref")?.toString() || "",
    name: formData.get("name")?.toString() || "",
    tipo: formData.get("tip")?.toString() || "",
    marca: formData.get("marca")?.toString() || "",
    tamano: formData.get("size")?.toString() || "",
    price: parseFloat(formData.get("price")?.toString() || "0"),
    description: formData.get("description")?.toString() || "",
    image: formData.get("image")?.toString() || "", // aquí la URL
  };

  try {
    const response = await fetch("http://localhost:8080/api/addproduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al agregar producto");

    const result = await response.json();
    alert("✅ Producto agregado correctamente. Imagen: " + result.image);
    setShowModal(false);
    form.reset();
    setSelectedSection("");
  } catch (err) {
    console.error(err);
    alert("❌ Error al guardar el producto");
  }
};




return (
  <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
    {/* Navbar */}
    <header className="flex justify-between items-center py-5 px-10 border-b border-neutral-800 relative">
      <div className="flex items-center gap-6">
        {/* Icono de lupa con dropdown */}
        <div ref={searchRef} className="relative">
          <button
            onClick={() => {
              setShowSearch((s) => !s);
              setSearchQuery("");
            }}
            className="focus:outline-none"
            aria-label="Buscar"
          >
            <span className="material-icons text-3xl cursor-pointer hover:text-neutral-400 transition">
              search
            </span>
          </button>

          {/* Panel de sugerencias */}
          {showSearch && (
            <div className="absolute left-0 mt-3 w-[400px] bg-neutral-900 border border-neutral-800 rounded-md shadow-lg z-50 p-3">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar categorías..."
                className="w-full p-2 rounded-md bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none mb-3"
              />
              <ul className="flex flex-row flex-wrap gap-2">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => onSelectCategory(cat)}
                      className="bg-neutral-800 px-4 py-2 rounded-md cursor-pointer hover:bg-neutral-700 transition text-sm"
                    >
                      {cat}
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500 p-2 text-sm">
                    No se encontraron resultados.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight uppercase">
          MATCHSTORE
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <>
            <span className="text-sm text-neutral-300">
              Hola, Admin {/* user.name} {user.lastname} */}
            </span>
            <button
              onClick={handleLogout}
              className="hover:text-neutral-400 text-sm transition flex items-center gap-1"
              aria-label="Cerrar sesión"
            >
              <span className="material-icons text-lg">logout</span>
              <span className="hidden sm:inline">Cerrar sesión</span>

            </button>
            <button
  onClick={() => setShowCart(true)}
  className="relative hover:text-neutral-400 transition"
>
  <span className="material-icons text-2xl">shopping_cart</span>

  {/* Contador */}
  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-0.5 rounded-full">
      {cart.length}
    </span>
  )}
</button>
          </>
        )}
      </div>
    </header>

    

    {/* Hero Section */}
    <section className="relative h-[60vh] bg-[url('https://images.unsplash.com/photo-1697129392091-d08875930fec?fm=jpg&q=60&w=3000')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-black/70 text-white px-8 py-10 text-center rounded-lg">
        <h2 className="text-4xl font-bold mb-3 uppercase tracking-wide">
          ¡Bienvenido, {user.name}!
        </h2>
        <p className="text-sm mb-4 text-neutral-300">
          Has iniciado sesión correctamente en MATCHSTORE.
        </p>

        {selectedCategory ? (
          <p className="mb-6 text-white/90">
            Mostrando: <span className="font-semibold">{selectedCategory}</span>
          </p>
        ) : (
          <p className="mb-6 text-neutral-300">Bienvenido a la sección del Administrador.</p>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-neutral-200 transition"
          >
            Agregar Productos nuevos
          </button>
        </div>
      </div>

      
    </section>

 {/* Products */}
<main className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
  {products.map((p) => (
    <div
  key={p.IDProduct}
  onClick={() => {
  setSelectedProduct(p);
  setQuantity(1);
  setShowProductModal(true);
}}

className="cursor-pointer"

>

      <div className="overflow-hidden rounded-md">
        <img
          src={p.Image}
          alt={p.Name}
          className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="mt-3 text-center text-lg font-semibold">{p.Name}</h3>
      {p.Marca && <p className="text-center text-sm">{p.Marca}</p>}
      <p className="text-center text-sm font-bold">${p.Price}</p>

     
    </div>
  ))}
</main>

{/*para abrir la caja de informacion del producto */}
{showProductModal && selectedProduct && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setShowProductModal(false)}
  >
    <div
      className="bg-black text-white w-full max-w-4xl rounded-xl p-6 shadow-lg overflow-y-auto max-h-[90vh] border border-gray-600"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Botón cerrar */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowProductModal(false)}
          className="text-xl font-bold hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={selectedProduct.Image}
          alt={selectedProduct.Name}
          className="w-full h-auto rounded-lg object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold">{selectedProduct.Name}</h2>
          {selectedProduct.Marca && <p className="text-lg mt-1">Marca: {selectedProduct.Marca}</p>}
          {selectedProduct.Tipo && <p className="text-md">Tipo: {selectedProduct.Tipo}</p>}
          {selectedProduct.Tamano && <p className="text-md">Tamaño: {selectedProduct.Tamano}</p>}
          <p className="text-2xl font-bold mt-4">${selectedProduct.Price}</p>

          {selectedProduct.Description && (
            <p className="mt-4 text-gray-300">{selectedProduct.Description}</p>
          )}

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              -
            </button>

            <span className="text-lg font-bold">{quantity}</span>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              addToCart(selectedProduct, quantity);
              setShowProductModal(false);
            }}
            className="mt-4 w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            Añadir al carrito 🛒
          </button>
        </div>
      </div>
    </div>
  </div>
)}






{showCart && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-neutral-900 p-6 rounded-lg w-[400px] max-h-[70vh] overflow-y-auto relative">
      
      {/* Botón cerrar */}
      <button
        onClick={() => setShowCart(false)}
        className="absolute top-3 right-3 text-neutral-400 hover:text-white"
      >
        <span className="material-icons">close</span>
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">🛒 Carrito</h2>

      {cart.length === 0 ? (
        <p className="text-center text-neutral-400">Tu carrito está vacío.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item: Product, i: number) => (
  <li key={i} className="flex items-center gap-4 border-b border-neutral-800 pb-3">
    <img src={item.Image} className="w-16 h-16 object-cover rounded"/>
    
    <div className="flex-1">
      <p className="font-semibold">{item.Name}</p>
      <p className="text-sm text-neutral-400">
  ${item.Price} x {item.quantity || 1}
</p>

    </div>

    {/* Botón eliminar */}
    <button
      onClick={() => removeFromCart(i)}
      className="text-red-500 hover:text-red-400 transition"
      title="Eliminar del carrito"
    >
      <span className="material-icons">delete</span>
    </button>
  </li>
))}

        </ul>
      )}

      {cart.length > 0 && (
        <button
          className="mt-5 w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-neutral-200 transition"
        >
          Proceder al pago
        </button>
      )}
    </div>
  </div>
)}




    {/* Modal de agregar producto */}
    {showModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-neutral-900 p-10 rounded-2xl shadow-2xl w-[800px] max-h-[90vh] overflow-y-auto relative">
          {/* Botón cerrar */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white z-50"
          >
            <span className="material-icons text-2xl">close</span>
          </button>

          <h3 className="text-2xl font-bold mb-8 text-center">
            Agregar nuevo producto
          </h3>

          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* Sección */}
            <div>
              <label className="text-sm text-neutral-300">Sección</label>
              <select
                name="section"
                className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Seleccione tipo de producto</option>
                <option value="Proteínas">Proteínas</option>
                <option value="Creatinas">Creatinas</option>
                <option value="Ropa deportiva">Ropa deportiva</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            {/* Referencia */}
            <div>
              <label className="text-sm text-neutral-300">Referencia</label>
              <input
                name="ref"
                type="text"
                className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
                placeholder="Ingrese la referencia"
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="text-sm text-neutral-300">Nombre del producto</label>
              <input
                name="name"
                type="text"
                className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
                placeholder="Ingrese el nombre del producto"
              />
            </div>

            {/* Tipo de producto */}
            <div>
              <label className="text-sm text-neutral-300">Tipo de producto</label>
              <input
                name="tip"
                type="text"
                className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
                placeholder="Ej: Whey, Isolate, Camiseta..."
              />
            </div>

            {/* Marca */}
            <div>
              <label className="text-sm text-neutral-300">Marca</label>
              <input
                name="marca"
                type="text"
                className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
                placeholder="Marca"
              />
            </div>

            {/* Tamaño / Size */}
            <div>
              <label className="text-sm text-neutral-300">Tamaño / Size</label>
              <input
                name="tamano"
                type="text"
                className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
                placeholder="Ej: 2lb, M, L..."
              />
            </div>

            {/* Precio / Price */}
            <div>
              <label className="text-sm text-neutral-300">Precio / Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
                placeholder="Precio"
              />
            </div>
{/* Descripción / Description */}
<div className="col-span-2">
  <label className="text-sm text-neutral-300">Descripción / Description</label>
  <textarea
    name="description"
    className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
    rows={3}
    placeholder="Descripción del producto"
  />
</div>

{/* Imagen / Image */}
<div className="col-span-2">
  <label className="text-sm text-neutral-300">Imagen / Image (URL)</label>
  <input
    type="text"
    name="image"
    className="w-full bg-neutral-800 text-white p-3 rounded-md mt-1 focus:outline-none"
    placeholder="https://ejemplo.com/mi-imagen.jpg"
  />
</div>





            {/* Botón */}
            <div className="col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-white text-black py-3 px-10 rounded-md font-semibold hover:bg-neutral-200 transition"
              >
                Agregar producto
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Footer */}
    <footer className="border-t border-neutral-800 py-3 px-6 text-xs text-neutral-400 flex justify-between items-center mt-8">
      <p>© 2025 MATCHSTORE. Todos los derechos reservados.</p>
      <div className="flex gap-3">
        <a href="#" className="hover:text-white">Instagram</a>
        <a href="#" className="hover:text-white">Facebook</a>
        <a href="#" className="hover:text-white">TikTok</a>
      </div>
    </footer>
  </div>
);

}
