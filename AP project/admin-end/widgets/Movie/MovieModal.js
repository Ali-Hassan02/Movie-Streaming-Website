import AddEditMovie from './AddEditMovie';  
import styles from '../../styles/Modal.module.css';

function MovieModal({ show, toggleshow, title, newMovie, fetchMovies }) {

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
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document" style={{ maxWidth: '95%' }}>
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
              <AddEditMovie 
                toggleModal={toggleshow}
                fetchMovies={fetchMovies}
                newMovie={newMovie} 
                button={title === "Add Movie" ? "Create" : "Update"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieModal;