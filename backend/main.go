package main

import (
	"fmt"
	"net/http"

	"github.com/jhoancamilorayomejia/AmazonStore/backend/controllers"
	"github.com/jhoancamilorayomejia/AmazonStore/backend/db"
)

func main() {
	// Conectar a MongoDB
	db.ConnectDB()
	fmt.Println("✅ Conexión a MongoDB establecida")

	// Función helper para habilitar CORS
	enableCORS := func(w http.ResponseWriter, r *http.Request) bool {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return false
		}
		return true
	}

	// Ruta de login
	http.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {
		if !enableCORS(w, r) {
			return
		}
		if r.Method == http.MethodPost {
			controllers.Login(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	})

	// Ruta para agregar productos
	http.HandleFunc("/api/addproduct", func(w http.ResponseWriter, r *http.Request) {
		if !enableCORS(w, r) {
			return
		}
		if r.Method == http.MethodPost {
			controllers.CreateProduct(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	})

	// Ruta para obtener todos los productos
	http.HandleFunc("/api/products", func(w http.ResponseWriter, r *http.Request) {
		if !enableCORS(w, r) {
			return
		}
		if r.Method == http.MethodGet {
			controllers.GetProducts(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	})

	// Iniciar servidor
	port := ":8080"
	fmt.Println("🚀 Servidor corriendo en http://localhost" + port)
	if err := http.ListenAndServe(port, nil); err != nil {
		fmt.Println("❌ Error al iniciar servidor:", err)
	}
}
