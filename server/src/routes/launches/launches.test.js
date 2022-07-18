const request = require('supertest');
const app = require('../../app');

const completeLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'kepler-186 f',
    launchDate: 'January 4, 2028'
};

const launchDataWithInvalidDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'kepler-186 f',
    launchDate: 'zppppp'
};
const launchDataWithoutDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-D',
    target: 'kepler-186 f',
}
describe('Test GET/launches', () => {
    test('It should respond with 200 success', async() => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    });
});

describe('Test POST /launch', () => {
    test('It should respond with 200 success', async() => {
        const response = await request(app).post('/launches')
            .send(completeLaunchData)
            .expect(201)
            .expect('Content-Type', /json/);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(response.body).toMatchObject(launchDataWithoutDate)
    });


    test('It should catch missing required properties', async() => {
        const response = await request(app).post('/launches')
            .send(launchDataWithoutDate)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        })
    });

    test('It should catch invalid dates', async() => {
        const response = await request(app).post('/launches')
            .send(launchDataWithInvalidDate)
            .expect(400)
            .expect('Content-Type', /json/);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date'
        })
    });
})