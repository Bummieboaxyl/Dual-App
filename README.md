

## 🚀 Dual-App Deployment Project (Flask + Node.js with Postgres)

This project demonstrates the automated deployment of a dual-application stack consisting of a **Flask app (Python)** and a **Node.js app**, both backed by a **Postgres database**. The infrastructure and deployments are fully managed using **Ansible** and orchestrated through a **Jenkins CI/CD pipeline**.

---

### 📂 Project Structure

```plaintext
DUAL-APP/
├── ansible/              
│   ├── flask/           
│   ├── nodejs/         
│   ├── postgres/         
│   ├── inventory         
│   ├── playbook.yml     
│   └── vault.yml         
│
├── db/
│   └── init.sql          
│
├── flask-app/            
│   ├── templates/        
│   │   └── index.html
│   ├── app.py            
│   ├── requirements.txt  
│   └── wsgi.py           
│
├── node-app/             
│   ├── index.js          
│   └── package.json      
│
├── .gitignore
├── Jenkinsfile          
└── README.md
````

---

### ⚡ Features

* **Dual application stack**: Flask (Python) + Node.js.
* **Centralized database**: Postgres with schema initialized from `init.sql`.
* **Automated deployments** using Ansible roles.
* **Secrets management** with Ansible Vault.
* **Production-ready setup** using Gunicorn for Flask.
* **Continuous Integration / Delivery** with Jenkins pipeline.

---

### 🛠️ Tools & Technologies

* **Flask** (Python web framework)
* **Node.js** (JavaScript runtime)
* **Postgres** (Relational database)
* **Ansible** (Infrastructure automation)
* **Jenkins** (CI/CD pipeline)
* **Gunicorn** (WSGI server for Flask)
* **Git/GitHub** (Version control)

---

### 🔄 Project Workflow

1. **Code Development**

   * Flask app (`flask-app/`) and Node app (`node-app/`) developed separately.
   * Postgres schema created in `db/init.sql`.

2. **CI/CD Pipeline (Jenkins)**

   * Triggers on code push.
   * Executes the Ansible playbook (`ansible/playbook.yml`).
   * Handles deployments with proper credentials and private keys.

3. **Deployment (Ansible)**

   * **Postgres role**:

     * Installs PostgreSQL.
     * Creates database & user.
     * Executes `init.sql` to initialize schema.
   * **Flask role**:

     * Installs Python & dependencies (`requirements.txt`).
     * Deploys app.
     * Configures Gunicorn + systemd service.
   * **Node.js role**:

     * Installs Node.js & dependencies (`package.json`).
     * Deploys app.
     * Configures systemd service.

4. **Access Applications**

   * Flask app served via **Gunicorn** and exposed on port `5000`.
   * Node.js app exposed on port `3000`.

---

### 📡 Application Access URLs

* Flask App → `http://<server-public-ip>:5000`
* Node.js App → `http://<server-public-ip>:3000`


---

#### 👨‍💻 Author

This project was designed and implemented as a demonstration of **end-to-end DevOps automation** using a dual-app stack with shared resources.


