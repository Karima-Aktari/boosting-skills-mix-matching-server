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
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        console.log(usersCollection);

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
        //DELETE Product
        app.delete('/deleteWinter/:id', async (req, res) => {
            console.log(req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await winterCollection.deleteOne(query);
            res.json(result);
        })

        //POST Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })

        //GET (make) Orders API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        })

        //Delete Order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await ordersCollection.deleteOne(query);
            res.json(order);
        })

        // Update Order
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Shipped"
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });
        //Get My Orders
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const order = await ordersCollection.find(query).toArray();
            res.send(order)
        })
        //POST users to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })
        //Update users API
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        //Make Admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // User set Role-Admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;

            if (email) {
                const query = { email: email };
                const user = await usersCollection.findOne(query);
                let isAdmin = false;
                if (user) {
                    if (user.role === 'admin') {
                        isAdmin = true;
                    }
                    res.json({ admin: isAdmin })
                } else {
                    res.json({ admin: isAdmin })
                }
            } else {
                res.json({ admin: false })
            }
        })

        //POST Reviews API
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.json(result);
        })
        //GET Reviews API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })

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