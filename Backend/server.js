import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './Routes/userRouter';
import authRouter from './Routes/authRouter';
const path = require('path');
const app = express();
require('dotenv-safe').load({
    path: path.join(__dirname, './.env'),
    sample: path.join(__dirname, './.env.example'),
});
const cors = require('cors');
app.use(cors({ origin: true, credentials: true }));
const port = process.env.PORT || 5656;
const db = mongoose.connect(process.env.DB_ADDRESS, { useNewUrlParser: true });
// setting body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/user', userRouter);
app.use('/api/', authRouter);

// Running the server
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})