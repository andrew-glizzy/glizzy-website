import '../styles/globals.css'
import { colors } from "../utils/consts";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          background: ${colors.BACKGROUND};
        }
      `}</style>
    </div>
  )
}

export default MyApp;
