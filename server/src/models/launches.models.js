const launches = new Map();

const launch = {
    flightNumber: 100,
    launchDate: new Date('December 27,2030'),
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    destination: 'Kepler-442 b',
    customers: ['NASA', 'ISRO'],
    upcoming: true,
    success: true
};

launches.set(launch.serialNumber, launch);

module.exports = {
    launches
};