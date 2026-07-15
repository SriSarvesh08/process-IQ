# Architecture Documentation

## High-Level Architecture

The platform follows a decoupled, microservice-inspired architecture designed to prevent expensive, long-running AI tasks from blocking the primary API server.

```mermaid
graph TD
    User([User]) --> React[React Frontend]
    React -->|HTTP / API| Express[Express Backend]
    Express <-->|Mongoose| MongoDB[(MongoDB)]
    Python[Python Worker] <-->|PyMongo Polling| MongoDB
```

## Complete Request Flow

1. **User** submits a new Task via the Web Dashboard.
2. **React** sends a POST request to the Express API.
3. **Express API** validates the input and saves the Task to **MongoDB** with a `status: "Pending"`.
4. **Python Worker** continuously polls **MongoDB** and detects the "Pending" task.
5. The Worker updates the status to `Processing` and runs the heavy CPU operation.
6. The Worker saves the mock AI result back to **MongoDB** with `status: "Completed"`.
7. **Frontend Polling** detects the database change and updates the UI for the User dynamically.

## Component Breakdown

### Frontend (React)
- **Role**: SPA handling UI state and routing.
- **Mechanisms**: Uses JWTs for protected routes. Implements aggressive `setInterval` polling on the Task details page to check for background completion.

### Backend (Express)
- **Role**: RESTful API Gateway.
- **Mechanisms**: Handles authentication (bcrypt/JWT), data validation, and basic CRUD operations. It acts purely as a data-entry point and does not execute any AI logic itself.

### MongoDB
- **Role**: Primary data store and ad-hoc message queue.
- **Mechanisms**: Stores Users and Tasks. Used as the synchronization layer between the Node.js backend and Python worker.

### Python Worker
- **Role**: Background task processor.
- **Mechanisms**: Runs an infinite loop isolated from the web server. Features a robust `try-except` block to prevent service crashes during faulty task processing.

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    
    Client->>API: POST /api/auth/login (email, password)
    API->>DB: Find User by Email
    DB-->>API: Return User Hash
    API->>API: Bcrypt Compare
    API-->>Client: Return JWT Token
    Client->>API: GET /api/tasks (Bearer Token)
    API-->>Client: Authorized Data
```

## Task Processing Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant MongoDB
    participant Worker

    Frontend->>Backend: POST /api/tasks (operation, input)
    Backend->>MongoDB: Insert {status: 'Pending'}
    Backend-->>Frontend: 201 Created
    
    loop Every 3 seconds
        Frontend->>Backend: GET /api/tasks/:id
        Backend->>MongoDB: Fetch Task
        Backend-->>Frontend: Return {status: 'Pending'}
    end

    loop Every 3 seconds
        Worker->>MongoDB: FindOneAndUpdate {status: 'Pending'}
    end
    
    Worker->>MongoDB: Update {status: 'Processing'}
    Worker->>Worker: Run Heavy AI Task
    Worker->>MongoDB: Update {status: 'Completed', result: data}
    
    Frontend->>Backend: GET /api/tasks/:id
    Backend-->>Frontend: Return {status: 'Completed', result: data}
```

## Deployment Architecture

### Docker
The application is containerized into four distinct services: `frontend`, `backend`, `worker`, and `mongodb`. A `docker-compose.yml` links them via a custom bridge network and ensures data persistence via volumes.

```mermaid
graph TD
    subgraph Docker Network
        F[Frontend Container]
        B[Backend Container]
        W[Worker Container]
        DB[(MongoDB Container + Volume)]
    end
    F --> B
    B --> DB
    W --> DB
```

### Kubernetes (k3s)
Translates the Docker Compose setup into robust orchestrations:
- `Deployments`: Handles replica scaling (e.g., 2 Backend replicas) and self-healing.
- `Services`: `LoadBalancer` for Frontend, `NodePort`/`ClusterIP` for Backend and DB.
- `ConfigMaps & Secrets`: Environment variable injection.

```mermaid
graph TD
    subgraph Kubernetes Cluster (Namespace: shoppilot)
        Ingress/LB --> SVC_F[Frontend Service]
        SVC_F --> Pod_F[Frontend Pods]
        
        Pod_F --> SVC_B[Backend Service]
        SVC_B --> Pod_B[Backend Pods]
        
        Pod_B --> SVC_DB[MongoDB Service]
        Pod_W[Worker Pod] --> SVC_DB
        SVC_DB --> Pod_DB[(MongoDB Pod + PVC)]
    end
```

### GitOps Workflow (ArgoCD & GitHub Actions)

The deployment lifecycle is entirely automated using the principles of GitOps.

```mermaid
graph LR
    Dev[Developer Push] --> GHA[GitHub Actions]
    GHA -->|1. Build & Push| Hub[(Docker Hub)]
    GHA -->|2. Update image tags| Git[(Git Repo main)]
    Argo[ArgoCD in K8s] -->|3. Syncs automatically| Git
    Argo -->|4. Deploys to| K8s[Kubernetes Cluster]
```
