const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
//const jwt = require('jsonwebtoken');
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());


// Sending data into client side by getting request
app.get('/', (req, res) => {
    res.send('Doctors portal running');
})
//username:doctors-portal
//p:9nr1qkYmj3NeYVTB


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jj8cffr.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(params) {
   try{
    const appointmentOptions = client.db('doctors-portal').collection('appointments');

    app.get('/appointments', async (req,res) => {
        const query ={};
        const options = await appointmentOptions.find(query).toArray();
        res.send(options);
    })
   }
   finally{

   }
}
run().catch(e => console.log(e));














app.listen(port, () => {
    console.log('listening port', port);
})