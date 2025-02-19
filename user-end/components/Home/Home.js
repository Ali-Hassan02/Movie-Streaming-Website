import Featured from "@/components/Featured/Featured";
import { useEffect, useState , useContext} from "react";
import CardSlider from "../CardSlider/CardSlider";
import {FavoriteContext} from "../../store/Context"
export default function Homee({bg_movie , movies_data }){
  const {clicked , setClicked} = useContext(FavoriteContext)
  
  const [genre, setGenre] = useState(null);
  // const [clicked , setClicked] = useState(true)


const containerStyle = {
    
  backgroundColor: '#000000',
  maxWidth: '1700px',
  margin: '0 auto',
};

  return (
    <div className="home">
      
      <Featured bg_movie = {bg_movie} type={"movies"} setGenre={setGenre} />
      <div style={containerStyle}>
          <CardSlider movies_data = {movies_data.trendingMovies}  title="Trending" />
          <CardSlider movies_data = {movies_data.recently_added_movies} title="Recently Added" />
          <CardSlider  title="Action" reverse = {true}/>
          <CardSlider  title="Thriller" reverse = {true}/>
          <CardSlider  title="Horror" />
          <CardSlider title="Fantasy" reverse = {true}/>
          <CardSlider title="Comedy" />
          <CardSlider title="Mystery" reverse = {true}/>
          <CardSlider title="Science Fiction" />
          <CardSlider title="Crime" reverse = {true}/>
          <CardSlider   title="Drama" reverse = {true}/>
        
      </div>
    </div>
  );
};

