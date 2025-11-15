# 📘 Project README

## 🚀 Overview

This repository contains a **full‑stack AI-powered document search system** built using **React**, **Node.js/Express**, **Meilisearch**, and **Docker Compose**. Users can upload files, index them, preview them (PDF, images, audio, video, text), search through extracted text, and filter by **company, team, and project**.

This README is written professionally for your GitHub repository.

---

# 🧩 Tech Stack

## **Frontend**

* React + Vite
* Axios
* TailwindCSS

## **Backend**

* Node.js + Express.js
* Multer (multi‑file upload)
* Custom file parser + metadata extractor
* Meilisearch (⚡ ultra-fast search engine)

## **Infrastructure**

* **Docker Compose** (orchestration)
* Node backend + Meilisearch container
* Local folder volume mounted for persistent search index

---

# 📂 Project Structure

```
project/
│── backend/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── upload/         ← uploaded files
│   ├── indexer.js
│   └── server.js
│
│── frontend/
│   ├── src/components/
│   ├── src/pages/
│   └── vite.config.js
│
│── docker-compose.yml
│── README.md
```

---

# 🐳 Docker Compose Setup (Full Project)

Below is the **complete docker-compose.yml** that starts your backend + Meilisearch + optional frontend.

```yamlersion: "3.9"
services:
  meilisearch:
    image: getmeili/meilisearch:latest
    container_name: meili
    environment:
      MEILI_MASTER_KEY: "MASTER_KEY_123"
    ports:
      - "7700:7700"
    volumes:
      - ./meili_data:/meili_data

  backend:
    build: ./backend
    container_name: backend
    environment:
      PORT: 5000
      MEILI_URL: http://meilisearch:7700
      MEILI_MASTER_KEY: MASTER_KEY_123
    ports:
      - "5000:5000"
    depends_on:
      - meilisearch
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
```

### ▶ Start the whole project

```sh
docker compose up --build
```

### Services will run on:

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:5000](http://localhost:5000)
* **Meilisearch Dashboard:** [http://localhost:7700](http://localhost:7700)

---

# ⚙ Backend Setup (Without Docker)

### Install dependencies

```sh
cd backend
npm install
```

### Create `.env`

```
PORT=5000
MEILI_URL=http://127.0.0.1:7700
MEILI_MASTER_KEY=MASTER_KEY_123
UPLOAD_DIR=./uploads
```

### Start server

```sh
npm start
```

---

# 🌐 Frontend Setup (Without Docker)

```sh
cd frontend
npm install
npm run dev
```

---

# 🧠 Architecture & Workflow

## 1️⃣ Upload → Parse → Index (Backend Flow)

1. User uploads files via React app
2. Backend saves them in `/uploads`
3. Extracts:

   * Title
   * File type
   * Company / team / project
   * Text content (PDF/text extraction)
4. Sends structured document to **Meilisearch index**
5. Meilisearch updates autocomplete + filters automatically

---

# 🔍 Search API (Backend → Meilisearch)

### `GET /search`

Query params:

| Name    | Type   | Description      |
| ------- | ------ | ---------------- |
| q       | string | Search keyword   |
| company | string | Filter           |
| team    | string | Filter           |
| project | string | Filter           |
| limit   | number | Pagination limit |
| offset  | number | Starting index   |

Example:

```
/search?q=glass&company=SAI&team=frontend&limit=10&offset=20
```

---

# 📦 File Upload API

### `POST /upload/bulk`

**FormData fields:**

* files[]
* company
* team
* project

Backend:

* saves files
* extracts metadata
* indexes into Meilisearch

---

# 🎛 Frontend Features

### **1. Dropdown Filters (company, team, project)**

* Fetched dynamically from backend `/meta`
* No hardcoded values

### **2. Pagination (10 per page)**

```
offset = page * limit
limit = 10
```

### **3. Live Preview (Modal)**

Supports:

* Images
* Videos
* Audio
* PDF (inline preview)
* Text content

### **4. Delete Document**

* Removes item from Meilisearch
* UI updates instantly

---

# 🧹 Key Decisions

### ⭐ 1. Use Meilisearch Instead of Mongo/SQL

* Ultra-fast full-text search
* Built‑in pagination, ranking, faceting

### ⭐ 2. Docker Compose for Full Production Setup

* One command deployment
* Persistent Meili index via volumes

### ⭐ 3. Dynamic Filters

* Based on indexed data, always up to date

### ⭐ 4. Clean Separation

* Backend = upload, parse, index
* Meilisearch = search engine
* Frontend = UI & UX

---

# 🧪 Testing

* Postman for API tests
* Browser DevTools for React + Network
* Meilisearch Dashboard for index inspection

---

# 📄 License

MIT License

---

# 🤝 Contributing

Open PRs, issues, enhancements.

---

# 📬 Contact

**Developer:** Niten Kumawat

If you want, I can also:

* Add a **backend folder README**
* Add **API docs** (Swagger)
* Add **ER diagram**
* Add **system architecture diagram**
* Add production deployment guide (NGINX + PM2 + Docker)
