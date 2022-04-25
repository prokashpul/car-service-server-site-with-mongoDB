const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cbjoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("carservice").collection("services");
    const orderCollection = client.db("carservice").collection("order");
    // all service data
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });
    // single data
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    // post data
    app.post("/service", async (req, res) => {
      const newService = req.body;
      const service = await serviceCollection.insertOne(newService);
      res.send(service);
    });
    //delete data
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
    //order get api
    app.get("/order", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const order = await cursor.toArray();
      res.send(order);
    });
    // order api create
    app.post("/order", async (req, res) => {
      const query = req.body;
      const cursor = await orderCollection.insertOne(query);
      res.send(cursor);
    });
    // create token access api
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.SECRET_TOKEN, {
        expiresIn: "1d",
      });
      res.send(accessToken);
    });
  } finally {
  }
}
run().catch(console.dir);
// get data
app.get("/users", (req, res) => {
  res.send("Hello world");
});

//read data
app.listen(port, () => {
  console.log("my port ", port);
});
