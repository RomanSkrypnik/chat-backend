require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./src/router');
const errorMiddleware = require('./src/middleware/error.middlware');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/auth', router);
app.use(errorMiddleware);

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
           useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => console.log(`Server is listening to port ${PORT}...`));
    } catch (e) {
        console.log(e);
    }
}

start();