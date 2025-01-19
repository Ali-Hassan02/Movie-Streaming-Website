import { useEffect, useState, useContext } from 'react';
import MovieTable from '@/widgets/Movie/MovieTable'; 
import MovieModal from '@/widgets/Movie/MovieModal'; 
import styles from '../../styles/Table.module.css';
import SearchBar from '@/widgets/search';
import { ActionContext } from '@/store/action';

const initalMovie = { title: "", description: "", type: "", rating: 0, releaseDate: "", duration: 0, genres: [], actors: [], thumbnail: "default-movie.jpg", trailer: "default-trailer.mp4", directors: [], producers:[] }

function Movie() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [show, setShow] = useState(false);
  const [newMovie, setNewMovie] = useState(initalMovie);
  const [title, setTitle] = useState("");

  const attributes = ["ALL","title","description", "type", "rating","duration","releaseDate", ];

  const {setAction} = useContext(ActionContext);

  const fetchMovies = () => {
    fetch('/api/movie')
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to fetch movies');
          return;
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data.movies);
        setFilteredMovies(data.movies);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  };

  useEffect(() => {
    fetchMovies();
    setAction("fetch");
  }, []);

  const resetAll = () => {
    setFilteredMovies(movies);
    setAction("search");
  };

  const toggleshow = () => {
    if (show) {
      setNewMovie(initalMovie);
    }
    setShow(!show);
  };

  const handleAddClick = () => {
    setTitle("Add Movie");
    toggleshow();
  };

  const handleUpdateClick = (movie) => {
    setTitle("Edit Movie");
    setNewMovie(movie);
    toggleshow();
  };

  const handleDeleteClick = (_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this movie?');
    if (!isConfirmed) return;

    fetch(`/api/movie?id=${_id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== _id));
        setFilteredMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== _id));
      })
      .catch((error) => {
        console.error('Error deleting movie:', error);
      });
  };

  return (
    <div>
      {!show ?
        <>
          <div className={styles.buttonContainer}>
            <SearchBar attributes={attributes} data={movies} setFiltered={setFilteredMovies} resetAll={resetAll} />
            <button className={`${styles.addButton}`} onClick={handleAddClick}> Add Movie</button>
          </div>
          <MovieTable movies={filteredMovies} updateMovie={handleUpdateClick} deleteMovie={handleDeleteClick} />
        </>:
        <MovieModal show={show} fetchMovies={fetchMovies} toggleshow={toggleshow} title={title} newMovie={newMovie} />
      }
    </div>
  );
}

export default Movie;
