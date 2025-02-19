import React, { useEffect,  useState , useContext } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "../Card/Card";
import {FavoriteContext} from "../../store/Context"
export default function CardSlider({movies_data ,  title , heading , reverse }) {
  const [sliderPosition, setSliderPosition] = useState(0); // Track the current page of movies
  const [showControls, setShowControls] = useState(false);
  const [data , setData] = useState([])
  const itemsPerPage = 7; // Display 7 movies per row
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const {clicked , setClicked} = useContext(FavoriteContext)
  
  
  useEffect(()=>{
    if(title === 'Trending'){
      setData(movies_data)
    }
    else if (title === 'Recently Added'){
      setData(movies_data)
    }
    else{
      fetch(`/api/genre/${title}`).then(res=>res.json()).then(data=>{
          if(reverse){
            setData(data.movies.slice().reverse())
          }
          else{
            setData(data.movies)  
          }
      })
    }
  } , [clicked])
  const handleDirection = (direction) => {
    
    if (direction === "left" && sliderPosition > 0) {
      setSliderPosition(sliderPosition - 1);
    }
    if (direction === "right" && sliderPosition < totalPages - 1) {
      setSliderPosition(sliderPosition + 1);
    }
  };

  // Slice the data to only show the current page of movies
  const currentMovies = data.slice(sliderPosition * itemsPerPage, (sliderPosition + 1) * itemsPerPage);

  return (
    <div
      className="relative gap-4 py-8"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
     <h1 className="ml-12 text-5xl font-bold mb-4" style={{ color: '#F5C518' }}>{heading ? heading : title}</h1>


      <div className="relative">
        <div
          className={`absolute z-10 h-full top-0 bottom-0 left-0 w-12 flex items-center justify-center transition-all ${
            !showControls ? "opacity-0" : "opacity-100"
          }`}
        >
          <AiOutlineLeft onClick={() => handleDirection("left")} className="text-2xl" />
        </div>
        <div className="flex gap-0 ml-12 transition-transform  ease-in-out">
          {currentMovies.map((movie, index) => (
            <Card clicked = {clicked}  setClicked = {setClicked} movieData={movie} index={index} key={movie._id} />
          ))}
        </div>
        <div
          className={`absolute z-10 h-full top-0 bottom-0 right-0 w-12 flex items-center justify-center transition-all ${
            !showControls ? "opacity-0" : "opacity-100"
          }`}
        >
          <AiOutlineRight onClick={() => handleDirection("right")} className="text-2xl" />
        </div>
      </div>
    </div>
  );
};
