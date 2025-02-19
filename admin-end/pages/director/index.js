import { useEffect, useState , useContext} from 'react';
import DirectorsTable from '@/widgets/Director/DirectorTable';
import DirectorModal from '@/widgets/Director/DirectorModal';
import styles from '../../styles/Table.module.css';
import SearchBar from '@/widgets/search';
import { ActionContext } from '@/store/action';


const InitialDirectorState= {name: "", description: "", dateOfBirth: null , image:"default-director.jpg"};
function Director() {

  const [directors, setDirectors] = useState([]);
  const [filteredDirectors, setFilteredDirectors] = useState([]);
  const [show, setShow]= useState(false);
  const [newUser , setNewUser]= useState(InitialDirectorState);
  const [title, setTitle] = useState("");
  const attributes = ["ALL", "name", "description", "dateOfBirth"];

  const {setAction} = useContext(ActionContext);
  
  const fetchDirectors = () => {
    fetch('/api/director')
    .then((response) => {
      if (!response.ok) {
        console.error('Failed to fetch directors');
        return; 
      }
      return response.json();
    })
    .then((data) => {
      setDirectors(data.directors);
      setFilteredDirectors(data.directors);
    })
    .catch((error) => {
      console.error('Error fetching directors:', error);
    });
  };
  
  useEffect(() => {
    fetchDirectors();
    setAction("fetch");
  }, []);

  const resetAll = () => {
    setFilteredDirectors(directors);
    setAction("search");
  }

  const toggleshow = () => {
    if(show){
      setNewUser(InitialDirectorState);
    }
    setShow(!show); 
  }
  
  const handleAddClick = () => {
    setTitle("Add Director");
    toggleshow();
  }

  const handleUpdateClick = (director) => {
    setTitle("Edit Director");
    setNewUser(director);
    toggleshow();
  }

  const handleDeleteClick = (_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this director?');
    if (!isConfirmed) return;
  
    fetch(`/api/director?id=${_id}`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      setDirectors((prevDirectors) => prevDirectors.filter((director) => director._id !== _id));
      setFilteredDirectors((prevDirectors) => prevDirectors.filter((director) => director._id !== _id))
    })
    .catch((error) => {
      console.error('Error deleting director:', error);
    });
  };

  return (
    <div>
      {!show ?
        <>
          <div className={styles.buttonContainer}>
            <SearchBar attributes={attributes} data={directors} setFiltered={setFilteredDirectors} resetAll={resetAll}/>
            <button className={`${styles.addButton}`} onClick={handleAddClick}> Add Directors</button>
          </div>
          <DirectorsTable directors={filteredDirectors} updateDirector={handleUpdateClick} deleteDirector={handleDeleteClick}/>
        </>:
        <DirectorModal show={show} fetchDirectors={fetchDirectors} toggleshow={toggleshow} title={title} newDirector={newUser}/> 
      }
    </div>
  );
}

export default Director;
