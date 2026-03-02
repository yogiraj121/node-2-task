# To-Do List API Design Document

## Overview
This document outlines the RESTful API design for a Task Manager (To-Do List) application. The API follows REST principles and implements complete CRUD (Create, Read, Update, Delete) operations for managing tasks.

---

## Base URL
```
http://localhost:3000
```

---

## API Endpoints

### 1. Create a New Task (CREATE)

**Endpoint:** `POST /api/tasks`

**HTTP Method:** POST

**Purpose:** Creates a new task in the to-do list

**Request Headers:**
```
Content-Type: application/json
```

**Request Body Format:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the task manager"
}
```

**Expected Response (Success - 201 Created):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the task manager",
  "status": "pending"
}
```

**Expected Response (Error - 400 Bad Request):**
```json
{
  "message": "Please provide a task title"
}
```

**Reasoning:**
- Uses POST method as we're creating a new resource
- Returns 201 status code following REST conventions for resource creation
- Auto-generates unique ID and sets default status to "pending"
- Validates required fields (title) before creation
- Returns the complete created object so the client knows the assigned ID

---

### 2. Get All Tasks (READ)

**Endpoint:** `GET /api/tasks`

**HTTP Method:** GET

**Purpose:** Retrieves all tasks from the to-do list

**Request Body:** None (GET requests don't have a body)

**Expected Response (Success - 200 OK):**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation for the task manager",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "Review code",
    "description": "Review pull requests from team members",
    "status": "completed"
  }
]
```

**Expected Response (Empty List):**
```json
[]
```

**Reasoning:**
- Uses GET method for retrieving data (idempotent and safe operation)
- Returns array of all tasks, allowing client to display complete list
- Returns empty array if no tasks exist (not an error condition)
- 200 status code indicates successful retrieval

---

### 3. Get a Specific Task (READ)

**Endpoint:** `GET /api/tasks/:id`

**HTTP Method:** GET

**Purpose:** Retrieves a single task by its unique ID

**URL Parameters:**
- `id` (required): The unique identifier of the task

**Example:** `GET /api/tasks/1`

**Request Body:** None

**Expected Response (Success - 200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the task manager",
  "status": "pending"
}
```

**Expected Response (Error - 404 Not Found):**
```json
{
  "message": "Task not found"
}
```

**Reasoning:**
- Uses GET method with URL parameter for specific resource retrieval
- Follows RESTful pattern: `/resource/:id`
- Returns 404 when task doesn't exist (proper HTTP semantics)
- Useful for viewing task details or editing forms

---

### 4. Update a Task (UPDATE)

**Endpoint:** `PUT /api/tasks/:id`

**HTTP Method:** PUT

**Purpose:** Updates an existing task's information

**URL Parameters:**
- `id` (required): The unique identifier of the task to update

