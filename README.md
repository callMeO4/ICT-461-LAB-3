## API Contract

| Method | Route | Body Example | Success Code | Plausible Failures |
|---|---|---|---|---|
| GET | `/api/courses` | None | 200 (OK) | 500 (Internal Server Error - Design Only) |
| GET | `/api/registrations/:id` | None | 200 (OK) | 404 (Not Found), 400 (Bad Request - invalid ID format, Design Only) |
| POST | `/api/registrations` | `{"name":"Pilira","studentId":"20230123","programme":"CS","courses":["ICT-461"]}` | 201 (Created) | 400 (Bad Request - missing fields), 409 (Conflict - duplicate) |
| PUT | `/api/registrations/:id` | `{"name":"Pilira","studentId":"20230123","programme":"IT","courses":["ICT-461"]}` | 200 (OK) | 400 (Bad Request - missing fields), 404 (Not Found) |
| PATCH | `/api/registrations/:id` | `{"programme":"Information Technology"}` | 200 (OK) | 400 (Bad Request - invalid programme), 404 (Not Found) |
| DELETE | `/api/registrations/:id` | None | 204 (No Content) | 404 (Not Found), 403 (Forbidden - Design Only) |

## Concept Explanations

**Idempotency and Status Codes:**
Idempotency concerns the intended server effect, meaning that making multiple identical requests has the same effect on the server's state as making a single request. It does not guarantee identical status codes. For example, a `DELETE` request successfully removes a record and returns `204 No Content`. If you send the exact same `DELETE` request again, the server state remains the same (the record is still gone), but the server will return a `404 Not Found` because the resource no longer exists to be deleted. 

**URL Component Breakdown:**
Example URL: `http://localhost:3000/api/registrations?sort=desc`
*   **Scheme:** `http://`
*   **Host:** `localhost`
*   **Port:** `:3000`
*   **Path:** `/api/registrations`
*   **Query:** `?sort=desc`
*   *Note on Fragments:* A fragment (e.g., `#section-1`) is only used by the browser to navigate within a rendered document. It is never sent to the server in an HTTP request.