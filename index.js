const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mt6g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('Database connected Successfully');
        const database = client.db('mixMatching');
        const winterCollection = database.collection('winter');
        const ordersCollections = database.collections('orders');
        console.log(ordersCollections);

        //POST WinterCollections API
        app.post('/winter', async (req, res) => {
            const winter = req.body;
            const result = await winterCollection.insertOne(winter);
            console.log(result);
            res.send('result');
        })
        //GET WinterCollections API
        app.get('/winter', async (req, res) => {
            const cursor = winterCollection.find({});
            const winter = await cursor.toArray();
            res.send(winter);
        })

        //GET Single product BY ID
        app.get('/winter/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const winter = await winterCollection.findOne(query);
            res.json(winter);
        })

        // //POST Orders API
        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     const result = await ordersCollections.insertOne(order);
        //     res.send(result);

        // })
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

//Server checking
app.get('/', (req, res) => {
    res.send('Server is Connected');
});
app.listen(port, () => {
    console.log('Server running at port', port)
})