# TODO API Documentation

## 1. Introduction
This document provides API endpoints for managing todos using Firebase Authentication and Firestore.

## 2. Authentication
All requests must include a valid Firebase token in the `Authorization` header.

Example format:
```
Authorization: Bearer YOUR_FIREBASE_TOKEN
```

## 3. API Endpoints

### 3.1 Create a Todo
**Endpoint:** `POST /api/todos`  
**Description:** Creates a new todo item.  

**Command for Testing (cURL):**
```sh
curl -X POST http://localhost:5000/api/todos \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     -d '{ "title": "DeleteMe4", "description": "This todo will be deleted4" }'
```

---

### 3.2 Get All Todos
**Endpoint:** `GET /api/todos`  
**Description:** Retrieves all todos for the authenticated user.  

**Command for Testing (cURL):**
```sh
curl -X GET http://localhost:5000/api/todos \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

### 3.3 Mark a Todo as Completed
**Endpoint:** `PATCH /api/todos/:id`  
**Description:** Marks a todo as completed by updating the `completed` field.  

**Command for Testing (cURL):**
```sh
curl -X PATCH "http://localhost:5000/api/todos/TODO_ID" \
     -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"completed": true}'
```

---

### 3.4 Delete a Todo
**Endpoint:** `DELETE /api/todos/:id`  
**Description:** Deletes a todo by ID.  

**Command for Testing (cURL):**
```sh
curl -X DELETE "http://localhost:5000/api/todos/TODO_ID" \
     -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```
Replace `TODO_ID` with the actual todo ID.

---

## 4. Debugging & Tools Used
- **ChatGPT** was used for understanding syntax, debugging and testing cURL commands.
- **Postman** or **cURL** can be used for manual API testing.
- **Firebase Authentication** is used for securing endpoints.

---

## 5. Notes
- Replace `YOUR_FIREBASE_TOKEN` with a valid Firebase Authentication token.
- Ensure the `TODO_ID` is valid before making `PATCH` or `DELETE` requests.
