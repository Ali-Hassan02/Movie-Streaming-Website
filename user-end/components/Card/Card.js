import React, { useEffect, useState , useContext } from "react";

import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { AiOutlineDelete } from 'react-icons/ai'; // Import delete icon
import { BiChevronDown } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { useRouter } from 'next/router';
import {Button} from "@nextui-org/react";
import {FavoriteContext} from "../../store/Context"

export default function Card({  movieData , delete_btn}) {
  //console.log(movieData.trailer)
  const [isHovered, setIsHovered] = useState(false);
  const [rating_percentage , setRatingPercentage] = useState(null) 
  const [logo , setLogo] = useState('plus')
  const {clicked , setClicked} = useContext(FavoriteContext)
  const router = useRouter();
  const handlePlayMovie = () => {
    router.push({
      pathname: '/watch',
      query: { movie: JSON.stringify(movieData) },
    });
  };

  const list_handler = async(id) =>{
    try {
        const response = await fetch("/api/getToken");
        const data = await response.json();
        if(!data.user){
            router.push('/login')
            return 
        }
        
        const secondResponse = await fetch(`/api/Favourite/${data.user.id}`,{
            method:"POST",
            body: JSON.stringify({movieId : movieData._id}),
            headers: {"content-type" : "application/json"}  
          });  
        const secondData = await secondResponse.json();
        
        if(secondData.type === 'added'){
            setLogo('tick')
            setClicked(prev => !prev)
        }
        else if (secondData.type === 'deleted'){
            
            setLogo('plus')
            setClicked(prev => !prev)
        }
      } catch (error) {
        console.error("Error during fetch calls", error);
      }    
}

const get_list = async(id) =>{
    try {
        const response = await fetch("/api/getToken");
        const data = await response.json();
        if(!data.user){
           
            return 
        }
        
        const secondResponse = await fetch(`/api/Favourite/${data.user.id}?movieId=${movieData._id}`, {
            method: "GET",
            headers: { "content-type": "application/json" },
          });
          
        const secondData = await secondResponse.json();
        
        if(secondData.type === true){
            setLogo('tick')
        }
        else if (secondData.type === false){
            setLogo('plus')
        }
        fetch(`/api/rating_percentage/${id}`).then(res=>res.json()).then(data=>setRatingPercentage(data.rating))
      } catch (error) {
        console.error("Error during fetch calls", error);
      }    
}
useEffect(()=>{
    get_list(movieData._id)
} , [clicked])


  
  return (
    <div
      className="max-w-[390px] w-[230px] h-[300px] cursor-pointer relative" // Increased the width here to fit 7 cards per row
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`http://localhost:3001/api/photo?filename=${movieData.thumbnail}`}
        alt="card"
        className="rounded-[0.2rem] w-[225px] h-full z-10"
      />

      {isHovered && (
        <div className="absolute top-[-1vh] left-0 z-20 w-[22rem] max-h-max rounded-[0.3rem] bg-[#181818] shadow-lg transition-all ease-in-out">
          <div className="relative h-[210px]">
            {/* <video
              src={`/trailers/${movieData.trailer}`}
              autoPlay={true}
              loop
              muted
              className="w-full h-[180px] object-cover rounded-[0.3rem] absolute top-0 z-20"
            /> */}
            <iframe
              src={movieData.trailer}
              className="w-full h-[180px] object-cover rounded-[0.3rem] absolute top-0 z-20"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="ml-4 ">
            <h3 className="text-white cursor-pointer text-lg font-semibold hover:text-gray-400 ">
              {movieData.title}
            </h3>
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <IoPlayCircleSharp
                  title="Play"
                  className="text-5xl text-white cursor-pointer transition ease-in-out duration-300 hover:text-gray-400"
                  onClick={handlePlayMovie}
                />

                {!delete_btn && (
                  <>
                    {logo === "tick" ? (
                      <BsCheck
                        title="Remove from List"
                        className="text-4xl text-white cursor-pointer transition ease-in-out duration-300 hover:text-gray-400 mt-2"
                        onClick={() => list_handler(movieData._id)}
                      />
                    ) : (
                      <AiOutlinePlus
                        title="Add to my list"
                        className="text-4xl text-white cursor-pointer transition ease-in-out duration-300 hover:text-gray-400 mt-2"
                        onClick={() => list_handler(movieData._id)}
                      />
                    )}
                  </>
                )}
                <div className=" ml-10  flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#F5C518"
                    viewBox="0 0 24 24"
                    stroke="none"
                    className="w-10 h-10"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <div>
                    <p class="text-white text-lg font-semibold">
                      {rating_percentage}
                      <span class="text-gray-600 text-sm">/10</span>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <BiChevronDown
                  title="More Info"
                  className="text-white text-4xl cursor-pointer transition ease-in-out duration-300 hover:text-gray-400 mt-2 mr-4"
                  onClick={() => router.push(`/movie/${movieData._id}`)}
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4 mb-3">
              <ul className="flex space-x-2">
                {movieData.genres.slice(0, 4).map((genre, index) => (
                  <li
                    key={index}
                    className="bg-gray-800 text-white text-sm px-3 py-1 rounded-full hover:bg-gray-600 transition duration-300"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            {delete_btn && delete_btn === true && (
              <Button
                onClick={() => list_handler(movieData._id)}
                className="w-32 rounded-full mb-4 mx-auto block text-white bg-transparent border-2 border-transparent hover:bg-yellow-500 hover:border-yellow-500 focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                color="primary"
                variant="ghost"
              >
                <AiOutlineDelete className="text-4xl ml-7" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
