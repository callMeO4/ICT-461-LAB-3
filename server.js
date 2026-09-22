const express = require('express');
const cors = require('cors'); // 1. Import CORS
const app = express();
const PORT = 3000;

// 2. Add CORS Middleware (Task 3.2)
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'If-None-Match']
}));

// Express Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
const courses = [
    { code: 'ICT-461', name: 'Web Systems and Technology' },
    { code: 'ICT-481', name: 'Software Project Management' },
    { code: 'ICT-411', name: 'Advanced Cybersecurity and Ethical Hacking' },
    { code: 'ICT-372', name: 'Advanced Database Systems' }
];

let registrations = [];
let nextId = 1;

app.get('/api/courses', (req, res) => {
    const dataString = JSON.stringify(courses);
    const currentETag = `W/"${Buffer.from(dataString).toString('base64').substring(0, 15)}"`;

    if (req.headers['if-none-match'] === currentETag) {
        return res.status(304).end();
    }

    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('ETag', currentETag);
    res.status(200).json(courses);
});

app.post('/api/registrations', (req, res) => {
    const { name, studentId, programme, courses: requestedCourses } = req.body;

    if (!name || !studentId || !programme || !Array.isArray(requestedCourses) || requestedCourses.length === 0) {
        return res.status(400).json({ error: 'Invalid data. All fields are required.' });
    }

    const isDuplicate = registrations.some(reg =>
        reg.studentId === studentId && reg.courses.some(c => requestedCourses.includes(c))
    );

    if (isDuplicate) {
        return res.status(409).json({ error: 'Duplicate registration detected.' });
    }

    const newRecord = { id: nextId++, name, studentId, programme, courses: requestedCourses };
    registrations.push(newRecord);

    res.setHeader('Cache-Control', 'no-store');
    res.status(201).location(`/api/registrations/${newRecord.id}`).json(newRecord);
});

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

app.patch('/api/registrations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { programme } = req.body;
    const record = registrations.find(r => r.id === id);

    if (!record) return res.status(404).json({ error: 'Registration not found' });
    if (!programme || typeof programme !== 'string' || programme.trim() === '') {
        return res.status(400).json({ error: 'Invalid data. Only programme updates are allowed via PATCH.' });
    }

    record.programme = programme;
    res.status(200).json(record);
});

app.delete('/api/registrations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) return res.status(404).json({ error: 'Registration not found' });

    registrations.splice(index, 1);
    res.status(204).send();
});

app.all('/inspect', (req, res) => {
    res.json({
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body
    });
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
// Final API review