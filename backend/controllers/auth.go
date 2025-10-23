package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/jhoancamilorayomejia/AmazonStore/backend/db"
	"github.com/jhoancamilorayomejia/AmazonStore/backend/models"
	"go.mongodb.org/mongo-driver/bson"
)

type LoginRequest struct {
	Correo   string `json:"correo"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error al leer los datos", http.StatusBadRequest)
		return
	}

	req.Correo = strings.TrimSpace(req.Correo)
	req.Password = strings.TrimSpace(req.Password)

	fmt.Println("🔍 Intentando login con:", req.Correo)

	collection := db.GetCollection("users")
	fmt.Println("🔗 Conectado a la colección users")

	var user models.User

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := collection.FindOne(ctx, bson.M{"correo": req.Correo}).Decode(&user)
	if err != nil {
		fmt.Println("❌ Error al buscar usuario:", err)
		http.Error(w, "Correo no encontrado", http.StatusUnauthorized)
		return
	}

	fmt.Printf("📦 Usuario en BD: correo='%s', password='%s'\n", user.Correo, user.Password)

	if req.Password != user.Password {
		http.Error(w, "Contraseña incorrecta", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "Inicio de sesión exitoso",
		"iduser":   user.ID,
		"usertype": user.UserType,
		"name":     user.Name,
		"lastname": user.LastName,
		"token":    "",
	})
}
