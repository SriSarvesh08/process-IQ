# MERN AI Task Processing Platform

A robust, full-stack application for managing and processing asynchronous AI tasks, built with the MERN stack, a decoupled Python background worker, and deployed using modern GitOps and Kubernetes pipelines.

## 1. Project Overview
This platform allows authenticated users to submit tasks that require heavy simulated AI processing (e.g., Sentiment Analysis, Text Summarization). Instead of blocking the Express server, tasks are offloaded to a background Python worker via MongoDB, ensuring high availability and scalability.

## 2. Features
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.
- **Asynchronous AI Processing**: Python-based background worker that polls and processes pending tasks without freezing the frontend.
- **Real-time UI Updates**: React frontend dynamically polls task status to provide a seamless user experience.
- **Production-Ready Deployment**: Fully containerized with Docker, orchestrated via Kubernetes (k3s), and automated via ArgoCD.
- **Automated CI/CD**: GitHub Actions pipeline for building images and updating deployments.

## 3. Technology Stack
- **Frontend**: React.js, Vite, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose & PyMongo)
- **Background Worker**: Python 3.12
- **DevOps**: Docker, Docker Compose, Kubernetes, ArgoCD, GitHub Actions

## 4. Project Structure
```text
.
├── backend/          # Node.js / Express API
├── frontend/         # React.js SPA
├── worker/           # Python Background Service
├── k8s/              # Kubernetes Manifests
├── argocd/           # ArgoCD GitOps Configuration
└── .github/          # GitHub Actions CI/CD pipeline
```

## 5. Prerequisites
- Node.js (v18+)
- Python (v3.12+)
- Docker & Docker Compose
- Kubernetes Cluster (k3s recommended) & `kubectl`
- ArgoCD installed on the cluster

## 6. Installation
Clone the repository and install the local dependencies:
```bash
git clone <repo-url>
cd MERN
npm install --prefix frontend
npm install --prefix backend
pip install -r worker/requirements.txt
```

## 7. Environment Variables
Create `.env` files based on the `.env.example` templates. Key variables include:
- **Backend**: `MONGO_URI`, `JWT_SECRET`, `PORT`
- **Frontend**: `VITE_API_URL`
- **Worker**: `MONGO_URI`, `POLL_INTERVAL`

## 8. Running Locally
Run the services independently:
```bash
npm run dev --prefix frontend
npm start --prefix backend
python worker/worker.py
```

## 9. Running with Docker
To spin up the entire isolated stack:
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 10. Kubernetes Deployment
Refer to the `DEPLOYMENT_GUIDE.md` for in-depth `kubectl` commands to apply the manifests in the `k8s/` directory.

## 11. ArgoCD Deployment
The platform utilizes ArgoCD for automated GitOps. Point your ArgoCD controller to `argocd/application.yaml`. See `DEPLOYMENT_GUIDE.md` for details.

## 12. CI/CD Workflow
A fully automated GitHub Actions pipeline (`.github/workflows/ci-cd.yml`) builds Docker images on push, updates the Kubernetes manifests, and pushes them back to Git for ArgoCD to sync.

## 13. API Overview
- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate and retrieve JWT
- `GET /api/tasks` - List authenticated user's tasks
- `POST /api/tasks` - Submit a new AI task
Full details in `API_DOCUMENTATION.md`.

## 14. Screenshots Placeholder
*(Add your application screenshots here)*

## 15. Future Enhancements
- Replace polling with WebSockets for real-time frontend updates.
- Integrate actual LLM APIs (OpenAI, Gemini) into the Python worker.
- Migrate from MongoDB polling to a dedicated message broker like Redis/RabbitMQ.
