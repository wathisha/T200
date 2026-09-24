# 🚀 Independent Collective School (ICS) ERP & LMS - TiDB Cloud Architecture

A high-performance, responsive **Learning Management System (LMS)** and **Student Academic Progress Tracker** designed for **Sathsarani Science Academy** (Led by Mrs. Sheshadi Amarasinghe & Wathisha Amarasinghe).

This repository is optimized and configured for **TiDB Cloud Serverless** (`ics-school-cluster`), providing high availability, auto-scaling, and full MySQL 8.0 wire compatibility, alongside a local JSON fallback engine for offline development.

---

## 🌟 TiDB Cloud Integration Highlights (`ics-school-cluster`)

- **Cluster Name**: `ics-school-cluster`
- **Region**: AWS Singapore (`ap-southeast-1`) / Low latency across South Asia & Asia-Pacific
- **Public Gateway Host**: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
- **Port**: `4000` (Standard TiDB Cloud MySQL protocol port)
- **Security & Encryption**: Mandatory TLS v1.2 (`DB_SSL=true`)
- **Auto-Provisioning**:
  - Automatically initializes `ics_school_db` if not yet present on cluster.
  - Automatically creates tables with indexes (`users`, `students`, `erp_config`, `teacher_docs`, `activity_logs`).
  - Automatically seeds production data from local JSON backups on first boot.
- **Failover & Resilience**: Automatically falls back to local JSON storage if the cloud database is temporarily unreachable.

---

## 🗄️ Database Schema Overview

The database contains 5 core tables:

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Admin, Teacher & Staff accounts with RBAC | `id`, `username`, `password`, `name`, `role`, `permissions`, `status`, `last_login`, `device_sessions` |
| `students` | Academic profiles, weekly/monthly marks & progress | `student_id`, `name`, `username`, `grade_class`, `homeroom_teacher`, `parent_whatsapp`, `raw_data` |
| `erp_config` | Global ERP settings, grading scales, batches & Zoom links | `config_key`, `config_data`, `updated_at` |
| `teacher_docs` | Confidential vault teacher documents & syllabi | `id`, `title`, `grade`, `category`, `file_url`, `uploaded_by`, `upload_date` |
| `activity_logs` | Real-time audit trail, security events & device telemetry | `id`, `timestamp`, `username`, `action`, `device_type`, `ip`, `details` |

---

## ⚙️ Environment Variables Configuration (`.env`)

The project comes pre-configured for your TiDB Cloud cluster in `.env`:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# Database Engine Selection ('mysql' for TiDB Cloud, 'json' for Local JSON)
DB_TYPE=mysql

# TiDB Cloud Serverless Cluster Settings (ics-school-cluster)
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=287vGtA52xzWe45.root
DB_PASSWORD=Jw4G8J9vbkYFOBI3
DB_NAME=ics_school_db

# TLS / SSL Settings (Required for TiDB Cloud public endpoint)
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Optional: Path to custom CA certificate if downloaded
# CA_PATH=./isrgrootx1.pem

# Connection Pool Settings
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
DB_WAIT_FOR_CONNECTIONS=true

# Alternative Direct Connection URI String
MYSQL_URI=mysql://287vGtA52xzWe45.root:Jw4G8J9vbkYFOBI3@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/ics_school_db?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":false}

JWT_SECRET=ics_school_cluster_jwt_secret_2026
```

---

## 🛠️ Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify TiDB Cloud Connection
Test connection and verify round-trip latency to `ics-school-cluster`:
```bash
npm run test:db
```

### 3. Migrate Local Data to TiDB Cloud
Populate your TiDB Cloud cluster with existing student records, user accounts, and configurations:
```bash
npm run migrate
```
*(Note: `server.js` will also automatically create tables and seed data upon first boot if tables are empty.)*

### 4. Start the Application Server
```bash
npm start
```
- Student Portal: [http://localhost:3000](http://localhost:3000)
- Teacher / Admin Portal: [http://localhost:3000/admin_login.html](http://localhost:3000/admin_login.html)
- Direct Admin Console: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## ☁️ Production Deployment (Render / Railway / Cloud)

When deploying to **Render.com** or **Railway**:
1. Add the environment variables listed in `.env` to your cloud dashboard.
2. Ensure TiDB Cloud IP Access List (Security Settings) allows `0.0.0.0/0` (public access).
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`

---

## 🔐 Default Administrator Logins

| Username | Password | Role | Designation |
|---|---|---|---|
| `sheshadi` | `password123` | Super Admin | Head Science Specialist |
| `wathisha` | `admin2026` | Super Admin | Lead Cloud & Systems Architect |
| `admin` | `password123` | Super Admin | Central System Administrator |

---

## 👥 Authors & Maintainers
- **Mrs. Sheshadi Amarasinghe** – B.Sc. (Chemistry Special), Grad.Chem (IChem) | Head Science Educator
- **Wathisha Amarasinghe** – Lead Cloud & Systems Architect
- **Sathsarani Science Academy LMS Platform**
