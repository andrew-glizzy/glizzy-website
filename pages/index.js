import Head from 'next/head'

import { colors } from "../utils/consts";
import styles from '../styles/Home.module.css'

import client, { frontPageAnimationQuery, frontPagePosterQuery } from '../utils/contentful';


const Home = ({ posterUrl, videos }) => {
  return (
    <div style={{ backgroundColor: colors.BACKGROUND }}>
      <Head>
        <title>GLIZZY</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Your favorite creators in the palm of your hand." />
      </Head>
      {
        posterUrl &&
        <video autoPlay loop muted playsInline poster={posterUrl} className={styles.video} width="100%" height="100%">
          {
            videos.map((v) => (
              <source src={v.video.url} type={v.contentType} key={v.video.url} />
            ))
          }
        </video>
      }
      </div>
  )
}

export async function getStaticProps () {
  const { 
    data: {
      frontPageBgAnimationCollection: { 
        items: videos 
      }
    }
  } = await client.query({ query: frontPageAnimationQuery });

  let posterUrl;
  try {
    const images = await client.query({ query: frontPagePosterQuery });
    posterUrl = images.data.frontPageBgPosterCollection.items[0].image.url || null;
  } catch (err) {
    console.error(`Fetching ${frontPagePosterQuery} threw the following error: ${err}.`);
    posterUrl = "";
  }

  return {
    props: { videos, posterUrl },
    revalidate: 600
  }
}

export default Home;