**Example:** `PUT /api/tasks/1`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body Format:**
```json
{
  "title": "Complete project documentation - Updated",
  "description": "Write comprehensive API documentation with examples",
  "status": "completed"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Expected Response (Success - 200 OK):**
```json
{
  "id": 1,
  "title": "Complete project documentation - Updated",
  "description": "Write comprehensive API documentation with examples",
  "status": "completed"
}
```

**Expected Response (Error - 404 Not Found):**
```json
{
  "message": "Task not found"
}
```

**Reasoning:**
- Uses PUT method for updating existing resources
- Allows partial updates (only send fields that need changing)
- Returns updated object so client can confirm changes
- Returns 404 if trying to update non-existent task
- Maintains the original ID (IDs should never change)

---

### 5. Delete a Task (DELETE)

**Endpoint:** `DELETE /api/tasks/:id`

**HTTP Method:** DELETE

**Purpose:** Removes a task from the to-do list

**URL Parameters:**
- `id` (required): The unique identifier of the task to delete

**Example:** `DELETE /api/tasks/1`

**Request Body:** None

**Expected Response (Success - 200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Expected Response (Error - 404 Not Found):**
```json
{
  "message": "Task not found"
}
```

**Reasoning:**
- Uses DELETE method for resource removal
- Returns confirmation message on success
- Returns 404 if trying to delete non-existent task
- Idempotent operation (deleting same ID twice returns 404 second time)

---

## How These APIs Fulfill CRUD Operations

### Complete CRUD Coverage

| Operation | HTTP Method | Endpoint | Purpose |
|-----------|-------------|----------|---------|
| **Create** | POST | `/api/tasks` | Add new task to list |
| **Read** | GET | `/api/tasks` | Get all tasks |
| **Read** | GET | `/api/tasks/:id` | Get specific task |
| **Update** | PUT | `/api/tasks/:id` | Modify existing task |
| **Delete** | DELETE | `/api/tasks/:id` | Remove task |

### Workflow Example

1. **User creates a task:** POST request adds "Buy groceries" to the list
2. **User views all tasks:** GET request shows all pending and completed tasks
3. **User views task details:** GET with ID shows full information
4. **User marks task complete:** PUT request updates status to "completed"
5. **User deletes old task:** DELETE request removes completed task

---

## RESTful Design Principles Applied

### 1. Resource-Based URLs
- URLs represent resources (tasks), not actions
- Good: `/api/tasks`
- Bad: `/api/getTasks` or `/api/createTask`

### 2. HTTP Methods Define Actions
- POST = Create
- GET = Read
- PUT = Update
- DELETE = Delete

### 3. Proper Status Codes
- 200: Successful GET, PUT, DELETE
- 201: Successful POST (resource created)
- 400: Bad request (missing required data)
- 404: Resource not found

### 4. Stateless Communication
- Each request contains all necessary information
- Server doesn't store client state between requests

### 5. JSON Data Format
- Standard, widely-supported format
- Easy to parse in any programming language

---

## Potential Implementation Challenges

### 1. Data Persistence
**Challenge:** Current implementation uses in-memory array storage. All data is lost when server restarts.

**Solutions:**
- Implement database integration (MongoDB, PostgreSQL, MySQL)
- Use file-based storage as intermediate solution
- Consider cloud database services for scalability

### 2. ID Management
**Challenge:** Simple incrementing ID counter resets on server restart and doesn't scale in distributed systems.

**Solutions:**
- Use database auto-increment features
- Implement UUID/GUID for globally unique identifiers
- Use timestamp-based IDs

### 3. Data Validation
**Challenge:** Limited validation currently (only checks if title exists).

**Solutions:**
- Implement comprehensive validation library (e.g., Joi, express-validator)
- Validate data types, string lengths, allowed status values
- Sanitize input to prevent injection attacks

### 4. Authentication & Authorization
**Challenge:** No user authentication - anyone can access/modify any task.

**Solutions:**
- Implement JWT-based authentication
- Add user ownership to tasks
- Implement role-based access control (RBAC)

### 5. Error Handling
**Challenge:** Basic error handling; doesn't cover all edge cases.

**Solutions:**
- Implement centralized error handling middleware
- Add logging for debugging
- Provide more descriptive error messages

### 6. Scalability
**Challenge:** In-memory storage doesn't scale across multiple server instances.

**Solutions:**
- Use external database accessible by all instances
- Implement caching layer (Redis)
- Use load balancer for distributing requests

### 7. API Versioning
**Challenge:** No versioning strategy for future API changes.

**Solutions:**
- Add version to URL: `/api/v1/tasks`
- Use header-based versioning
- Maintain backward compatibility

### 8. Rate Limiting
**Challenge:** No protection against abuse or excessive requests.

**Solutions:**
- Implement rate limiting middleware
- Use API keys for tracking usage
- Add request throttling

### 9. Search and Filtering
**Challenge:** Can only get all tasks or one specific task.

**Solutions:**
- Add query parameters: `/api/tasks?status=pending`
- Implement search functionality: `/api/tasks?search=groceries`
- Add pagination for large datasets

### 10. Concurrent Updates
**Challenge:** No handling of simultaneous updates to same task.

**Solutions:**
- Implement optimistic locking with version numbers
- Use database transactions
- Add timestamp-based conflict detection

---

## API Testing Examples

### Using cURL

**Create Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```

**Get All Tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Get Specific Task:**
```bash
curl http://localhost:3000/api/tasks/1
```

**Update Task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

**Delete Task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

## Conclusion

This API design provides a solid foundation for a To-Do List application following RESTful principles. The five endpoints cover all CRUD operations needed for basic task management. While the current implementation is functional for learning and development, production deployment would require addressing the identified challenges, particularly around data persistence, security, and scalability.

The design is extensible and can be enhanced with additional features like user authentication, task categories, due dates, priorities, and collaborative features without breaking existing functionality.
