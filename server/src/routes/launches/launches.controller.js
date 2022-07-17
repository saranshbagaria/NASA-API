const {
    getAllLaunches,
    addLaunch,
    existLaunchesWithId,
    abortLaunchById
} = require('../../models/launches.models');

function httpGetAllLaunches(req, res) {

    return res.status(200).json(getAllLaunches());
}

function httpAddLaunch(req, res) {
    const launch = req.body;
    if (!launch.launchDate || !launch.mission || !launch.rocket || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property'
        })
    }
    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }
    addLaunch(launch);

    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    if (!existLaunchesWithId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found',
        })
    }
    const aborted = abortLaunchById(launchId);

    return res.status(200).json(aborted);
}
module.exports = {
    httpAddLaunch,
    httpGetAllLaunches,
    httpAbortLaunch
};