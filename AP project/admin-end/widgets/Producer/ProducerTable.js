import { useState,useEffect, useContext } from 'react';
import styles from '../../styles/Table.module.css';
import { ActionContext } from '@/store/action';

function ProducersTable({ producers, updateProducer, deleteProducer }) {
    const [currentPage, setCurrentPage] = useState(1);
    const {action , setAction} = useContext(ActionContext);
    const itemsPerPage = 4;

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const sortedProducers = [...producers].sort((a, b) => {
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

    const totalPages = Math.ceil(sortedProducers.length / itemsPerPage);
    const displayedProducers = sortedProducers.slice(
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

        if(producers.length > 0){
          if (action === "fetch" || action === "search") {
            setCurrentPage(1);
            setAction(null);
          }
          else if (action.a === "update") {
            setCurrentPage(action.c);
            setAction(null);
          }
          else{
            const totalPagesAfterUpdate = Math.ceil(producers.length / itemsPerPage);
            setCurrentPage(totalPagesAfterUpdate);
          }
        }

      }
      
    }, [action, producers]);

    const onEditClick = (producer) => {
      updateProducer(producer);
      setAction({a:"update" , c: currentPage});
    };

    const onDeleteClick = (producer) => {
      deleteProducer(producer._id);
      setAction("delete");
    };

    return (
      <div className={styles.TableContainer}>
        <table className={`table table-striped ${styles.Table}`}>
          <thead>
            <tr>
              <th>
                Name
                <button className={styles.sortButton} onClick={() => handleSort('name')}>
                  {sortConfig.key === 'name' && sortConfig.direction === 'asc' ? (
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
                Date of Birth
                <button className={styles.sortButton} onClick={() => handleSort('dateOfBirth')}>
                  {sortConfig.key === 'dateOfBirth' && sortConfig.direction === 'asc' ? (
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
            {displayedProducers.map((producer) => (
              <tr key={producer.id}>
                <td>{producer.name}</td>
                <td>{producer.description.split(" ").slice(0, 4).join(" ")}...</td>
                <td>{new Date(producer.dateOfBirth).toISOString().split('T')[0]}</td>
                <td>
                  <button
                    className="btn btn-light mr-2"
                    onClick={() => onEditClick(producer)}
                  >
                    ✎
                  </button>
                  <button
                    className="btn btn-light mr-2"
                    onClick={() => onDeleteClick(producer)}
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

export default ProducersTable;