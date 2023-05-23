const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// dotenv
require("dotenv").config();

// cors and json used here
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🤩Yay! Marvel Toyverse Working...");
});
// gen jwt
app.post("/gentoken", (req, res) => {
  const userInfo = req.body;
  const token = jwt.sign(userInfo, process.env.JWT_SECRETKEY);
  res.json({ token });
});
// verify jwt
const validateUser = (req, res, next) => {
  const authToken = req.headers.authtoken;
  if (!authToken) {
    return res.status(401).send({ error: "Invalid credentials" });
  }
  try {
    let token = authToken.split(" ")[1];
    const decodedData = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.decodedUser = decodedData;
    next();
  } catch {
    return res.status(401).send({ error: "Invalid credentials" });
  }
};
// crud oparations
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("marvel_toy_verse");
    // get methods
    app.get("/toys", async (req, res) => {
      const collection = database.collection("toys");
      let cursor = await collection.find().sort({ price: 1 }).toArray();
      if (cursor.length) {
        res.json({
          success: true,
          msg: "Toys found",
          toys: cursor,
        });
      } else {
        res.json({
          success: false,
          msg: "Toys not found",
        });
      }
    });
    app.get("/toy/:id", async (req, res) => {
      let id = req.params.id;
      const collection = database.collection("toys");
      let result = await collection.findOne({ _id: new ObjectId(id) });
      if (result) {
        res.json({
          success: true,
          msg: "Toy found",
          toy: result,
        });
      } else {
        res.json({
          success: false,
          msg: "Toy not found",
        });
      }
    });
    app.get("/mytoys", validateUser, async (req, res) => {
      let user = req.decodedUser;
      const collection = database.collection("toys");
      let cursor = await collection
        .find({ sellerEmail: user.email })
        .sort({ price: 1 })
        .toArray();
      if (cursor.length) {
        res.json({
          success: true,
          msg: "Toys found",
          toys: cursor,
        });
      } else {
        res.json({
          success: false,
          msg: "Toys not found",
        });
      }
    });
    // delete method
    app.delete("/toy/:id", async (req, res) => {
      let id = req.params.id;
      const collection = database.collection("toys");
      let result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount > 0) {
        res.json({
          success: true,
          msg: "Toy deleted",
          result: result,
        });
      } else {
        res.json({
          success: false,
          msg: "Toy not deleted",
        });
      }
    });
    // patch method
    app.patch("/toy/:id", async (req, res) => {
      let id = req.params.id;
      const collection = database.collection("toys");
      let result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            price: parseFloat(req.body.price),
            quantity: parseInt(req.body.quantity),
            description: req.body.description,
          },
        }
      );
      console.log(result);
      if (result.modifiedCount > 0) {
        res.json({
          success: true,
          msg: "Toy updated",
          result: result,
        });
      } else {
        res.json({
          success: false,
          msg: "Toy not found",
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Marvel Toyverse listening on port ${port}`);
});
