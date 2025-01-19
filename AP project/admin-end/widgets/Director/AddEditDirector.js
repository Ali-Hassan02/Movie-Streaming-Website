import { useRef, useState, useEffect, useReducer, useContext } from "react";
import styles from '../../styles/Modal.module.css';
import { ActionContext } from "@/store/action";

function reducer(state, action){
  if(action.type === 'updateFeild'){
      return {...state , [action.field]: action.value}
  }
  else{
     return state;
  }
}

const AddEditDirector = ({ toggleModal, fetchDirectors, newDirector, button }) => {

  const [state, dispatch] = useReducer(reducer, newDirector);
  const [showError, setShowError] = useState(false);

  const [photoFilePath, setPhotoFilePath] = useState(`/api/photo?filename=${newDirector.image}`);
  const [photoFile, setPhotoFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  
  const fileInputRef = useRef();

  const {setAction} = useContext(ActionContext);

  useEffect(() => {
    autoSelectFile(state.image);
  }, []);

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

  const autoSelectFile = (imageName) => {
    const imageUrl = `/api/photo?filename=${imageName}`;
    if (imageName === "default-director.jpg") {
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
      setPhotoFilePath(URL.createObjectURL(file));
      setPhotoFile(file);
      setFileName("changed");
    }
  };

  const AddNewDirector = (newDirector) => {
    fetch('/api/director', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(newDirector), 
    })
    .then((response) => response.json())
    .then((data) => {
        fetchDirectors();
        setAction("add");
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    toggleModal();
  }

  const handleAddClick = () => {
    if (Object.entries(state).filter(([key]) => key !== '__v').some(([key, value])=>{return !value})){
      setShowError(true);
    } 
    else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];
        const newDirectorData = {
          name: state.name,
          description: state.description,
          dateOfBirth: state.dateOfBirth,
          image: base64Image,
          imageName: fileName
        };
        AddNewDirector(newDirectorData);
      };
      reader.readAsDataURL(photoFile);
    }
  };

  const EditDirector = (updatedDirector) => {
    fetch('/api/director', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(updatedDirector),
    })
    .then((response) => response.json())
    .then((data) => {
        fetchDirectors();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    toggleModal();
  };

  const handleUpdateClick = () => {
    if (Object.entries(state).filter(([key]) => key !== '__v').some(([key, value])=>{return !value})){
      setShowError(true);
    } 
    else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];
        const updatedDirectorData = {
          _id: state._id,
          name: state.name,
          description: state.description,
          dateOfBirth: state.dateOfBirth,
          image: base64Image,
          imageName: fileName
        };
        EditDirector(updatedDirectorData);
      };
      reader.readAsDataURL(photoFile);
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <div className={styles.formSection}>
          {showError && (
            <p className={styles.errorMessage}>
              <i className="fas fa-exclamation-circle"></i> All Fields Required...
            </p>
          )}

          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Name</span>
            <input type="text" className="form-control" name="name" value={state.name}  onChange={HandleInputChange}/>
          </div>

          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Description</span>
            <textarea className={`form-control ${styles.textarea}`} name="description" value={state.description} rows="3" onChange={HandleInputChange} />
          </div>

          <div className={`input-group mb-3 ${styles.inputGroup}`}>
            <span className="input-group-text">Date of Birth</span>
            <input type="date" className="form-control" name="dateOfBirth" value={state.dateOfBirth?state.dateOfBirth.slice(0, 10):null}  max={handleCurrentDate()} onChange={HandleInputChange}/>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <img
            src={photoFilePath}
            alt="Director"
            className={styles.imagePreview}
          />
          <input className={`m-2 ${styles.imageinput}`} type="file" onChange={handleFileUpload} ref={fileInputRef} />
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

export default AddEditDirector;