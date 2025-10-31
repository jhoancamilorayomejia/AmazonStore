import { useState } from "react";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    section: "",
    ref: "",
    name: "",
    marca: "",
    tipo: "",
    sabor: "",
    tamano: "",
    precio: "",
    descripcion: "",
    imagen: "",
    genero: "",
    color: "",
    material: "",
    tallas: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      precio: Number(formData.precio), // convertir a número
    };

    const response = await fetch("http://localhost:8080/api/addProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      alert("✅ Producto guardado correctamente");
      setFormData({
        section: "",
        ref: "",
        name: "",
        marca: "",
        tipo: "",
        sabor: "",
        tamano: "",
        precio: "",
        descripcion: "",
        imagen: "",
        genero: "",
        color: "",
        material: "",
        tallas: "",
      });
    } else {
      alert("❌ Error al guardar producto");
    }
  };

  return (
    <div className="p-10 text-white">
      <h2 className="text-2xl font-bold mb-6">Agregar Producto</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-w-xl">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={(formData as any)[key]}
            onChange={handleChange}
            className="p-2 rounded bg-neutral-800"
          />
        ))}

        <button
          type="submit"
          className="col-span-2 bg-white text-black py-2 rounded mt-4 hover:bg-neutral-300 transition"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
