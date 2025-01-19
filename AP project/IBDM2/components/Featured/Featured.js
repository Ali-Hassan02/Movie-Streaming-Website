import { InfoOutlined, PlayArrow } from "@mui/icons-material";
import { useEffect, useState} from "react";
import styles from "./Featured.module.css";
import { useRouter } from "next/router";
export default function Featured({ bg_movie , type, setGenre }) {
  const [content, setContent] = useState({});
  const router = useRouter()
  const name = "Venom"
  

  

  // Handle transitions with staggered effect
  useEffect(() => {
    setContent(bg_movie.movie)
    // fetch(`/api/home_cover/${name}`).then(res => res.json()).then(data => setContent(data.movie))
  }, []);

  const handlePlayMovie = () => {
    router.push({
      pathname: '/watch',
      query: { movie: JSON.stringify(content) },
    });
  };

  return (
    <div className={styles.featured}>
      {/* <img className={styles.featuredImg} src={image} alt="" /> */}
      <video
              src={'/trailers/venom.mp4'}
              autoPlay={true}
              loop
              muted
              className={styles.featuredImg}
            />
      <div
        className={`${styles.info} transition-all duration-1000 gap-4`}
      >
        {/* Title */}
        <h1
          className="font-extrabold text-white drop-shadow-md transition-all duration-1000 text-7xl translate-y-0">
          {content.title}
        </h1>

        {/* Description */}
        <h1
          className="lg:text-2xl font-semibold text-white drop-shadow-md transition-all duration-1000 opacity-100 translate-y-0" >
          {content.description}
        </h1>

        {/* Buttons */}
        <div className={styles.buttons}>
          <button className={styles.play} onClick={handlePlayMovie}>
            <PlayArrow />
            <span>Play</span>
          </button>
          <button className={styles.more} onClick={() => router.push(`/movie/${content._id}`)}>
            <InfoOutlined />
            <span>Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
