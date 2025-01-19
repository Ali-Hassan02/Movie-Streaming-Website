import Image from "next/image";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar/Navbar";
import Homee from "@/components/Home/Home"


export default function Home({data , movies_data}) {
  return (
    <div >

        <Homee bg_movie={data} movies_data = {movies_data}/>
    </div>
   

  );
}

export async function getServerSideProps() {
  const res1 = await fetch(`http://localhost:3000/api/home_cover/Venom`);
  const data = await res1.json();
  const res2 = await fetch('http://localhost:3000/api/trendingMovies')
 
  const trending_mov = await res2.json()
  const res3 = await fetch('http://localhost:3000/api/RecentlyAdded')
  const rec_add = await res3.json()
  const movies_data = {
    trendingMovies: trending_mov.trendingMovies,
    recently_added_movies : rec_add.movies
  }
  

  return {
    props: {
      data , movies_data
    },
  };
}
