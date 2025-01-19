import { useEffect, useState, useContext } from 'react';
import ProducersTable from '@/widgets/Producer/ProducerTable';
import ProducerModal from '@/widgets/Producer/ProducerModal';
import styles from '../../styles/Table.module.css';
import SearchBar from '@/widgets/search';
import { ActionContext } from '@/store/action';

const InitialProducerState= {name: "", description: "", dateOfBirth: null , image:"default-producer.jpg"};

function Producer() {

  const [producers, setProducers] = useState([]);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [show, setShow] = useState(false);
  const [newProducer, setNewProducer] = useState(InitialProducerState);
  const [title, setTitle] = useState("");

  const attributes = ["ALL", "name", "description", "dateOfBirth"];

  const {setAction} = useContext(ActionContext);

  const fetchProducers = () => {
    fetch('/api/producer')
    .then((response) => {
      if (!response.ok) {
        console.error('Failed to fetch producers');
        return; 
      }
      return response.json();
    })
    .then((data) => {
      setProducers(data.producers);
      setFilteredProducers(data.producers);
    })
    .catch((error) => {
      console.error('Error fetching producers:', error);
    });
  };
  
  useEffect(() => {
    fetchProducers();
    setAction("fetch");
  }, []);

  const resetAll = () => {
    setFilteredProducers(producers);
    setAction("search");
  }

  const toggleshow = () => {
    if (show) {
      setNewProducer(InitialProducerState);
    }
    setShow(!show); 
  }
  
  const handleAddClick = () => {
    setTitle("Add Producer");
    toggleshow();
  }

  const handleUpdateClick = (producer) => {
    setTitle("Edit Producer");
    setNewProducer(producer);
    toggleshow();
  }

  const handleDeleteClick = (_id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this producer?');
    if (!isConfirmed) return;
  
    fetch(`/api/producer?id=${_id}`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      setProducers((prevProducers) => prevProducers.filter((producer) => producer._id !== _id));
      setFilteredProducers((prevProducers) => prevProducers.filter((producer) => producer._id !== _id));
    })
    .catch((error) => {
      console.error('Error deleting producer:', error);
    });
  };

  return (
    <div>
      {!show ?
        <>
          <div className={styles.buttonContainer}>
            <SearchBar attributes={attributes} data={producers} setFiltered={setFilteredProducers} resetAll={resetAll}/>
            <button className={`${styles.addButton}`} onClick={handleAddClick}> Add Producer</button>
          </div>
          <ProducersTable producers={filteredProducers} updateProducer={handleUpdateClick} deleteProducer={handleDeleteClick}/>
        </> :
        <ProducerModal show={show} fetchProducers={fetchProducers} toggleshow={toggleshow} title={title} newProducer={newProducer}/>
      }
    </div>
  );
}

export default Producer;