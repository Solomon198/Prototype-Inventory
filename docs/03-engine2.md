# Dynamic Module Engine – Relationship-Centric Design

This document describes how modules, fields, datatypes, and relationships are stored in the engine.  
The core idea: every Module owns its relationships, which define what happens to other modules when actions occur.

## 1. `Modules` Collection

Each module is an object describing:

- Its fields (schema definition)
- Its data storage (records live in `Module Data Collection`)
- Its relationships (effects this module has on other modules)

```json
{
  "id": "module_1",
  "name": "Product",
  "fields": [
    { "name": "productId", "type": "string", "primary": true },
    { "name": "name", "type": "string" },
    { "name": "price", "type": "number" },
    { "name": "quantity", "type": "number" }
  ],
  "relationships": [
    {
      "toModule": "Sale",
      "type": "many-to-many",
      "actions": [
        { "trigger": "delete", "effect": "cascadeDelete", "target": "Sale" }
      ]
    }
  ]
}
```
