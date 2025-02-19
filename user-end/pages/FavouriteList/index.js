import AllCards from "@/components/AllCards/AllCards"
import { useRouter } from "next/router"
import {FavoriteContext} from "@/store/Context"
import { useState , useEffect , useContext } from "react"
export default function FavouriteList(){
    const r = useRouter()
    const [movies , setMovies] = useState(null)
    const {clicked , setClicked} = useContext(FavoriteContext)
    const get_list = async() =>{
        try {
            const response = await fetch("/api/getToken");
            const data = await response.json();
            if(!data.user){
               
                return 
            }
           
            const secondResponse = await fetch(`/api/userFavourite/${data.user.id}`, {
                method: "GET",
                headers: { "content-type": "application/json" },
              });
              
            const secondData = await secondResponse.json();
            console.log(secondData)
            if (secondData.data){
                console.log(secondData.data)
                setMovies(secondData.data)
            }
            
          } catch (error) {
            console.error("Error during fetch calls", error);
          }    
    }
    useEffect(()=>{
        get_list()
    } , [clicked])

    return (
        <div>
                <h1 className="text-4xl font-bold text-white py-5 px-8 bg-black-800 rounded-lg mx-auto shadow-lg w-fit mt-10">
                    Favourite List
                </h1>
                <AllCards  mov={movies} title="" delete_btn={true} />
        </div>
       
    )
}