# 🚀 Science with Laknath ERP - Cloud MySQL & Multi-User Architecture

A high-performance, responsive **Learning Management System (LMS)** and **Student Academic Progress Tracker** designed for **Science with Laknath** (Led by Mr. Laknath Amarasinghe & Wathisha Amarasinghe).

This repository is configured with a **Universal Dual Database Engine**:
1. **Cloud MySQL Database (Production Ready)**: Supports 100% free cloud MySQL hosting (TiDB Cloud Serverless, Aiven MySQL Free, Clever Cloud, Railway, AWS RDS) with automated connection pooling, table auto-creation, SSL/TLS encryption, and auto-seeding.
2. **Pure JSON Fallback Engine (Zero-Config Development)**: Enables instant local development and offline LAN hosting using local JSON file storage.

---

## 🌟 Key Architecture & Features

- **Multi-Cloud MySQL Engine (`db.js`)**:
  - Connection pooling with automatic reconnection and SSL support.
  - Automatic `CREATE TABLE IF NOT EXISTS` execution upon server boot.
  - Automatic seeding of initial data from JSON storage if tables are empty.
  - Seamless support for complex nested academic progress structures via relational + indexed JSON columns.
- **Role-Based Access Control (RBAC)**:
  - Super Admin, Administrator, Science Teacher, Assistant Teacher, Staff Officer accounts.
  - Per-user fine-grained permissions and session auditing.
- **Comprehensive Academic & Student Analytics**:
  - Weekly progress tracking, monthly assessments, unit test mark analyses, and interactive charts.
  - QR Code student portal access and direct WhatsApp notifications.
- **Multi-Device & Cross-Platform Support**:
  - Desktop / Laptop (Windows, macOS, Linux), Tablet / iPad, and Smartphone responsive viewports.
- **Audit & Security Logging**:
  - Real-time logging of user logins, data syncs, document uploads, and configuration changes with device OS/browser fingerprinting.

---

## 🗄️ Database Schema Overview

The database contains 5 core tables:

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Admin & staff user accounts | `id`, `username`, `password`, `name`, `role`, `permissions`, `status`, `last_login`, `device_sessions` |
| `students` | Student academic profiles, marks & progress | `student_id`, `name`, `username`, `grade_class`, `homeroom_teacher`, `parent_whatsapp`, `raw_data` |
| `erp_config` | Global ERP settings, grading scales, batches & Zoom | `config_key`, `config_data`, `updated_at` |
| `teacher_docs` | Confidential vault teacher documents & syllabi | `id`, `title`, `grade`, `category`, `file_url`, `uploaded_by`, `upload_date` |
| `activity_logs` | Audit trail, security events & device telemetry | `id`, `timestamp`, `username`, `action`, `device_type`, `ip`, `details` |

---

## ☁️ Recommended Free Cloud MySQL Providers

Here are the top reliable **100% Free** Cloud MySQL database services:

