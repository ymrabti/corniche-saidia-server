const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const { createServer } = require('http');
const cors = require('cors');
const { NOT_FOUND } = require('http-status');
const fs = require('fs');
const { resolve, join } = require('path');
// // LOCAL

// // // // // // // EXPRESS APP // // // // // // //

const app = express();
const httpServer = createServer(app);

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());
// enable cors
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
    })
);
app.options('*', cors());

const ContentSecurityPolicyMiddleWare = (req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' 'unsafe-inline'; script-src 'self'  'unsafe-inline'"
    );
    next();
};
app.use(ContentSecurityPolicyMiddleWare);

const STATIC_DIR = resolve('static');

app.use(express.static(STATIC_DIR));

app.get('/api/list', (req, res) => {
    const relPath = req.query.path || '';
    const fullPath = join(STATIC_DIR, relPath);

    // Prevent directory traversal
    if (!fullPath.startsWith(STATIC_DIR)) return res.status(403).send('Forbidden');

    fs.readdir(fullPath, { withFileTypes: true }, (err, entries) => {
        if (err) return res.status(500).json({ error: 'Unable to read directory' });

        const result = entries.map((e) => ({
            name: e.name,
            type: e.isDirectory() ? 'folder' : 'file',
            path: join(relPath, e.name).replace(/\\/g, '/'),
        }));

        res.json(result);
    });
});

app.use('*', (req, res, next) => {
    res.status(NOT_FOUND).json({ NOT_FOUND });
});

const PORT = 7832;
httpServer.listen(PORT, () => {
    console.info(`Listening  http://localhost:${PORT}`);
});
