import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes.js';

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors()); // allow cross-origin requests early
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serve static files from public/

// API routes
app.use('/api/concerts', router);

// start server
try {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
} catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
}