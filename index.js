const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

//middle Ware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1h4ey.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client
      .db("Car-manufacturer")
      .collection("products");
    const reviewCollection = client
      .db("Car-manufacturer")
      .collection("reviews");
    const userCollection = client.db("Car-manufacturer").collection("users ");
    const orderCollection = client.db("Car-manufacturer").collection("order ");
    const profileCollection = client
      .db("Car-manufacturer")
      .collection("profile");

    //profile
    app.get("/profile", async (req, res) => {
      const profile = await profileCollection.find({}).toArray();
      res.send(profile);
    });
    app.post("/uploadProfile", async (req, res) => {
      const data = req.body;
      const result = await profileCollection.insertOne(data);
      res.send(result);
    });

    //order
    app.post("/uploadOrder", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });

    //user email order
    app.get("/order/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      console.log(query);
      const order = await orderCollection.find(query).toArray();
      res.send(order);
    });

    //all order
    app.get("/orders", async (req, res) => {
      const order = await orderCollection.find({}).toArray();
      res.send(order);
    });

    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.deleteOne(query);
      res.send(order);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

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
      const products = await productsCollection.deleteOne(query);
      res.send(products);
    });

    //review
    app.get("/review", async (req, res) => {
      const review = await reviewCollection.find({}).toArray();
      res.send(review);
    });

    app.post("/uploadReview", async (req, res) => {
      const data = req.body;
      const result = await reviewCollection.insertOne(data);
      res.send(result);
    });

    //user admin
    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    //profile post
    app.put("/userprofile", async (req, res) => {
      const data = req.body;
      const result = await userCollection.insertOne(data);
      res.send(result);
    });
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const users = await userCollection.findOne(query);
      res.send(users);
    });

    //profile end
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      // admin email get
      app.get("/admin/:email", async (req, res) => {
        const email = req.params.email;
        const user = await userCollection.findOne({ email: email });
        const isAdmin = user.role === "admin";
        res.send({ admin: isAdmin });
      });

      app.put("/user/admin/:email", async (req, res) => {
        const email = req.params.email;
        const filter = { email: email };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
      });
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await userCollection.deleteOne(query);
      res.send(user);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Connect");
});

app.listen(port, () => {
  console.log("Now", port);
});
