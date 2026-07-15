# API Documentation

All API requests mapping to protected routes require a valid JWT token in the `Authorization` header.

Format: `Authorization: Bearer <your_token_here>`

---

## Authentication

### 1. Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Authentication Required**: No

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created)**:
```json
{
  "message": "User registered successfully"
}
```

**Error Responses**:
- `400 Bad Request`: "Please provide all required fields"
- `400 Bad Request`: "User already exists"

### 2. Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Authentication Required**: No

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "60d5ecb8b392d70015332f11",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: "Invalid credentials"

### 3. Get Profile
- **Method**: `GET`
- **URL**: `/api/auth/profile`
- **Authentication Required**: Yes

**Response (200 OK)**:
```json
{
  "_id": "60d5ecb8b392d70015332f11",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

---

## Tasks

### 1. Create Task
- **Method**: `POST`
- **URL**: `/api/tasks`
- **Authentication Required**: Yes

**Request Body**:
```json
{
  "title": "Analyze feedback",
  "description": "Analyze the customer feedback",
  "operation": "Sentiment Analysis",
  "inputData": "I absolutely love this new product, it is amazing!"
}
```

**Response (201 Created)**:
```json
{
  "_id": "60d5eccab392d70015332f12",
  "title": "Analyze feedback",
  "operation": "Sentiment Analysis",
  "status": "Pending",
  "createdBy": "60d5ecb8b392d70015332f11"
}
```

### 2. Get All Tasks
- **Method**: `GET`
- **URL**: `/api/tasks`
- **Authentication Required**: Yes

**Response (200 OK)**:
```json
[
  {
    "_id": "60d5eccab392d70015332f12",
    "title": "Analyze feedback",
    "status": "Completed",
    "operation": "Sentiment Analysis"
  }
]
```

### 3. Get Task by ID
- **Method**: `GET`
- **URL**: `/api/tasks/:id`
- **Authentication Required**: Yes

**Response (200 OK)**:
```json
{
  "_id": "60d5eccab392d70015332f12",
  "title": "Analyze feedback",
  "operation": "Sentiment Analysis",
  "status": "Completed",
  "result": "Positive",
  "inputData": "I absolutely love this new product, it is amazing!"
}
```

**Error Responses**:
- `404 Not Found`: "Task not found"

### 4. Update Task
- **Method**: `PUT`
- **URL**: `/api/tasks/:id`
- **Authentication Required**: Yes

**Request Body**:
```json
{
  "title": "Updated title"
}
```

**Response (200 OK)**:
```json
{
  "title": "Updated title",
  "status": "Pending"
}
```

### 5. Delete Task
- **Method**: `DELETE`
- **URL**: `/api/tasks/:id`
- **Authentication Required**: Yes

**Response (200 OK)**:
```json
{
  "message": "Task removed"
}
```
