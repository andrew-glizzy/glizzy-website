import Head from 'next/head'
import Media from "react-media";
import { useEffect, useRef, useState } from "react";

import { MOBILE_WIDTH, colors } from "../utils/consts";
import styles from '../styles/Home.module.css'
import client, { frontPagePosterQuery, frontPageAnimationQuery } from "../utils/contentful";


const Home = ({ mobilePosterUrl, desktopPosterUrl, mobileVideos, desktopVideos }) => {
  const [posterUrl, setPosterUrl] = useState("");
  const [videos, setVideos] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const onMobile = window.innerWidth < MOBILE_WIDTH;
    setPosterUrl(onMobile ? mobilePosterUrl : desktopPosterUrl);
    setVideos(onMobile ? mobileVideos : desktopVideos);
  }, []);

  useEffect(() => {
    if (!videos) {
      return;
    }
    videoRef.current?.load();
  }, [videos]);

  return (
    <div style={{ backgroundColor: colors.BACKGROUND }}>
      <Head>
        <title>GLIZZY</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Your favorite creators in the palm of your hand." />
        <meta name="theme-color" content={colors.BACKGROUND} />
      </Head>
      <Media
        queries={{
          mobile: `all and (max-width: ${MOBILE_WIDTH}px)`,
          desktop: `all and (min-width: ${MOBILE_WIDTH + 1}px)`
        }}
      >
        {matches => {
          setVideos(matches.mobile ? mobileVideos : desktopVideos);
          setPosterUrl(matches.mobile ? mobilePosterUrl : desktopPosterUrl);
          return null;
        }}
      </Media>
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
        className={styles.video}
        width="100%"
        height="100%"
        ref={videoRef}
      >
        {videos && videos.map(v => <source src={v.video.url} type={v.contentType} key={v.video.url} />)}
      </video>
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

  const {
    data: {
      frontPageBgPosterCollection: {
        items: images
      }
    }
  } = await client.query({ query: frontPagePosterQuery });

  return {
    props: { 
      mobileVideos: videos.filter(v => v.isMobile === true),
      desktopVideos: videos.filter(v => v.isMobile === false),
      mobilePosterUrl: images.filter(img => img.isMobile === true)[0]?.image.url || null,
      desktopPosterUrl: images.filter(img => img.isMobile === false)[0]?.image.url || null,
    },
    revalidate: 600
  }
}

export default Home;