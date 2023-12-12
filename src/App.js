import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({ title: '', director: '', rating: '' });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/movies');
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/log-movie', formData);
      fetchMovies();
      setFormData({ title: '', director: '', rating: ''});
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleUpdateMovie = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/movies/${id}`, formData);
      fetchMovies(); 
      setFormData({ title: '', director: '', rating: '' });
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/movies/${id}`);
      fetchMovies(); 
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div>
      <h1>Movie Logger App</h1>

      <form onSubmit={handleAddMovie}>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </label>
        <br/>
        <label>
          Director:
          <input type="text" name="director" value={formData.director} onChange={handleInputChange} required />
        </label>
        <br/>
        <label>
          Rating:
          <input type="text" name="rating" value={formData.rating} onChange={handleInputChange} required />
        </label>
        <br/>
        <button type="submit">Add Movie</button>
      </form>

      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            <div>
              <p>Title: {movie.title}</p>
              <p>Director: {movie.director}</p>
              <p>Rating: {movie.rating}</p>
            </div>
            <div>
              <button className = "app-button-update" onClick={() => handleUpdateMovie(movie._id)}>Update</button>
              <button className = "app-button-delete" onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;