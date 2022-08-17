const mongodb = require('mongoose');

const MONGO_URL = "mongodb+srv://saransh19cs107:kXhXGGDqj8AxT8Ke@cluster0.8r2v8rz.mongodb.net/NASA?retryWrites=true&w=majority";




mongodb.connection.once('open', () => {
    console.log("mongo db connection is ready to good");
})
mongodb.connection.on('error', (err) => {
    console.error(err);
})


async function mongoConnect() {
    await mongodb.connect(MONGO_URL, {
        useNewUrlParser: true,

        useUnifiedTopology: true
    });
}

async function mongoDisconnect() {
    await mongodb.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };