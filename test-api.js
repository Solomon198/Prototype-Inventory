const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testAPI() {
  try {
    console.log("🧪 Testing Inventory API...\n");

    // Test health endpoint
    console.log("1. Testing health endpoint...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health check passed:", healthResponse.data);
    console.log("");

    // Test creating an item
    console.log("2. Testing item creation...");
    const newItem = {
      name: "Test Laptop",
      description: "A test laptop for inventory management",
      category: "Electronics",
      quantity: 5,
      unit: "pieces",
      price: 999.99,
      supplier: "Test Supplier",
      location: "Warehouse A",
      minStockLevel: 2,
    };

    const createResponse = await axios.post(`${BASE_URL}/api/items`, newItem);
    console.log("✅ Item created:", createResponse.data.data.name);
    const itemId = createResponse.data.data._id;
    console.log("");

    // Test getting all items
    console.log("3. Testing get all items...");
    const getAllResponse = await axios.get(`${BASE_URL}/api/items`);
    console.log(
      "✅ Retrieved items:",
      getAllResponse.data.data.length,
      "items"
    );
    console.log("");

    // Test getting single item
    console.log("4. Testing get single item...");
    const getSingleResponse = await axios.get(
      `${BASE_URL}/api/items/${itemId}`
    );
    console.log("✅ Retrieved item:", getSingleResponse.data.data.name);
    console.log("");

    // Test updating item
    console.log("5. Testing item update...");
    const updateData = { quantity: 10 };
    const updateResponse = await axios.put(
      `${BASE_URL}/api/items/${itemId}`,
      updateData
    );
    console.log(
      "✅ Item updated, new quantity:",
      updateResponse.data.data.quantity
    );
    console.log("");

    // Test low stock endpoint
    console.log("6. Testing low stock endpoint...");
    const lowStockResponse = await axios.get(`${BASE_URL}/api/items/low-stock`);
    console.log("✅ Low stock items:", lowStockResponse.data.data.length);
    console.log("");

    // Test out of stock endpoint
    console.log("7. Testing out of stock endpoint...");
    const outOfStockResponse = await axios.get(
      `${BASE_URL}/api/items/out-of-stock`
    );
    console.log("✅ Out of stock items:", outOfStockResponse.data.data.length);
    console.log("");

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run the test
testAPI();
