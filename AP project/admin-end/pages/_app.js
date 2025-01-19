

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "@/styles/globals.css";
import Layout from "@/components/layout";
import { useEffect} from 'react';
import ActionProvider from '@/store/action'; 

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    typeof document !== undefined ? import("bootstrap/dist/js/bootstrap.bundle.min") : null;
  }, []);

  return (
    <ActionProvider>
      <Layout>
        
          <Component {...pageProps} />
        
      </Layout>
    </ActionProvider>
  );
}

export default MyApp;