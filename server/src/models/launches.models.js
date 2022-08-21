const planets = require('./planets.mongo')
const launchesDb = require('./launches.mongo');
const axios = require('axios');
const DEFAULT_FLIGHT_NUMBER = 100;

const SX_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
    const response = await axios.post(SX_URL, {

            query: {},
            options: {
                pagination: false,
                populate: [{
                        path: 'rocket',
                        select: {
                            name: 1
                        }
                    },
                    {
                        path: 'payloads',
                        select: {
                            customers: 1
                        }
                    }
                ]
            }
        }

    );

    if (response.status !== 200) {
        error.log('problem download launches');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);


        await saveLaunch(launch);


    }
}

async function loadLaunchesData() {
    const existedLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (existedLaunch) {
        console.log('Launch data already loaded');
    } else {
        await populateLaunches();
    }

}


async function findLaunch(filter) {
    return await launchesDb.findOne(filter);
}
async function existLaunchesWithId(launchId) {
    return await findLaunch({
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

async function getAllLaunches(skip, limit) {
    return await launchesDb.find({}, { _id: 0, __v: 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch1) {
    await launchesDb.findOneAndUpdate({
        flightNumber: launch1.flightNumber,
    }, launch1, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error('No Matching Planet Found');
    }


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
    loadLaunchesData,
    existLaunchesWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
};