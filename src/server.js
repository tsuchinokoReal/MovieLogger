const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://prettir:kaiwhite@cluster0.wuhslnx.mongodb.net/?retryWrites=true&w=majority";
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://prettir:kaiwhite@cluster0.wuhslnx.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  rating: Number
});

const Movie = mongoose.model('Movie', movieSchema);

// Create
app.post('/api/log-movie', async (req, res) => {
  try {
    const { title, director, rating } = req.body;

    if (!title || !director) {
      return res.status(400).json({ error: 'Title and director are required.' });
    }

    const newMovie = new Movie({ title, director, rating });
    await newMovie.save();

    res.status(201).json(newMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update
app.put('/api/movies/:id', async (req, res) => {
  try {
    const { title, director, rating } = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { title, director, rating }, { new: true });
    res.json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete
app.delete('/api/movies/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});