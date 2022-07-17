const launches = new Map();

var latestLaunchNumber = 100;

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

launches.set(launch.flightNumber, launch);

function existLaunchesWithId(launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function addLaunch(launch) {
    latestLaunchNumber++;
    launches.set(latestLaunchNumber,
        Object.assign(launch, {
            flightNumber: latestLaunchNumber,
            success: true,
            upcoming: true,
            customers: ['SARANSH', 'NASA']
        })
    );
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;

    return aborted;
}
module.exports = {
    existLaunchesWithId,
    getAllLaunches,
    addLaunch,

    abortLaunchById
};