import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";


export default function ProtectedActions({id}){
    const [rating_percentage , setRatingPercentage] = useState(null) 
    const [isAdded, setIsAdded] = useState("Add to WatchList");
    const [isFilled , setIsFilled] = useState(false)
    const [user, setUser] = useState(null);
    const r = useRouter()
    const get_list = async () => {
        try {
          const response = await fetch("/api/getToken");
          const data = await response.json();
          if (!data.user) {
            setIsAdded("Add to WatchList");
            setIsFilled(false)
            return;
          }
          setUser(data.user);
    
          const secondResponse = await fetch(
            `/api/Favourite/${data.user.id}?movieId=${id}`,
            {
              method: "GET",
              headers: { "content-type": "application/json" },
            }
          );
    
          const secondData = await secondResponse.json();
          console.log(secondData.type);
          if (secondData.type === true) {
            setIsAdded("Remove from WatchList");
          } else if (secondData.type === false) {
            setIsAdded("Add to WatchList");
          }
          
          const thirdResponse = await fetch(
            `/api/Rating/${data.user.id}?movieId=${id}`,
            {
              method: "GET",
              headers: { "content-type": "application/json" },
            }
          );
    
          const thirdData = await thirdResponse.json();
        
          if (thirdData.type === true) {
            setIsFilled(true);
            
          } else if (thirdData.type === false) {
            setIsFilled(false);
            
          }
    
    
          
        } catch (error) {
          console.error("Error during fetch calls", error);
        }
      };

    const handle_rating_click = async() =>{
    if (!user) {
        const currentPath = r.asPath; 

        const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`; 
        r.push(redirectUrl); 
    } else {
        const secondResponse = await fetch(`/api/Rating/${user.id}`, {
        method: "POST",
        body: JSON.stringify({ movieId: id }),
        headers: { "content-type": "application/json" },
        });
        const secondData = await secondResponse.json();
        console.log(secondData.type);
        if (secondData.type === "added") {
        setIsFilled(true);
        } else if (secondData.type === "deleted") {
        setIsFilled(false);
        }
        fetch(`/api/rating_percentage/${id}`).then(res=>res.json()).then(data=>setRatingPercentage(data.rating))
    }
    }

    const handle_tog = async () => {
        if (!user) {
          const currentPath = r.asPath; 
          const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`; 
          r.push(redirectUrl); 
        } else {
          const secondResponse = await fetch(`/api/Favourite/${user.id}`, {
            method: "POST",
            body: JSON.stringify({ movieId: id }),
            headers: { "content-type": "application/json" },
          });
          const secondData = await secondResponse.json();
          console.log(secondData.type);
          if (secondData.type === "added") {
            setIsAdded("Remove from WatchList");
          } else if (secondData.type === "deleted") {
            setIsAdded("Add to WatchList");
          }
        }
      };

    useEffect(() => {
        
          get_list();
          fetch(`/api/rating_percentage/${id}`).then(res=>res.json()).then(data=>setRatingPercentage(data.rating))
      }, []);

    return (
        <div className="flex items-center w-full p-4 ">
                <div className="ml-[57%] w-[15%] flex flex-col items-center text-white  rounded-md">
                  <p className="ml-auto text-gray-400 text-sm font-medium mb-2">IMDB RATING</p>
                  <div className=" ml-10  flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#F5C518"
                      viewBox="0 0 24 24"
                      stroke="none"
                      className="w-6 h-6"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <div>
                      <p class="text-white text-lg font-semibold">
                        {rating_percentage}<span class="text-gray-400 text-sm">/10</span>
                      </p>
                      
                    </div>
                  </div>
                </div>
                <div className="mt-3 w-[15%] flex flex-col items-center text-white p-4 rounded-md">
                  <p className="text-gray-400 text-sm font-medium mb-2">YOUR RATING</p>
                  <div className="flex items-center gap-1" onClick={handle_rating_click}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isFilled ? "blue" : "none"}
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-10 h-10 text-blue-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.998 2.249l1.176 3.62h3.803c.99 0 1.404 1.274.6 1.836l-3.08 2.238 1.177 3.62c.305.94-.793 1.722-1.593 1.106l-3.08-2.237-3.08 2.237c-.8.616-1.898-.165-1.593-1.106l1.177-3.62-3.08-2.238c-.804-.562-.39-1.836.6-1.836h3.803l1.176-3.62c.305-.94 1.695-.94 2 0z"
                      />
                    </svg>
                    <span className="text-blue-500 text-lg font-semibold">Rate</span>
                  </div>
                </div>
  
                <button
                  onClick={handle_tog}
                  className="ml-auto w-[300px] py-2 text-lg font-bold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                >
                  {isAdded}
                </button>
              </div>
    )
}