import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { SnackBarProvider } from "../context/SnackBarContext";
import ThemeContext from "../context/ThemeContext";
import "../styles/globals.css";

/**
 * Wraps all pages in the application with a theme context, a snack bar provider and a layout.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeContext>
      <SnackBarProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SnackBarProvider>
    </ThemeContext>
  );
}

export default MyApp;
