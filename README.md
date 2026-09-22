# Mulungushi University - Course Registration Portal (ICT461 Lab)

**Course:** ICT461 - Web Standards and HTTP Fundamentals
**Date:** September 22, 2026

---

## 🚀 Run Instructions

This project requires Node.js. The architecture is decoupled into a frontend client and a backend API.

1. **Install Dependencies:**
   Navigate to the project root directory in your terminal and run:
   `npm install`

2. **Start the API Server (Backend):**
   Run the following command to start the Express server on port 3000:
   `node server.js`

3. **Start the Interface (Frontend):**
   Serve the `index.html` file using a local web server (such as the VS Code Live Server extension) on port 5500. 
   Navigate to `http://127.0.0.1:5500` in your browser.

---

## 📝 API Contract

| Method | Route | Body Payload (Example) | Success Code | Plausible Failures |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/courses` | None | `200 OK` | `500 Internal Server Error` (Design) |
| **GET** | `/api/registrations/:id` | None | `200 OK` | `404 Not Found`, `400 Bad Request` |
| **POST** | `/api/registrations` | `{"name":"Pilira","studentId":"123","programme":"CS","courses":["ICT-461"]}` | `201 Created` | `400 Bad Request` (Missing fields), `409 Conflict` (Duplicate) |
| **PUT** | `/api/registrations/:id` | `{"name":"Pilira","studentId":"123","programme":"IT","courses":["ICT-461"]}` | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **PATCH** | `/api/registrations/:id`| `{"programme":"Software Engineering"}` | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/registrations/:id` | None | `204 No Content` | `404 Not Found`, `403 Forbidden` (Design) |

---

## 🧠 Decision Note & Concept Explanations

**Architecture:** We strictly decoupled the client and server. The client relies on semantic HTML and vanilla JS with CSS Grid for responsiveness. The server relies on Express for JSON parsing and in-memory storage to satisfy lab constraints without a database. CORS was implemented specifically for `http://127.0.0.1:5500` to secure cross-origin requests.

**Idempotency vs Status Codes:** Idempotency dictates that executing a request multiple times has the exact same net effect on the server's state as executing it once. A `DELETE` request successfully removes a resource (`204`). Repeating it changes nothing further, resulting in a `404`. The ultimate state (resource gone) is identical.

**Accept vs Content-Type:** `Content-Type` describes the format of the data being sent in the request body (e.g., `application/json`). `Accept` indicates what data format the client hopes to receive back.

**Freshness vs Revalidation:** Cache freshness (`max-age=60`) allows the browser to serve stored data without contacting the server, saving bandwidth. Revalidation (`If-None-Match`) occurs once data goes stale; the client sends an ETag to ask if data has been modified, receiving a `304 Not Modified` if unchanged.

**Browser vs cURL CORS:** Web browsers enforce CORS policies to protect users against unauthorized cross-site execution, blocking requests without explicit server permission. cURL is a raw network tool that does not run user scripts or enforce web security policies, executing HTTP requests unconditionally.

---

## 📸 Evidence & Verification

*Replace the bracketed text below with the actual paths to your screenshot files.*

**Task 1: Responsive Layouts**
*   ![Mobile Layout 360px]
*   <img width="474" height="925" alt="image" src="https://github.com/user-attachments/assets/afed17c5-4f16-4ebc-8468-13f561928e41" />

*   ![Desktop Layout 1366px](
*   <img width="1912" height="1078" alt="image" src="https://github.com/user-attachments/assets/1fb60781-6f63-42c7-ab87-4e678aff6632" />


**Task 2: API Validation & Contract**
*   ![Successful POST 201]
*   <img width="1329" height="579" alt="260920_10h44m12s_screenshot" src="https://github.com/user-attachments/assets/eeb5fd01-fa52-4426-8de3-495a5e287b0c" />

*   ![Invalid POST 400]
*   <img width="1192" height="441" alt="260920_10h54m31s_screenshot" src="https://github.com/user-attachments/assets/b4ee6b8b-bb89-48d6-a946-f4014980447e" />

*   ![Duplicate POST 409]
*   <img width="1036" height="474" alt="image" src="https://github.com/user-attachments/assets/56a865e2-217c-4151-a055-6bd24f04b6a9" />

*   ![Diagnostic Inspect Form vs JSON]
*   <img width="1320" height="501" alt="260920_10h22m18s_screenshot" src="https://github.com/user-attachments/assets/e88d26e0-e836-4d68-9b04-05c9152e4ffe" />


**Task 3: Browser Boundaries**
*   ![Blocked CORS Preflight (OPTIONS)]
*   <img width="1023" height="576" alt="image" src="https://github.com/user-attachments/assets/152a15ad-d556-4c38-b26b-8928fe671d19" />


**Task 4: Branches**
Createded new branch as seen from commit history
---

## 🌿 Git Workflow & AI Use

**Git Workflow:**
Development was managed via Git. We tracked the API requirements using an issue, created a `feature/api-development` branch, and retained over four meaningful iterative commits covering route creation, validation logic, caching, and CORS implementation. Code was peer-reviewed locally before merging into `main`.

**AI-Use.md:**
AI was utilized as a syntactical reference and diagnostic assistant during this lab (e.g., debugging the Node.js crash caused by a stray character and structuring the Express CORS middleware). All architectural decisions, HTML semantics, and server validations reflect our own understanding of the HTTP standards.

---

## 👤 Individual Reflections

### Pirila Banda-  202301821
I primarily focused on the backend API development using Express and implemented the CORS middleware to successfully connect the decoupled frontend and backend systems. During testing, I made a mistake with ETag revalidation in Task 3; I mistakenly passed the literal placeholder string `"YOUR_COPIED_ETAG"` in the cURL header instead of the actual generated hash. This caused the server to continuously return a `200 OK` payload instead of the expected `304 Not Modified`. I fixed this by correcting the header syntax in my terminal command, explicitly escaping the quotes around the actual dynamic ETag value (`W/\"...\"`). I verified the fix by re-running the cURL command and successfully capturing the `304` status with an empty body.

### Adrian Ngulube - 202306966
[Insert 100-word reflection here: Contribution, one mistake, and how it was verified/fixed.]

### Michelo  Harry Moonga -  202110843
[Insert 100-word reflection here: Contribution, one mistake, and how it was verified/fixed.]

### Siabonga Phiri - 202302370
[Insert 100-word reflection here: Contribution, one mistake, and how it was verified/fixed.]

### Shammah Musukwa - 202305900
[Insert 100-word reflection here: Contribution, one mistake, and how it was verified/fixed.]

### Chilando Gift - 202304589
[Insert 100-word reflection here: Contribution, one mistake, and how it was verified/fixed.]
