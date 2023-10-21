const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
// const corsConfig = {
//   origin: '',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzgy2jc.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // await client.connect();

    const categoryCollection = client.db('eCommerceDB').collection('category');
    const allDataCollection = client.db('eCommerceDB').collection('allData');

    const userCollection = client.db('eCommerceDB').collection('user')


   //category
    app.get("/category", async(req, res) => {
      const query = {}
      const cursor = categoryCollection.find(query);
      const category = await cursor.toArray();
      res.send(category)
    })


    // allDataCollection
    app.get("/allData", async(req, res) => {
      const query = {}
      const cursor = allDataCollection.find(query);
      const allData = await cursor.toArray();
      res.send(allData )
    })

    // update 
    app.get('/allData/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await allDataCollection.findOne(query);
      res.send(result);
    })

    // put
   
    app.put('/allData/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
          $set: {
              name: updatedProduct.name,
              quantity: updatedProduct.quantity,              
              category: updatedProduct.category,
              details: updatedProduct.details,
              photo: updatedProduct.photo              
          }
      }

      const result = await allDataCollection.updateOne(filter, product, options);
      res.send(result);
  })


    //delete
    app.delete('/allData/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await allDataCollection.deleteOne(query);
      res.send(result);
    }) 


  
    //user related apis
    app.post('/user', async(req, res)=> {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result)
    });


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('E commerce server is running')
})


app.listen(port, () => {
  console.log(`e-commerce server is running on port: ${port}`)
})



