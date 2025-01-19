import { useState, useContext } from "react";
import styles from '../styles/SearchBar.module.css';
import { ActionContext } from "@/store/action";

const SearchBar = ({attributes, data, setFiltered, resetAll }) => {
  const [selectedAttribute, setSelectedAttribute] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const {setAction} = useContext(ActionContext);
  
  const handleChange = (e)=>{
    if(e.target.value === ""){
        resetAll();
    }
    setSearchQuery(e.target.value)
  }

  const handleSearch = () => {
    let filtered = data;

    if (selectedAttribute !== "ALL" && searchQuery) {
      filtered = data.filter((d) => {
        const value = d[selectedAttribute];
        if (value) {
          if (value instanceof Date) {
            const formattedDate = value.toISOString().split('T')[0];
    
            return formattedDate.includes(searchQuery.toLowerCase());
          }
    
          const stringValue = value.toString().toLowerCase();
          console.log(stringValue);
          return stringValue.includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }
    

    if (selectedAttribute === "ALL" && searchQuery) {
      filtered = data.filter((d) =>
        attributes.some((attribute) => {
          const value = d[attribute];
          if (value) {
            if (value instanceof Date) {
              return value.toISOString().split('T')[0].includes(searchQuery.toLowerCase()); 
            }
            return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        })
      );
    }
    setAction("search");
    setFiltered(filtered); 
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.inputGroup}>
        <select
          value={selectedAttribute}
          onChange={(e) => setSelectedAttribute(e.target.value)}
          className={styles.selectDropdown}
        >
          {attributes.map((attr) => (
            <option key={attr} value={attr}>
              {attr === "ALL" ? "All Attributes" : attr}
            </option>
          ))}
        </select>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChange={handleChange}
        />

        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;