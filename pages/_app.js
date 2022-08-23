import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Test Thentic</h1>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
