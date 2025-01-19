import React, { useState, useEffect , useContext } from "react";
import Card from "../Card/Card";
import {FavoriteContext} from "@/store/Context"
export default function AllCards({ mov, title, delete_btn, heading }) {
  const itemsPerPage = 6; 
  const [data, setData] = useState([]);
  const {clicked , setClicked} = useContext(FavoriteContext)
  
  useEffect(() => {
    setData(mov || []); 
  }, [mov , clicked]);

  
  const rows = [];
  for (let i = 0; i < data.length; i += itemsPerPage) {
    rows.push(data.slice(i, i + itemsPerPage));
  }

  return (
    <div className="py-8 ml-20">
      {heading && (
        <h1 className="ml-12 text-5xl font-bold mb-4" style={{ color: "#F5C518" }}>
          {heading}
        </h1>
      )}
      
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mt-4 ml-16">
          {row.map((movie, index) => (
            <Card movieData={movie} index={index} key={movie._id || index} delete_btn={delete_btn} />
          ))}
        </div>
      ))}
    </div>
  );
}
