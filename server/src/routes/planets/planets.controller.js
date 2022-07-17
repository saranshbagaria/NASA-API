const { getPlanetsData } = require('../../models/planets.models')

function httpGetAllPlanets(req, res) {
    return res.status(200).json(getPlanetsData());
}

module.exports = { httpGetAllPlanets };