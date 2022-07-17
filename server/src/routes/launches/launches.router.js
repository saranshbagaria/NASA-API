const express = require('express');
const { httpAbortLaunch, httpGetAllLaunches, httpAddLaunch } = require('./launches.controller')

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddLaunch);
launchesRouter.delete('/:id', httpAbortLaunch)
module.exports = launchesRouter;