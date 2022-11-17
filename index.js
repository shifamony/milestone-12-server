// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = process.env.PORT || 5000;
// //const jwt = require('jsonwebtoken');
// require("dotenv").config();

// // middleware
// app.use(express.json());
// app.use(cors());


// // Sending data into client side by getting request
// app.get('/', (req, res) => {
//     res.send('Doctors portal running');
// })
// //username:doctors-portal
// //p:9nr1qkYmj3NeYVTB


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jj8cffr.mongodb.net/?retryWrites=true&w=majority`;
// //console.log(uri);
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// async function run(params) {
//    try{
//     const appointmentOptions = client.db('doctors-portal').collection('appointments');

//     app.get('/appointments', async (req,res) => {
//         const query ={};
//         const options = await appointmentOptions.find(query).toArray();
//         res.send(options);
//     })
//    }
//    finally{

//    }
// }
// run().catch(e => console.log(e));

// app.listen(port, () => {
//     console.log('listening port', port);
// })


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
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(params) {
   try{
    const appointmentOptions = client.db('doctors-portal').collection('appointments');
    const bookingCollection = client.db('doctors-portal').collection('bookings');


    //Use aggrigate to query multiple collection and then merge data

    app.get('/appointments', async (req,res) => {
        const date = req.query.date;
        console.log(date);
        //=======
        const query ={};
        const options = await appointmentOptions.find(query).toArray();
        //===================
//code carefully
        const bookingQuery = {appointmentDate:date};
        const alreadyBooked = await bookingCollection.find(bookingQuery).toArray();

        //===================
        options.forEach(option => {
            const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
            const bookedSlots = optionBooked.map(book => book.slot);
            const remainingSlots = option.slots.filter(slot =>!bookedSlots.includes(slot));
            option.slots = remainingSlots;
            console.log(date,option.name,bookedSlots,remainingSlots.length);
        })
        res.send(options);
    });




//booking post
app.post('/bookings', async (req,res) => {
    const booking = req.body;
    console.log(booking);
    //=================
    const query = {
        appointmentDate: booking.appointmentDate,
        email: booking.email,
        treatment: booking.treatment
    }
    const alreadyBooked = await bookingCollection.find(query).toArray();
    if(alreadyBooked.length){
      const message = `You already have a booking on ${booking.appointmentDate}`
      return res.send({acknowledged: false,message})
    }
    //=================
    const result = await bookingCollection.insertOne(booking);
    res.send(result);
})



   }
   finally{

   }
}
run().catch(e => console.log(e));














app.listen(port, () => {
    console.log('listening port', port);
})