const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port  = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.zee3o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const productsCollection = client.db('emaJohnDB').collection('products');

    app.get('/products', async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);
      console.log("pagination : ",req.query)
      const result = await 
      productsCollection
      .find()
      .skip(size * page)
      .limit(size)
      .toArray();
      res.send(result);
    })

    app.get('/productsCount', async(req, res) => {
      const count = await productsCollection.estimatedDocumentCount();
      res.send({count});
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//start server
app.get('/', (req, res) => {
  res.send('SERVER IS RUNNING')
})

app.listen(port, () => {
  console.log(`server is running from port : ${port} number`)
})