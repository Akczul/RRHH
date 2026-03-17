# RRHH Backend

API REST para gestion de recursos humanos con Node.js, Express y MongoDB (Mongoose).

## Ejecucion

```bash
npm install
npm run dev
```

Servidor por defecto: `http://localhost:4000`

## Nuevos Modelos

### Category

- `name` (String, requerido): nombre de la categoria.
- `description` (String, opcional): descripcion de la categoria.
- `createdAt` (Date): fecha de creacion automatica.

### Product

- `name` (String, requerido): nombre del producto.
- `description` (String, opcional): descripcion del producto.
- `price` (Number, requerido): precio del producto (minimo `0`).
- `categoryId` (ObjectId, requerido): referencia a `Category`.
- `createdAt` (Date): fecha de creacion automatica.

### Relacion entre modelos

- `Category (1) -> (N) Product`.
- Una categoria puede tener muchos productos.
- Un producto pertenece a una sola categoria.

## Nuevos Endpoints

### Categories (`/api/categories`)

- `POST /api/categories`: crear categoria.
- `GET /api/categories`: listar categorias.
- `GET /api/categories/:id`: obtener categoria por ID.
- `PUT /api/categories/:id`: actualizar categoria.
- `DELETE /api/categories/:id`: eliminar categoria.

### Products (`/api/products`)

- `POST /api/products`: crear producto.
- `GET /api/products`: listar productos.
- `GET /api/products/:id`: obtener producto por ID.
- `PUT /api/products/:id`: actualizar producto.
- `DELETE /api/products/:id`: eliminar producto.

## Ejemplos de peticiones y respuestas

### 1) Crear categoria

Request:

```http
POST /api/categories
Content-Type: application/json

{
  "name": "Laptops",
  "description": "Equipos portatiles"
}
```

Response `201`:

```json
{
  "_id": "67d7503d0f9a0d0f40e8f111",
  "name": "Laptops",
  "description": "Equipos portatiles",
  "createdAt": "2026-03-17T18:00:00.000Z",
  "__v": 0
}
```

### 2) Crear producto

Request:

```http
POST /api/products
Content-Type: application/json

{
  "name": "ThinkPad X1",
  "description": "Laptop para trabajo",
  "price": 1850,
  "categoryId": "67d7503d0f9a0d0f40e8f111"
}
```

Response `201`:

```json
{
  "_id": "67d7508d0f9a0d0f40e8f222",
  "name": "ThinkPad X1",
  "description": "Laptop para trabajo",
  "price": 1850,
  "categoryId": {
    "_id": "67d7503d0f9a0d0f40e8f111",
    "name": "Laptops",
    "description": "Equipos portatiles"
  },
  "createdAt": "2026-03-17T18:02:00.000Z",
  "__v": 0
}
```

### 3) Obtener productos

Request:

```http
GET /api/products
```

Response `200`:

```json
[
  {
    "_id": "67d7508d0f9a0d0f40e8f222",
    "name": "ThinkPad X1",
    "description": "Laptop para trabajo",
    "price": 1850,
    "categoryId": {
      "_id": "67d7503d0f9a0d0f40e8f111",
      "name": "Laptops",
      "description": "Equipos portatiles"
    },
    "createdAt": "2026-03-17T18:02:00.000Z",
    "__v": 0
  }
]
```