const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;
const app = express();

//middle Ware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1h4ey.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productsCollection = client.db('Car-manufacturer').collection('products');

        app.get('/products', async(req, res) =>{
            const query = {};
            const cursor = productsCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // uploade product
        app.post("/uploadProduct", async (req, res) => {
            const data = req.body;
            const result = await productsCollection.insertOne(data);
            res.send(result);
          });

        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
          });

           //delete
    app.delete("/product/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const products = await productCollection.deleteOne(query);
        res.send(products);
      });


    }
    finally{

    }
}

run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send('Car Connect')
})


app.listen(port,() =>{
    console.log('Now' ,port);
})