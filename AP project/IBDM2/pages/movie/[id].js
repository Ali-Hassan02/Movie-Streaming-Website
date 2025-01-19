import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Divider from "../../components/Divider/Divider";
import CardSlider from "@/components/CardSlider/CardSlider";
import ProtectedActions from "@/components/ProtectedActions";

export default function DetailsPage({ data }) {
  const r = useRouter();
  const id = r.query.id;

  const [movie, setMovie] = useState(null);
  useEffect(() => {
    if (!r.isReady) return;
    setMovie(data);
  }, [r.isReady, r.query]);

  const handlePlayMovie = (movieData) => {
    r.push({
      pathname: "/watch",
      query: { movie: JSON.stringify(movieData) },
    });
  };

  return (
    <>
      {movie && (
        <div className="flex flex-col min-h-screen">
          {/* Fixed here */}
          <div className="w-full h-[280px] relative hidden lg:block">
            <div className="w-full h-full">
              <img
                src={`http://localhost:3001/api/photo?filename=${movie.thumbnail}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900/90 to-transparent"></div>
          </div>
          <div className="container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10 ">
            <div className="relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60">
              <img
                src={`http://localhost:3001/api/photo?filename=${movie.thumbnail}`}
                className="h-80 w-60 object-cover rounded"
              />
              <button
                onClick={() => handlePlayMovie(movie)}
                className="mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition-all"
              >
                Play Now
              </button>
            </div>

            <div className="w-full">
              <ProtectedActions id={id} />
              <h1
                className="text-5xl font-bold mb-4"
                style={{ color: "#F5C518" }}
              >
                {movie.title}
              </h1>

              

              <Divider />

              <div className="flex items-center gap-3 text-neutral-400 text-2xl">
                <p>
                  <b className = "text-white">Rating :</b> {movie.rating}
                </p>
                <span>|</span>
                <p>
                  <b className = "text-white">Duration :</b>
                  {Math.floor(movie.duration) > 0
                    ? ` ${Math.floor(movie.duration)} hour${
                        Math.floor(movie.duration) > 1 ? "s" : ""
                      } and ${Math.round(
                        (movie.duration - Math.floor(movie.duration)) * 60
                      )} minute${
                        Math.round(
                          (movie.duration - Math.floor(movie.duration)) * 60
                        ) > 1
                          ? "s"
                          : ""
                      }`
                    : ` ${Math.round(movie.duration * 60)} minute${
                        Math.round(movie.duration * 60) > 1 ? "s" : ""
                      }`}
                </p>
              </div>
              <Divider />

              <div>
                <h3 className="font-bold text-white mb-1 text-2xl">Overview</h3>
                <p className="text-neutral-400 text-2xl ">{movie.description}</p>

                <Divider />
                <div className="flex items-center gap-3 my-3 text-center text-neutral-400 text-2xl">
                  <p>
                    <b className = "text-white">Type : </b>
                    {movie.type}
                  </p>
                  <span>|</span>
                  <p>
                    <b className = "text-white">Release Date : </b>{" "}
                    {new Date(movie.releaseDate).toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>
              <Divider />

              <div className="flex items-center gap-3 my-3 text-center text-neutral-400 text-2xl">
                <p>
                  <b className = "text-white">Genre : </b>
                  {movie.genres.map((g) => {
                    return ` ${g} | `;
                  })}
                </p>
              </div>
              <Divider />

              <div className="flex items-center gap-3 my-3 text-center text-neutral-400  text-2xl">
                <p>
                  <b className = "text-white">Directors : </b>
                  {movie.directors.map((g) => {
                    return ` ${g.name} | `;
                  })}
                </p>
              </div>
              <Divider />

              <div className="flex items-center gap-3 my-3 text-center text-neutral-400  text-2xl">
                <p>
                  <b className = "text-white">Producers : </b>
                  {movie.producers.map((g) => {
                    return ` ${g.name} | `;
                  })}
                </p>
              </div>
              <Divider />

              <h2 className="font-bold text-white  text-2xl">Cast :</h2>

              <div className="grid grid-cols-[repeat(auto-fit,96px)] gap-5 my-4">
                {movie.actors.map((starCast, index) => {
                  return (
                    <div key={index}>
                      <div>
                        <img
                          src={`http://localhost:3001/api/photo?filename=${starCast.image}`}
                          className="w-24 h-24 object-cover rounded-full"
                        />
                      </div>
                      <p className="font-bold text-center text-sm text-neutral-400">
                        {starCast.name}
                      </p>
                    </div>
                  );
                })}
              </div>
              <Divider />
            </div>
          </div>
          <CardSlider title={movie.genres[0]} heading="Similar Movies" />
          {/* Footer */}
          <footer className="bg-neutral-900 text-white py-4 mt-auto">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Movie App. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const id = context.query.id;

  const res1 = await fetch(`http://localhost:3000/api/movie/${id}`);
  const data = await res1.json();

  return {
    props: {
      data: data.movie,
    },
  };
}
