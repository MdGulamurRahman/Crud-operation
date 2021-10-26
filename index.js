const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n1beb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const userCollection = database.collection("users");
    // POST API s-1
    app.post('/users', async (req, res)=>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser)
      res.json(result)
    })
    //GET API s-2
    app.get('/users', async (req, res)=>{
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users)
    })
    //DELETE USER s-3
    app.delete('/users/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      console.log('delete successfully', result)
      res.json(result)
    })

    //update apic s-4
    app.get('users/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.findOne(query);
      console.log(id)
      res.send(result)
    })
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('running my crud server')
})


app.listen(port, ()=>{
    console.log('port server', port)
})





//name: practiceDb1
//pass: HVszQKcvlC9qXzCg


//1/ mongodb atlas
//-2 node mongodb 
//-3 express routing