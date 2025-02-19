import { useEffect, useState , useContext } from 'react';
import ActorsTable from '@/widgets/Actor/ActorTable';
import ActorModal from '@/widgets/Actor/ActorModal';
import styles from '../../styles/Table.module.css';
import SearchBar from '@/widgets/search';
import { ActionContext } from '@/store/action';

const InitialUserState={ name: "", description: "", dateOfBirth: null , image:"default-actor.jpg"};

function Actor() {
  const [actors, setActors] = useState([]);
  const [filteredActors, setFilteredActors] = useState([]);
  const [show, setShow]= useState(false);
  const [newUser , setNewUser]= useState(InitialUserState);
  const [title, setTitle] = useState("");
  const attributes = ["ALL", "name", "description", "dateOfBirth"];

  const {setAction} = useContext(ActionContext);

  const fetchActors = () => {
    fetch('/api/actor')
    .then((response) => {
      if (!response.ok) {
        return; 
      }
      return response.json();
    })
    .then((data) => {
      setActors(data.actors);
      setFilteredActors(data.actors);
    })
    .catch((error) => {
      console.error('Error fetching actors:', error);
    });
  };
  
  useEffect(() => {
    fetchActors();
    setAction("fetch");
  }, []);


  const resetAll=()=>{
    setFilteredActors(actors);
    setAction("search");
  }

  const toggleshow = () => {
    if(show){
      setNewUser(InitialUserState);
    }
    setShow(!show); 
  }
  
  const handleAddClick =()=>{
    setTitle("Add Actor"); 
    toggleshow();
  }
  const handleUpdateClick =(actor)=>{
    setTitle("Edit Actor");
    setNewUser(actor);
    toggleshow();
  }

  const handleDeleteClick = (_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this actor?');
    if (!isConfirmed) return;
  
    fetch(`/api/actor?id=${_id}`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      setActors((prevActors) => prevActors.filter((actor) => actor._id !== _id));
      setFilteredActors((prevActors) => prevActors.filter((actor) => actor._id !== _id))
    })
    .catch((error) => {
      console.error('Error deleting actor:', error);
    });
  };

  return (
    <div>
      {!show ? 
        <>
          <div className={styles.buttonContainer}>
            <SearchBar attributes={attributes} data={actors} setFiltered={setFilteredActors} resetAll={resetAll}/>
            <button className={`${styles.addButton}`} onClick={handleAddClick}>Add Actors</button>
          </div> 
          <ActorsTable actors={filteredActors} updateActor={handleUpdateClick} deleteActor={handleDeleteClick}/>
        </> : 
        <ActorModal show={show} fetchActors={fetchActors}  toggleshow={toggleshow} title={title}  newActor={newUser}/>
      }
    </div>
  );
}
export default Actor;