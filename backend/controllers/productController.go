package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/jhoancamilorayomejia/AmazonStore/backend/db"
	"github.com/jhoancamilorayomejia/AmazonStore/backend/models"
	"go.mongodb.org/mongo-driver/bson"
)

func GetProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	productsColl := db.GetCollection("products")

	cursor, err := productsColl.Find(ctx, map[string]interface{}{})
	if err != nil {
		http.Error(w, "Error al obtener productos: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var products []models.Product
	if err = cursor.All(ctx, &products); err != nil {
		http.Error(w, "Error al decodificar productos: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Mapear campos para frontend
	var response []map[string]interface{}
	for _, p := range products {
		response = append(response, map[string]interface{}{
			"IDProduct":   p.IDProduct,
			"Ref":         p.Ref,
			"Name":        p.Name,
			"Section":     p.Section,
			"Image":       p.Image,
			"Marca":       p.Marca,
			"Tipo":        p.Tipo,
			"Size":        p.Size,
			"Price":       p.Price,
			"Description": p.Description,
		})
	}

	json.NewEncoder(w).Encode(response)
}

// CreateProduct guarda un producto en MongoDB usando URL de imagen
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Decodificar JSON del body
	var product models.Product
	err := json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		http.Error(w, "Error al leer datos: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Parsear precio
	if product.Price == 0 {
		var price float64
		fmt.Sscanf(r.FormValue("price"), "%f", &price)
		product.Price = price
	}

	// Conexión a MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	productsColl := db.GetCollection("products")
	countersColl := db.GetCollection("counters")

	// Generar ID autoincremental
	var counter struct{ Seq int }
	err = countersColl.FindOneAndUpdate(
		ctx,
		bson.M{"_id": "productid"},
		bson.M{"$inc": bson.M{"seq": 1}},
	).Decode(&counter)

	if err != nil {
		_, err = countersColl.InsertOne(ctx, bson.M{"_id": "productid", "seq": 1})
		if err != nil {
			http.Error(w, "Error al crear contador: "+err.Error(), http.StatusInternalServerError)
			return
		}
		counter.Seq = 1
	}

	product.IDProduct = counter.Seq

	// Guardar producto en MongoDB
	_, err = productsColl.InsertOne(ctx, product)
	if err != nil {
		http.Error(w, "Error al guardar producto: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "✅ Producto guardado",
		"image":   product.Image, // Se guarda la URL directamente
	})
}
