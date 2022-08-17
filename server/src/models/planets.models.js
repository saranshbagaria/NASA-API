const parse_ = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

function isHebitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6;
}
/**
 * const promise = new promise((resolve, reject) = > {
 *      
 * })
 */
function loadPlanetsData() {
    return new Promise((resolve, reject) => {

        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse_.parse({
                comment: '#',
                columns: true,
            }))
            .on('data', (data) => {
                if (isHebitable(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async() => {
                const countPlanetsFound = (await getPlanetsData()).length;
                console.log(`${countPlanetsFound} habitable planet found`);
                resolve();
            });
    });
}

async function getPlanetsData() {
    //pass in filter
    //second argument  projection formating result 
    // <1> -> include <0> -> exclude <-> ->excepting that field 
    return await planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch (err) {
        console.log(`Could not save planet ${err}`)
    }
}
module.exports = {
    getPlanetsData,
    loadPlanetsData
}