const express = require('express');
const cors = require('cors');


const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');
const app = express();
const path = require('path');
const morgan = require('morgan');



app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('combined'));
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public", "build")));
app.use(planetsRouter);
app.use(launchesRouter);

module.exports = app;