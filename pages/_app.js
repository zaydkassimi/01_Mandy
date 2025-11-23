import "../styles/globals.css";
import Header from "../components/Header";
import { useRouter } from "next/router";
import Head from "next/head";
import { ToastProvider } from "../components/ToastContext";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideHeader = router.pathname === "/login" || router.pathname === "/signup";
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!hideHeader && <Header />}
      <ToastProvider>
        <main className="container">
          <Component {...pageProps} />
        </main>
      </ToastProvider>
    </>
  );
}


