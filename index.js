const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ps0n3y2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('db connected');
//   client.close();
// });


async function run(){
    try{
        await client.connect();

    const productCollection = client.db('simple').collection('products');
    const usersCollection = client.db('simple').collection('users');
    app.get('/users', async (req, res) => {
        const query = {};
        const result = await usersCollection.find(query).toArray();
        res.send(result);
    })
    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    })
    app.get('/admin/:email', async (req, res) => {
        const email = req.params.email;
        const filter = {email : email};
        const userEmail = await usersCollection.findOne(filter);
        const isAmin = userEmail.role === 'admin';
        res.send({admin : isAmin});
    })
    

    app.put('/users/admin/:email', async (req, res) =>{
        const email = req.params.email;
        const filter = {email : email};
        const updadedDoc = {
            $set : {role : 'admin'}
        }
        const result = await usersCollection.updateOne(filter, updadedDoc);
        res.send(result);
    })

    app.put('/users/:email', async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = {email: email};
        const options = {upsert: true};
        const updateDoc = {
            $set : user,
        }
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    })
        

    app.post('/products', async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    app.get('/products', async (req, res) => {
        const query = {};
        const result = await productCollection.find(query).toArray();
        res.send(result);
    })

    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result);
    })
    
    }
    finally{

    }
}

run().catch(console.dir);


app.get('/',async (req, res) =>{
    res.send('simple dashboard website is runing');
})

app.listen(port, () =>{
    console.log('app is runing on port', port);
})