# ⚙️ Core Engine: Dynamic Relationship System

## 1. **Core Concepts**

1. **Modules** → Independent entities (e.g., `Sale`, `Product`, `Expense`, `Customer`).
2. **Fields** → Attributes of a module (e.g., `name`, `stock`, `amount`).
3. **Relationships** → Links between two modules, with optional `through` fields.
4. **Events** → Actions triggered when relationship data changes.

---

## 2. **Relationship Structure**

Each relationship is defined as an object with:

```json
{
  "relationshipId": "rel_001",
  "baseModule": "Sale",
  "targetModule": "Product",
  "type": "many-to-many",
  "eventRules": {
    "onCreate": [
      {
        "action": "decrement",
        "targetField": "stock",
        "value": "through.quantity"
      },
      { "action": "snapshot", "fields": ["priceAtAction", "discountApplied"] }
    ],
    "onUpdate": [
      {
        "action": "adjust",
        "targetField": "stock",
        "delta": "old.quantity - new.quantity"
      }
    ],
    "onDelete": [
      {
        "action": "increment",
        "targetField": "stock",
        "value": "through.quantity"
      }
    ]
  }
}
```

---

## 3. **Event Categories**

1. **Create Event** → Fired when relationship record is added.
2. **Update Event** → Fired when through-fields are changed.
3. **Delete Event** → Fired when relationship record is removed.
4. **Snapshot Event** → Saves immutable data for historical accuracy.

---

## 4. **Event Actions (Generic)**

Every `eventRule` supports these **actions**:

- `increment` → Increase a field.
- `decrement` → Decrease a field.
- `adjust` → Apply delta change.
- `snapshot` → Save fields at the moment of action.
- `propagate` → Trigger further events in connected modules.

---

## 5. **Example Instantiations**

### a) **Sale ↔ Product**

- Base: `Sale`
- Target: `Product`
- `onCreate` → reduce stock
- `onDelete` → restore stock
- `snapshot` → freeze price

### b) **PurchaseOrder ↔ Product**

- Base: `PurchaseOrder`
- Target: `Product`
- `onCreate` → increase stock
- `onDelete` → reduce stock

### c) **Expense ↔ CashAccount**

- Base: `Expense`
- Target: `CashAccount`
- `onCreate` → deduct balance
- `onDelete` → restore balance

---

## 6. **Storage Strategy**

- **Modules Table/Collection** → stores all modules and their fields.
- **Relationships Table/Collection** → stores relationship definitions (like the JSON above).
- **Relationship Data Table/Collection** → stores actual through-records (like `Sale_Product` entries).

---

✅ With this engine, you don’t hardcode rules. You just:

1. Define modules.
2. Define relationships + event rules.
3. Store relationship instances.
4. Let the engine fire rules automatically.
