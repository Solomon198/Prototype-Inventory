**Abstracts**

- If a field has a type of array of custom types then the field is like a module now and it must define fields(just like a module) and each field should be composed of the custom type. This is in response to the question of having Sale as a combination of having products (Module to module relationship)

- The value of a field is either an input (GUI) which is a primitive type or a reference to where to get the value which is of the form $module.$field.value since each field have a value prop. This could extend down since after getting the value we have to make sure its not another ref, if so we repeat the process untill we get a primitive value. This is in response

- Asuming we have f1 and f2 as fields and we are creating another field as f3 we can say the value of f3 is an operation between f1 and f2. This means the defination of fields now have to carry a predictable structure that interprets the value of the field as an operation between f1, f2, f3 .... fn

**Todos base on Abstracts**

- make sure every field have a field field called operation and this operation field would contain refrences to values of field binded by a mathematical operation, field must also have two key or prop for defining speicifically now array of some custom type.
- our system must able to recognize both custom types and primitive types and peform action appriopriately
- Actions would also follow the references way also so we have a single source of truth.

**The aim of this is to be able to allow**

- Module --> Module Relationship or operations.
- Field --> Field Relationship or Operations.
- Module --> Field Relationship and vice versa or Operations.