| Provider | Free Tier Allowance | SSL/TLS | Best For | Link |
|---|---|---|---|---|
| **TiDB Cloud (Serverless)** | **5 GB Storage**, 50M Request Units/mo, Free Forever | Required (`DB_SSL=true`) | **#1 Recommended** (MySQL 8.0 wire-compatible, high speed) | [tidbcloud.com](https://tidbcloud.com) |
| **Aiven for MySQL** | 1 Node / 1 GB Storage / 1 GB RAM (Free Tier on AWS/GCP) | Required (`DB_SSL=true`) | Managed MySQL cloud instance | [aiven.io](https://aiven.io) |
| **Clever Cloud** | Free Shared MySQL DB (5 MB / 10 MB) | Optional | Lightweight deployments & testing | [clever-cloud.com](https://www.clever-cloud.com) |
| **Alwaysdata** | 100 MB Free Shared MySQL with phpMyAdmin | Supported | Easy phpMyAdmin management | [alwaysdata.com](https://www.alwaysdata.com) |
| **Railway.app** | $5 monthly credit / free trial MySQL container | Supported | Fast 1-click Docker deployment | [railway.app](https://railway.app) |

---

## 🛠️ Step-by-Step Setup Guide: Cloud MySQL Database

### Step 1: Create a Free Cloud MySQL Database (e.g., TiDB Cloud)
1. Sign up at [https://tidbcloud.com](https://tidbcloud.com) (or [https://aiven.io](https://aiven.io)).
2. Click **Create Cluster** and select **Serverless (Free Forever)**.
3. Choose your preferred cloud region (e.g., `AWS / us-east-1` or `Singapore / ap-southeast-1` for low latency to Sri Lanka).
4. Name your cluster `science-lms-cluster` and click **Create**.
5. Once created, click **Connect**:
   - Note down:
     - **Host**: e.g., `gateway01.us-east-1.prod.aws.tidbcloud.com`
     - **Port**: e.g., `4000` (or `3306` for standard MySQL)
     - **User**: e.g., `xxxx.root`
     - **Password**: Generate or set a strong password
     - **Database**: `science_lms_db`

---

### Step 2: Configure Environment Variables

1. Copy the example environment template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your cloud database credentials:
   ```env
   PORT=3000
   NODE_ENV=production
   DB_TYPE=mysql

   # Cloud MySQL Credentials
   DB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
   DB_PORT=4000
   DB_USER=your_db_username.root
   DB_PASSWORD=your_super_secure_password
   DB_NAME=science_lms_db

   # SSL must be enabled for cloud MySQL providers
   DB_SSL=true
   ```

---

### Step 3: Install Dependencies

Install the required Node.js packages (`mysql2` and `dotenv`):
```bash
npm install
```

---

### Step 4: Test Connection & Run Migration

1. Test your database connectivity:
   ```bash
   npm run test:db
   ```
2. Migrate existing JSON data (users, students, documents, configurations, activity logs) into Cloud MySQL:
   ```bash
   npm run migrate
   ```
   *(Note: `server.js` will also automatically initialize tables and auto-seed data on its first run if the tables are empty!)*

---

### Step 5: Start the LMS Server

Start the Node.js server:
```bash
npm start
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Log in to the Admin Portal at [http://localhost:3000/admin_login.html](http://localhost:3000/admin_login.html).

---

## 🌐 Step-by-Step Guide: Free Cloud Server Hosting (Render / Railway)

You can host the Node.js LMS server 24/7 on free cloud app hosting:

### Option A: Hosting on Render.com (Recommended Free Web Service)
1. Push this repository to your **GitHub** account.
2. Sign up at [https://render.com](https://render.com).
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the build and start settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Scroll down to **Environment Variables** and add:
   - `DB_TYPE` = `mysql`
   - `DB_HOST` = `your_cloud_mysql_host`
   - `DB_PORT` = `4000` (or `3306`)
   - `DB_USER` = `your_mysql_user`
   - `DB_PASSWORD` = `your_mysql_password`
   - `DB_NAME` = `science_lms_db`
   - `DB_SSL` = `true`
   - `NODE_ENV` = `production`
7. Click **Deploy Web Service**.
8. Render will provide a free live HTTPS URL (e.g., `https://science-with-laknath-erp.onrender.com`).

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | System health check, active database engine & stats |
| `POST` | `/api/auth/login` | Multi-user authentication & device fingerprinting |
| `GET` | `/api/users` | List all administrator & teacher accounts |
| `POST` | `/api/users` | Create a new user with custom roles & privileges |
| `PUT` | `/api/users/:id` | Update user privileges, profile or password |
| `DELETE` | `/api/users/:id` | Deactivate/remove a user account |
| `GET` | `/api/students` | Get all student academic records |
| `POST` | `/api/students` | Bulk save/synchronize student records |
| `GET` | `/api/students/:id` | Get individual student profile & mark sheet |
| `GET` | `/api/config` | Get master ERP settings & grading scale |
| `POST` | `/api/config` | Update global ERP settings & configuration |
| `GET` | `/api/documents` | Get all teacher vault confidential documents |
| `POST` | `/api/documents` | Upload/add a new teacher document |
| `GET` | `/api/logs` | Fetch real-time multi-device audit logs |
| `GET` | `/api/db/export` | Download full database bundle archive |
| `POST` | `/api/db/import` | Restore full database bundle archive |

---

## 🔐 Default Administrator Logins

| Username | Password | Role | Designation |
|---|---|---|---|
| `laknath` | `password123` | Super Admin | Head Science Specialist & ERP Lead |
| `wathisha` | `admin2026` | Super Admin | Lead Cloud & Systems Architect |
| `admin` | `password123` | Super Admin | Central System Administrator |

---

## 👥 Authors & Maintainers
- **Mr. Laknath Amarasinghe** – B.Sc. (Chemistry Special), Grad.Chem (IChem) | Head Science Educator
- **Wathisha Amarasinghe** – Lead Cloud & Systems Architect
- **Science with Laknath ERP Platform**
