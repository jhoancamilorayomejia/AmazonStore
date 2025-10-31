package models

type Product struct {
	IDProduct   int     `json:"idproduct" bson:"idproduct"`
	Section     string  `json:"section" bson:"section"`
	Ref         string  `json:"ref" bson:"ref"`
	Name        string  `json:"name" bson:"name"`
	Marca       string  `json:"marca,omitempty" bson:"marca,omitempty"`
	Tipo        string  `json:"tipo,omitempty" bson:"tipo,omitempty"`
	Size        string  `json:"size,omitempty" bson:"size,omitempty"`
	Price       float64 `json:"price" bson:"price"`
	Description string  `json:"description,omitempty" bson:"description,omitempty"`
	Image       string  `json:"image,omitempty" bson:"image,omitempty"`
}
