import Footer from "./footer";
import Nav from "./navbar";
import { useRouter } from "next/router";
const Layout = ({ children }) => {
  const router = useRouter();
  
  const isNotLogin = router.pathname !== '/';
  return (
    <div className="layout">
      {isNotLogin && <Nav />}
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
