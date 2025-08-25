# Dynamic Inventory Design Summary

## 🏗️ Core Building Blocks

1. **Modules**

   - Highest-level entities (e.g., Product, Sales, Supplier, Customer).
   - Tied to a **tenantId** since the platform is SaaS.

2. **Fields**

   - Define the attributes of each Module (e.g., Product Name, Description, Price, Quantity).
   - Each Field belongs to a Module.

3. **DataTypes**
   - Define the format/behavior of a Field (e.g., string, boolean, number, array, date, reference).
   - Determines UI rendering & validation.

---

## 🔑 Relationships

- **Abstract Relationship Model**:

  - Relationship = (Module A ↔ Module B).
  - Types: one-to-one, one-to-many, many-to-many.
  - Stored as metadata (so any Module can link to any other).

- **Example**:
  - Product ↔ Sales = one Product can appear in many Sales, a Sale can contain many Products.
  - Requires a **join entity** (like SaleLineItem) to hold fields like qty, price, discount.

---

## 📦 Inventory-Specific Concepts

1. **Quantity / Stock** (in vs out, movement tracking).
2. **Price** (base price, cost price, selling price).
3. **Discounts** (absolute, percentage).
4. **Tax** (applied per product, per sale, or global).
5. **Roles & Actors** (customers, suppliers, employees).
6. **Documents / Transactions** (orders, receipts, invoices).
7. **Audit Trail** (who changed what, when).

---

## ⚙️ Configurations for Flexibility

- **Field Metadata**: mark special fields (e.g., “this field represents Quantity” or “this is Price”).
- **Relationship Configs**: define how modules interact (e.g., “Products reduce Quantity when linked to Sales”).
- **Business Rules / Automations**: triggers like “On Sale → reduce Product stock.”

---

## 🧩 The Big Idea

- **Modules = nouns** (things like Product, Sale, Supplier).
- **Fields = properties of nouns**.
- **Relationships = verbs/links** (Sale contains Products, Supplier provides Products).
- **Special Configurations** make the abstraction meaningful for inventory (stock, price, tax, discount, roles).
