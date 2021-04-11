// 30-March-2021

// npm init -y
// npm install express mongodb cors body-parser
// npm install nodemon --save-dev
// npm install firebase-admin --save
// npm install dotenv

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9kin.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;
app.listen(process.env.PORT || port);


//#####################################################################
//#####################################################################
//#####################################################################

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

    const allProduct = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_PRODUCT}`);

    app.post("/addProduct", (req, res) => {
        const products = req.body;
        allProduct.insertOne(products)
            .then(result => {
                console.log(result.insertedCount);
            })
    });

    app.get('/allProducts', (req, res) => {
        //allProduct.find({})//.limit(20)
        const search = req.query.search;
        allProduct.find({ name: { $regex: search } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/product/:id', (req, res) => {
        const key = req.params.id
        allProduct.find({ key: key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    });

    app.post('/selectedProducts', (req, res) => {
        // multiple keys are store here... 
        const keys = req.body;
        allProduct.find({ key: { $in: keys } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //######################################################################################
    // Order Collection
    //######################################################################################
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER}`);

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });









    console.log("DB Connection ===> OK");
});
//#####################################################################
//#####################################################################
//#####################################################################
app.get('/', (req, res) => {
    res.send("<h1>NodeJS Server is Running...</h1>")
})