import '../styles/globals.css'
import type { AppProps } from 'next/app'

function Iris({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default Iris;
