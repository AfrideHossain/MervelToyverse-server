const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");

// dotenv
require("dotenv").config();

// cors and json used here
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🤩Yay! Marvel Toyverse Working...");
});
app.post("/gentoken", (req, res) => {
  const userInfo = req.body;
  const token = jwt.sign()
});
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
