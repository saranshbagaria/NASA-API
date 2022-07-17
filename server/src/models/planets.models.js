const parse_ = require('csv-parse');
const fs = require('fs');
const path = require('path');



const habitablePlanets = [];

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
                    habitablePlanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log(`${habitablePlanets.length} habitable planet found`);
            });
        resolve();
    });
}

function getPlanetsData() {
    return habitablePlanets;
}
module.exports = {
    getPlanetsData,
    loadPlanetsData
}