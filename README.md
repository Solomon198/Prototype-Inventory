# Inventory Prototype Backend

A basic Node.js backend application for inventory management built with Express, TypeScript, MongoDB, and Mongoose.

## Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Morgan** - HTTP request logger
- **Winston** - Structured logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Environment Variables** - Configuration management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd InventoryPrototype
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/inventory_prototype
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
```

5. Create logs directory:

```bash
mkdir logs
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Items Management

#### Get All Items

- `GET /api/items`
- Query Parameters:
  - `page` (default: 1) - Page number
  - `limit` (default: 10) - Items per page
  - `category` - Filter by category
  - `search` - Search in name and description
  - `sortBy` (default: createdAt) - Sort field
  - `sortOrder` (default: desc) - Sort order (asc/desc)

#### Get Single Item

- `GET /api/items/:id`

#### Create Item

- `POST /api/items`
- Body:

```json
{
  "name": "Item Name",
  "description": "Item description",
  "category": "Electronics",
  "quantity": 10,
  "unit": "pieces",
  "price": 29.99,
  "supplier": "Supplier Name",
  "location": "Warehouse A",
  "minStockLevel": 5
}
```

#### Update Item

- `PUT /api/items/:id`
- Body: Same as create item (all fields optional)

#### Delete Item

- `DELETE /api/items/:id` (Soft delete)

#### Get Low Stock Items

- `GET /api/items/low-stock`

#### Get Out of Stock Items

- `GET /api/items/out-of-stock`

## Data Models

### Item Schema

```typescript
{
  name: string (required, max 100 chars),
  description?: string (max 500 chars),
  category: string (required, enum: Electronics, Clothing, Food, Books, Tools, Other),
  quantity: number (required, min 0),
  unit: string (required, enum: pieces, kg, liters, boxes, pairs, units),
  price: number (required, min 0),
  supplier?: string (max 100 chars),
  location?: string (max 100 chars),
  minStockLevel: number (required, min 0),
  isActive: boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Logging

The application uses Winston for structured logging with the following features:

- Console logging with colors
- File logging for errors (`logs/error.log`)
- File logging for all logs (`logs/all.log`)
- HTTP request logging with Morgan
- Different log levels based on environment

## Error Handling

The application includes centralized error handling for:

- Mongoose validation errors
- MongoDB connection errors
- Invalid ObjectId errors
- Duplicate key errors
- 404 Not Found errors
- General server errors

## Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Environment variable protection

## Development

### Project Structure

```
src/
├── config/
│   ├── database.ts
│   ├── logger.ts
│   └── morgan.ts
├── controllers/
│   └── itemController.ts
├── middleware/
│   ├── errorHandler.ts
│   └── notFoundHandler.ts
├── models/
│   └── Item.ts
├── routes/
│   └── itemRoutes.ts
└── index.ts
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

## Environment Variables

| Variable        | Description               | Default                                       |
| --------------- | ------------------------- | --------------------------------------------- |
| `PORT`          | Server port               | 3000                                          |
| `NODE_ENV`      | Environment               | development                                   |
| `MONGODB_URI`   | MongoDB connection string | mongodb://localhost:27017/inventory_prototype |
| `LOG_LEVEL`     | Logging level             | info                                          |
| `LOG_FILE_PATH` | Log file path             | logs/app.log                                  |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
