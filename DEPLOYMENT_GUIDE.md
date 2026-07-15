# Deployment Guide

This guide details the various ways to build, run, and deploy the MERN AI Task Processing Platform.

---

## 1. Local Setup (Development)

Run the services natively on your machine.

1. **Start MongoDB**: Ensure you have a local MongoDB instance running on port 27017.
2. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. **Start Worker**:
   ```bash
   cd worker
   pip install -r requirements.txt
   python worker.py
   ```
4. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 2. Docker Setup

### Docker Compose
To run the entire suite in isolated containers via the bridged `mern_network`:
```bash
docker compose up --build -d
```
- **Verification**: `docker ps` should show 4 running containers (mongodb, backend, worker, frontend).
- **Teardown**: `docker compose down`

---

## 3. Kubernetes Deployment

The application includes production-ready manifests in the `k8s/` folder.

### Setup
Apply the configuration files in order:
```bash
# 1. Namespaces and Configs
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 2. Database
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-service.yaml
kubectl apply -f k8s/mongodb-deployment.yaml

# Wait for DB to be Ready
kubectl get pods -n shoppilot -w

# 3. Application
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/worker-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Verification Commands
```bash
kubectl get deployments -n shoppilot
kubectl get svc -n shoppilot
kubectl get pods -n shoppilot
```

---

## 4. ArgoCD Setup

Automate the Kubernetes deployment via GitOps.

1. **Install ArgoCD**:
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```
2. **Apply Application Manifest**:
   Update `repoURL` in `argocd/application.yaml`, then:
   ```bash
   kubectl apply -f argocd/application.yaml
   ```
3. **Verify Sync**:
   ```bash
   kubectl get applications -n argocd
   argocd app sync mern-shoppilot
   ```

---

## 5. GitHub Actions (CI/CD)

The pipeline is defined in `.github/workflows/ci-cd.yml`.

### Configuration
Configure the following Repository Secrets in GitHub:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `DOCKER_REPOSITORY`
- `MONGO_URI`
- `JWT_SECRET`

### Triggering
- Commits pushed to `main` automatically trigger a build-and-deploy cycle.
- Manual triggers are available in the GitHub Actions UI via `workflow_dispatch`.

---

## Troubleshooting

- **Containers crashing immediately?** Check environment variables (specifically `MONGO_URI` format).
- **Kubernetes Pods in CrashLoopBackOff?** 
  ```bash
  kubectl describe pod <pod-name> -n shoppilot
  kubectl logs <pod-name> -n shoppilot
  ```
- **ArgoCD Not Syncing?** Check the ArgoCD UI dashboard for syntax errors in your YAML files, or ensure your `repoURL` is public or appropriately authenticated.
