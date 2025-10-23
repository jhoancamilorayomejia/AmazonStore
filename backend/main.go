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

	// Ruta de login con CORS habilitado
	http.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {
		// Cabeceras CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

		// Si es preflight request, devolver OK
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Manejar login
		if r.Method == http.MethodPost {
			controllers.Login(w, r)
			return
		}

		// Otros métodos no permitidos
		w.WriteHeader(http.StatusMethodNotAllowed)
	})

	// Servidor HTTP
	port := ":8080"
	fmt.Println("🚀 Servidor corriendo en http://localhost" + port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println("❌ Error al iniciar servidor:", err)
	}
}
