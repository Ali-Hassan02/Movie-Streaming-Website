import { useRef, useState, useEffect, useReducer, useContext } from "react";
import styles from '../../styles/Modal.module.css';
import MultiSelectDropdown from "./MultipleSelect";
import { ActionContext } from "@/store/action";

const genreOptions = [
  { id: 1, name: "Action" },
  { id: 2, name: "Thriller" },
  { id: 3, name: "Comedy" },
  { id: 4, name: "Romantic" },
  { id: 5, name: "Horror" },
  { id: 6, name: "Drama" },
  { id: 7, name: "Adventure" },
  { id: 8, name: "Fantasy" },
  { id: 9, name: "Science Fiction" },
  { id: 10, name: "Mystery" },
  { id: 11, name: "Crime" },
  { id: 13, name: "Family" },
  { id: 14, name: "Historical" },
  { id: 15, name: "Musical" },
];

function reducer(state, action){
  if(action.type === 'updateFeild'){
      return {...state , [action.field]: action.value}
  }
  else{
     return state;
  }
}


const AddEditMovie = ({ toggleModal, fetchMovies, newMovie, button }) => {

  const [state, dispatch] = useReducer(reducer, newMovie);
  const [showError, setShowError] = useState(false);

  const [photoFilePath, setPhotoFilePath] = useState(`/api/photo?filename=${newMovie.thumbnail}`);
  const [photoFile, setPhotoFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const fileInputRef = useRef();

  const {setAction} = useContext(ActionContext);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [selectedProducers, setSelectedProducers] = useState([]);
  
  const [actorOptions, setActorOptions] = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [producerOptions, setProducerOptions] = useState([]);

  useEffect(() => {
    autoSelectFile(state.thumbnail);
    const fetchOptions = async (url, setOptions, key) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setOptions(data[key]); 
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions("/api/actor", setActorOptions, "actors");
    fetchOptions("/api/director", setDirectorOptions, "directors");
    fetchOptions("/api/producer", setProducerOptions, "producers");
  }, []);

  useEffect(() => {
    if (newMovie.genres.length > 0 ||newMovie.actors.length > 0 || newMovie.directors.length > 0 || newMovie.producers.length > 0) {
      const matchedActors = actorOptions.filter(option => newMovie.actors.includes(option._id));
      const matchedDirectors = directorOptions.filter(option => newMovie.directors.includes(option._id));
      const matchedProducers = producerOptions.filter(option => newMovie.producers.includes(option._id));
      const matchedGenres = genreOptions.filter(option => newMovie.genres.includes(option.name));

      setSelectedActors(matchedActors);
      setSelectedDirectors(matchedDirectors);
      setSelectedProducers(matchedProducers);   
      setSelectedGenres(matchedGenres);
    }
  }, [actorOptions, directorOptions, producerOptions]);
  
  const autoSelectFile = (imageName) => {
    const imageUrl = `/api/photo?filename=${imageName}`;
    if (imageName === "default-movie.jpg") {
      setFileName(imageName);
    } else {
      setFileName("changed");
    }
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        if (fileInputRef.current) {
          const file = new File([blob], imageName, { type: 'image/jpeg' });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
          setPhotoFilePath(URL.createObjectURL(fileInputRef.current.files[0]));
          setPhotoFile(fileInputRef.current.files[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching image:', error);
      });
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setPhotoFilePath(URL.createObjectURL(file));  
        setPhotoFile(file); 
        setFileName("changed");  
      } else {
        autoSelectFile(newMovie.thumbnail);
        alert("Please upload a valid image file.");
      }
    }
  }; 

  function HandleInputChange(e){
    dispatch({
        type:'updateFeild',
        field: e.target.name,
        value: e.target.value
    });
    setShowError(false)
  }

  const handleCurrentDate =()=>{
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const handleAddClick = () => {
    if(validate()){
      setShowError(true);
      return;
    }
    else{
      const actorIds = selectedActors.map(actor => actor._id);  
      const directorIds = selectedDirectors.map(director => director._id);  
      const producerIds = selectedProducers.map(producer => producer._id);
      const genreNames = selectedGenres.map(genre => genre.name);
      if (photoFile) {
        const imageReader = new FileReader();
        imageReader.onloadend = () => {
          const base64Image = imageReader.result.split(',')[1];
          const newMovieData = {
            title: state.title,
            description: state.description,
            type: state.type,
            rating: state.rating,
            releaseDate: state.releaseDate,
            duration: state.duration,
            trailer: state.trailer, 
            genres: genreNames,
            actors: actorIds,
            directors: directorIds,
            producers: producerIds,
            thumbnail: base64Image,     
            thumbnailName: fileName,
          };
          AddNewMovie(newMovieData);
          imageReader.onloadend = null;
        }
        imageReader.readAsDataURL(photoFile);
      }
      else{
        alert("Please upload both an image and a video file.");
      }
    }
  }

  const handleUpdateClick = () => {
    if(validate()){
      setShowError(true);
      return;
    }
    else{
      const actorIds = selectedActors.map(actor => actor._id);  
      const directorIds = selectedDirectors.map(director => director._id);  
      const producerIds = selectedProducers.map(producer => producer._id);
      const genreNames = selectedGenres.map(genre => genre.name);
      if (photoFile) {
        const imageReader = new FileReader();
        imageReader.onloadend = () => {
          const base64Image = imageReader.result.split(',')[1];
          const updatedMovieData = {
            _id: newMovie._id,
            title: state.title,
            description: state.description,
            type: state.type,
            rating: state.rating,
            releaseDate: state.releaseDate,
            duration: state.duration,
            trailer: state.trailer, 
            genres: genreNames,
            actors: actorIds,
            directors: directorIds,
            producers: producerIds,
            thumbnail: base64Image,     
            thumbnailName: fileName, 
          };
          EditMovie(updatedMovieData);
          imageReader.onloadend = null;
        }
        imageReader.readAsDataURL(photoFile);
      }
      else{
        alert("Please upload both an image and a video file.");
      }
    }
  }

  const validate =()=>{
    const value = !state.title || !state.description || !state.type || !state.trailer || state.rating <= 0 || state.duration <= 0 || !state.releaseDate || selectedGenres.length === 0 ||  selectedActors.length === 0 || selectedDirectors.length === 0 || selectedProducers.length === 0 ;
    return value;
  }

  const AddNewMovie = (newMovieData) => {
    fetch('/api/movie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMovieData),
    })
    .then((response) => response.json())
    .then((data) => {
        fetchMovies();
        setAction("Add");
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    toggleModal();
  };

  const EditMovie = (updatedMovie) => {
    fetch('/api/movie', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMovie),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchMovies();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    toggleModal();
  };

  return (
    <>
      {showError && (
        <p className={styles.errorMessage} style={{textAlign: 'center', color: 'red', fontSize: '16px', margin: '0px 0', display: 'inline-block', width: '100%',}}>
          <i className="fas fa-exclamation-circle"></i> All Fields Required...
        </p>
      )}
      <div className={styles.formContainer}>
        <div className={styles.formSection}>
          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Title</span>
            <input type="text" className="form-control" name="title" value={state.title}  onChange={HandleInputChange}/>
          </div>

          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Description</span>
            <textarea className={`form-control ${styles.textarea}`} name="description" value={state.description} rows="3" onChange={HandleInputChange} />
          </div>

          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Rating</span>
            <input type="number" min="0"  className="form-control" name="rating" value={state.rating} onChange={HandleInputChange}/>
          </div>

          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Duration</span>
            <input type="number" min="0"  className="form-control" name="duration" value={state.duration} onChange={HandleInputChange} />
          </div>

          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Release Date</span>
            <input type="date" className="form-control" name="releaseDate" value={state.releaseDate?state.releaseDate.slice(0, 10):null}  max={handleCurrentDate()} onChange={HandleInputChange}/>
          </div>

        </div>

        <div className={styles.formSection}>
          
          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Type</span>
            <select className="form-control form-select dropdown-select" name="type" value={state.type} onChange={HandleInputChange} >
              <option value="">--Select Type--</option>
              <option value="Short Film">Short Film</option>
              <option value="Biography">Biography</option>
              <option value="Documentary">Documentary</option>
              <option value="Feature Film">Feature Film</option>
              <option value="Web Series">Web Series</option>
              <option value="TV Show">TV Show</option>
              <option value="Miniseries">Miniseries</option>
              <option value="Music Video">Music Video</option>
              <option value="Pilot">Pilot</option>
            </select>
          </div>
          
          <MultiSelectDropdown
            options={genreOptions}
            selectedItems={selectedGenres}
            setSelectedItems={setSelectedGenres}
            placeholder="--Select Genre--"
            span="Genre"
          />

          <MultiSelectDropdown
            options={actorOptions}
            selectedItems={selectedActors}
            setSelectedItems={setSelectedActors}
            placeholder="--Select Actor--"
            span="Actor"
          />

          <MultiSelectDropdown
            options={directorOptions}
            selectedItems={selectedDirectors}
            setSelectedItems={setSelectedDirectors}
            placeholder="--Select Director--"
            span="Director"
          />

          <MultiSelectDropdown
            options={producerOptions}
            selectedItems={selectedProducers}
            setSelectedItems={setSelectedProducers}
            placeholder="--Select Producer--"
            span="Producer"
          />

        </div>
        
        <div className={styles.formSection}>
          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Trailer</span>
            <input type="text" className="form-control" name="trailer" value={state.trailer} onChange={HandleInputChange} />
          </div>
          <div className={styles.imageContainer}>
            <img
              src={photoFilePath}
              alt="Movie"
              className={styles.MovieimagePreview}
            />
            <input className={`m-2 ${styles.imageinput}`} type="file" onChange={handleFileUpload} ref={fileInputRef} />
          </div>
        </div>

      </div>

      <div className="p-2" style={{ display: 'flex', justifyContent: 'center' }}>
        {button === "Create" ? (
          <button type="button" className={`btn ${styles.createButton}`} onClick={handleAddClick}>
            Create
          </button>
        ) : (
          <button type="button" className={`btn ${styles.createButton}`} onClick={handleUpdateClick}>
            Update
          </button>
        )}
      </div>
    </>
  );
};

export default AddEditMovie;
