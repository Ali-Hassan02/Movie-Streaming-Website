import AddEditActor from './AddEditActor';
import styles from '../../styles/Modal.module.css';

function ActorModal({ show  , toggleshow , title , fetchActors , newActor}) {
  
  return (
    <>
      {show && <div className="modal-backdrop fade show"></div>}
      <div
        className={`modal fade ${show ? 'show' : ''}`}
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!show}
        style={{ display: show ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document" style={{  width: '70%' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
              <button
                type="button"
                className={`close ${styles.closeButton}`} 
                aria-label="Close"
                onClick={toggleshow}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <AddEditActor toggleModal={toggleshow}  fetchActors={fetchActors} newUser={newActor} button={title === "Add Actor"? "Create" : "Update"}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ActorModal;
