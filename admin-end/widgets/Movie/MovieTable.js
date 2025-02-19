import {  useState, useEffect, useContext } from 'react';
import styles from '../../styles/Table.module.css';

import { ActionContext } from '@/store/action';

function MoviesTable({ movies, updateMovie, deleteMovie }) {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const {action, setAction} = useContext(ActionContext);


    const sortedMovies = [...movies].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
      setCurrentPage(1); 
    };

    const totalPages = Math.ceil(sortedMovies.length / itemsPerPage);
    const displayedMovies = sortedMovies.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    useEffect(() => {
      if(action){

        if(movies.length > 0){
          if (action === "fetch" || action === "search") {
            setCurrentPage(1);
            setAction(null);
          }
          else if (action.a === "update") {
            setCurrentPage(action.c);
            setAction(null);
          }
          else{
            const totalPagesAfterUpdate = Math.ceil(movies.length / itemsPerPage);
            setCurrentPage(totalPagesAfterUpdate);
          }
        }

      }
      
    }, [action, movies]);


    const onEditClick = (movie) => {
      setAction({a:"update" , c: currentPage});
      updateMovie(movie);
    };

    const onDeleteClick = (movie) => {
      deleteMovie(movie._id);
      setAction("delete");
    };

    return (
      <div className={styles.MovieTableContainer}>
        <table className={`table table-striped ${styles.MovieTable}`}>
          <thead>
            <tr>
              <th>
                Title
                <button className={styles.sortButton} onClick={() => handleSort('title')}>
                  {sortConfig.key === 'title' && sortConfig.direction === 'asc' ? (
                    <i className="fas fa-arrow-up"></i>
                  ) : (
                    <i className="fas fa-arrow-down"></i>
                  )}
                </button>
              </th>
              <th>
                Description
                <button className={styles.sortButton} onClick={() => handleSort('description')}>
                  {sortConfig.key === 'description' && sortConfig.direction === 'asc' ? (
                    <i className="fas fa-arrow-up"></i>
                  ) : (
                    <i className="fas fa-arrow-down"></i>
                  )}
                </button>
              </th>
              <th>
                Type
                <button className={styles.sortButton} onClick={() => handleSort('type')}>
                  {sortConfig.key === 'type' && sortConfig.direction === 'asc' ? (
                    <i className="fas fa-arrow-up"></i>
                  ) : (
                    <i className="fas fa-arrow-down"></i>
                  )}
                </button>
              </th>
              <th>
                Rating
                <button className={styles.sortButton} onClick={() => handleSort('rating')}>
                  {sortConfig.key === 'rating' && sortConfig.direction === 'asc' ? (
                    <i className="fas fa-arrow-up"></i>
                  ) : (
                    <i className="fas fa-arrow-down"></i>
                  )}
                </button>
              </th>
              <th>
                Duration
                <button className={styles.sortButton} onClick={() => handleSort('duration')}>
                  {sortConfig.key === 'duration' && sortConfig.direction === 'asc' ? (
                    <i className="fas fa-arrow-up"></i>
                  ) : (
                    <i className="fas fa-arrow-down"></i>
                  )}
                </button>
              </th>
              <th>
                Release Date
                <button className={styles.sortButton} onClick={() => handleSort('releaseDate')}>
                  {sortConfig.key === 'releaseDate' && sortConfig.direction === 'asc' ? (
                    <i className="fas fa-arrow-up"></i>
                  ) : (
                    <i className="fas fa-arrow-down"></i>
                  )}
                </button>
              </th>
              <th>Options</th>
            </tr>
          </thead>

          <tbody>
            {displayedMovies.map((movie) => (
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.description.split(" ").slice(0, 4).join(" ")}...</td>
                <td>{movie.type}</td>
                <td>{movie.rating}</td>
                <td>{movie.duration}</td>
                <td>{new Date(movie.releaseDate).toISOString().split('T')[0]}</td>
                <td>
                  <button
                    className="btn btn-light mr-2"
                    onClick={() => onEditClick(movie)}
                  >
                    ✎
                  </button>
                  <button
                    className="btn btn-light mr-2"
                    onClick={() => onDeleteClick(movie)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fixed Pagination Controls */}
        <nav className={styles.paginationControls}>
          <ul className={styles.pagination}>
            <li
              className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ''}`}
            >
              <button
                className={styles.pageLink}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`${styles.pageItem} ${currentPage === i + 1 ? styles.active : ''}`}
              >
                <button
                  className={styles.pageLink}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ''}`}
            >
              <button
                className={styles.pageLink}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
}

export default MoviesTable;
