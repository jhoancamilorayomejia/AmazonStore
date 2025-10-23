package models

type User struct {
	ID       string `bson:"_id,omitempty" json:"iduser"`
	Cedula   string `bson:"cedula" json:"cedula"`
	Correo   string `bson:"correo" json:"correo"`
	Password string `bson:"password" json:"password"`
	Name     string `bson:"name" json:"name"`
	LastName string `bson:"lastname" json:"lastname"`
	UserType int    `bson:"usertype" json:"usertype"`
}
