import { useRouter } from 'next/router';
import { ArrowBackOutlined } from "@mui/icons-material";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Watch() {
  const router = useRouter();
  const { query } = router;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (query.movie) {
      // Parse the movie data from the query string
      console.log(query.movie);
      setMovie(JSON.parse(query.movie));
    }
  }, [query]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="watch">
      <Link href="/">
        <div className="back flex items-center space-x-2 p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all">
          <ArrowBackOutlined className="text-xl" />
          <span className="text-lg font-semibold">Home</span>
        </div>
      </Link>
      <div className="video-container">
        {/* <video
          className="video"
          autoPlay
          controls
          src={movie.trailer}
          style={{ width: "100vw", height: "90vh" }}
        /> */}
        <iframe
          src={movie.trailer}
          className="w-full h-[92vh] border-none" // Adjust the height here
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
