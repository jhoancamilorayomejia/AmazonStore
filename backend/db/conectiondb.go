package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func ConnectDB() *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")

	c, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("❌ Error al conectar a MongoDB:", err)
	}

	err = c.Ping(ctx, nil)
	if err != nil {
		log.Fatal("⚠️ No se pudo hacer ping a MongoDB:", err)
	}

	fmt.Println("✅ Conexión exitosa a MongoDB")
	client = c
	return client
}

func GetCollection(name string) *mongo.Collection {
	if client == nil {
		client = ConnectDB()
	}
	return client.Database("matchstore").Collection(name)
}
