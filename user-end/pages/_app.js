import Navbar from "@/components/Navbar/Navbar";
import "@/styles/globals.css";
import { useRouter } from 'next/router';
import FavouriteProvider from "@/store/Context"

export default function App({ Component, pageProps }) {
  const r = useRouter()
  const isLogin = (r.pathname === '/login' || r.pathname === '/signup') 
  return (<>
  {
    !isLogin && <Navbar />
  }
    <FavouriteProvider>

    <Component {...pageProps} />;
    </FavouriteProvider>
    
  </>)
}
