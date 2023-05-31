const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.5urggkk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {

        // collections
        const usersCollection = client.db('Golobe_Travel_Agency').collection('userCollection')

        const validateUser = (req, res, next) => {
            const { name, email } = req.body;

            if (!name && !email) {
                return res.status(400).json({ message: 'Please fill in all fields' });
            }

            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (emailRegex.test(email)) {
                return res.status(400).json({ message: 'Valid email' });
            }

            next();
        };

        app.post('/user', validateUser, async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/', (req, res) => {
            res.send('Hello World!');
        });

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } finally {
        // Close the connection after all operations are complete
        await client.close();
    }
}

run().catch(console.dir);
