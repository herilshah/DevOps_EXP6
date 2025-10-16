DevOps_EXP6 - Jenkins + Docker CI/CD Demo (Node.js microservices)
===============================================================

Contents
--------
- user-service/    -> Node.js service on port 5001
- order-service/   -> Node.js service on port 5002
- Jenkinsfile      -> Declarative Jenkins pipeline to build, push, and deploy
- README.md        -> This file

Prerequisites (on your Mac)
---------------------------
1. Node.js & npm installed (you have this)
2. Docker Desktop installed & running
3. Jenkins installed and running (local or remote)
4. Docker Hub account with repos: herilshah/user-service and herilshah/order-service
5. Jenkins credential (username/password) added with ID: dockerhub

Quick local test (without Jenkins)
---------------------------------
# Build and run user service
cd user-service
npm install
node server.js
# open http://localhost:5001

# In another terminal, run order service
cd order-service
npm install
node server.js
# open http://localhost:5002

Using Docker locally (without Jenkins)
-------------------------------------
# From project root - build images
docker build -t herilshah/user-service:local ./user-service
docker build -t herilshah/order-service:local ./order-service

# Run containers
docker run -d --name user-service -p 5001:5001 herilshah/user-service:local
docker run -d --name order-service -p 5002:5002 herilshah/order-service:local

# Test
curl http://localhost:5001/
curl http://localhost:5002/

Run pipeline in Jenkins
-----------------------
1. Create a new Pipeline job (or Multibranch Pipeline) in Jenkins and connect it to this repository.
2. Make sure Jenkins can access Docker (Docker installed on Jenkins machine) and that the Jenkins user has permission to run Docker commands.
3. Add Docker Hub credentials in Jenkins:
   - Manage Jenkins -> Credentials -> Global -> Add Credentials
   - Kind: Username with password
   - ID: dockerhub
   - Username: your Docker Hub username (herilshah)
   - Password: your Docker Hub password or access token
4. Run the pipeline. It will:
   - npm install & test both services
   - Build Docker images herilshah/user-service:latest and herilshah/order-service:latest
   - Login to Docker Hub and push images
   - Stop any existing containers and deploy new ones on the Jenkins host

Notes & Troubleshooting
-----------------------
- If Jenkins cannot run docker commands, consider running Jenkins inside Docker with Docker-in-Docker or give Jenkins user access to Docker socket (careful with security).
- To avoid using Docker Hub in testing, you can modify the Jenkinsfile to skip pushing and use local images.
- Replace repository names in the Jenkinsfile if you change Docker Hub repo names.

If you want, I can also generate a GitHub Actions workflow for EXP 7 next.
