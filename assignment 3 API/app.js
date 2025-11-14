import express from 'express';
import cors from 'cors';
import router from './routes.js';

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors()); // to allow React app to make calls to the API

// Route: /api/photos/...
app.use('/api/photos', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
