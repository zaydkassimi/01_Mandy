import "../styles/globals.css";
import Header from "../components/Header";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideHeader = router.pathname === "/login" || router.pathname === "/signup";
  return (
    <>
      {!hideHeader && <Header />}
      <main className="container">
        <Component {...pageProps} />
      </main>
    </>
  );
}


