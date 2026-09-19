const express = require('express');
const app = express();
const PORT = 3000;

// Middleware for parsing application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
const courses = [
    { code: 'ICT-461', name: 'Web Systems and Technology' },
    { code: 'ICT-481', name: 'Software Engineering' },
    { code: 'ICS-441', name: 'Compiler Design' },
    { code: 'ICT-411', name: 'Network Security' }
];

let registrations = [];
let nextId = 1;

// 1. GET /api/courses: Return assigned courses as JSON with 200
app.get('/api/courses', (req, res) => {
    res.status(200).json(courses);
});

// 2. GET /api/registrations/:id: Return one record with 200; unknown ID with 404
app.get('/api/registrations/:id', (req, res) => {
    const record = registrations.find(r => r.id === parseInt(req.params.id));
    if (!record) return res.status(404).json({ error: 'Registration not found' });
    res.status(200).json(record);
});

// 3. POST /api/registrations: Create with 201 and Location; invalid data 400; duplicate 409
app.post('/api/registrations', (req, res) => {
    const { name, studentId, programme, courses: requestedCourses } = req.body;

    // Validate required fields
    if (!name || !studentId || !programme || !Array.isArray(requestedCourses) || requestedCourses.length === 0) {
        return res.status(400).json({ error: 'Invalid data. All fields are required.' });
    }

    // Check for duplicate student ID + course combination
    const isDuplicate = registrations.some(reg =>
        reg.studentId === studentId &&
        reg.courses.some(c => requestedCourses.includes(c))
    );

    if (isDuplicate) {
        return res.status(409).json({ error: 'Duplicate registration: Student is already registered for one or more of these courses.' });
    }

    const newRecord = { id: nextId++, name, studentId, programme, courses: requestedCourses };
    registrations.push(newRecord);

    res.status(201).location(`/api/registrations/${newRecord.id}`).json(newRecord);
});

// 4. PUT /api/registrations/:id: Replace full record with 200; validate every required field
app.put('/api/registrations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, studentId, programme, courses: requestedCourses } = req.body;
    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) return res.status(404).json({ error: 'Registration not found' });

    if (!name || !studentId || !programme || !Array.isArray(requestedCourses) || requestedCourses.length === 0) {
        return res.status(400).json({ error: 'Invalid data. PUT requires complete record replacement.' });
    }

    registrations[index] = { id, name, studentId, programme, courses: requestedCourses };
    res.status(200).json(registrations[index]);
});

// 5. PATCH /api/registrations/:id: Change programme only with 200; reject invalid values
app.patch('/api/registrations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { programme } = req.body;
    const record = registrations.find(r => r.id === id);

    if (!record) return res.status(404).json({ error: 'Registration not found' });
    if (!programme || typeof programme !== 'string' || programme.trim() === '') {
        return res.status(400).json({ error: 'Invalid data. Only programme updates are allowed via PATCH and must be a valid string.' });
    }

    record.programme = programme;
    res.status(200).json(record);
});

// 6. DELETE /api/registrations/:id: Remove with 204 and no body; unknown ID with 404
app.delete('/api/registrations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) return res.status(404).json({ error: 'Registration not found' });

    registrations.splice(index, 1);
    res.status(204).send(); // 204 No Content
});

// Diagnostic Route
app.all('/inspect', (req, res) => {
    res.json({
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body // Express parsers will populate this based on Content-Type
    });
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});