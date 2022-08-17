const planets = require('./planets.mongo')
const launchesDb = require('./launches.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
    flightNumber: 100,
    launchDate: new Date('December 27,2030'),
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    target: 'Kepler-442 b',
    customers: ['NASA', 'ISRO'],
    upcoming: true,
    success: true
};
saveLaunch(launch);

async function existLaunchesWithId(launchId) {
    return await launchesDb.findOne({
        flightNumber: launchId
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDb
        .findOne()
        .sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDb.find({}, { _id: 0, __v: 0 })
}

async function saveLaunch(launch1) {
    const planet = planets.find({
        keplerName: launch1.target,
    });
    if (!planet) {
        throw new Error('No Matching Planet Found');
    }

    await launchesDb.findOneAndUpdate({
        flightNumber: launch1.flightNumber,
    }, launch1, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['SARANSH', 'NASAIO'],
        flightNumber: newFlightNumber
    });
    await saveLaunch(newLaunch);
}




async function abortLaunchById(launchId) {

    const aborted = await launchesDb.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;

    return aborted.modifiedCount === 1;

    // return aborted;
}
module.exports = {
    existLaunchesWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
};