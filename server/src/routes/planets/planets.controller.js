const { getPlanetsData } = require('../../models/planets.models')

async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await getPlanetsData());
}


module.exports = { httpGetAllPlanets };