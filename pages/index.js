import Head from 'next/head'
import Media from "react-media";
import { useEffect, useRef, useState } from "react";

import TwitterIcon from "../assets/icons/twitter.svg";
import InstagramIcon from "../assets/icons/instagram.svg";
import TikTokIcon from "../assets/icons/tiktok.svg";

import { MOBILE_WIDTH, colors } from "../utils/consts";
import styles from '../styles/Home.module.css'
import client, { frontPagePosterQuery, frontPageAnimationQuery } from "../utils/contentful";


const Home = ({ mobilePosterUrl, desktopPosterUrl, mobileVideos, desktopVideos }) => {
  // TODO: figure out why the poster doesn't have the same coloring as the video
  // TODO: only show videos if phone is not in low battery mode
  // TODO: remove arrow from video and use it as an image instead

  const [posterUrl, setPosterUrl] = useState("");
  const [videos, setVideos] = useState(null);
  const [isMobile, setIsMobile] = useState(null);
  const videoRef = useRef({});

  useEffect(() => {
    // remove scrolling and rotation
    document.body.style.overflow = "hidden";
  
    // get if on mobile for optimal loading
    const onMobile = window.innerWidth < MOBILE_WIDTH;
    setIsMobile(onMobile);
    setPosterUrl(onMobile ? mobilePosterUrl : desktopPosterUrl);
    setVideos(onMobile ? mobileVideos : desktopVideos);
  }, []);

  useEffect(() => {
    if (!videos) {
      return;
    }
    setVideos(isMobile ? mobileVideos : desktopVideos);
    setPosterUrl(isMobile ? mobilePosterUrl : desktopPosterUrl);
    videoRef.current?.load();
  }, [isMobile]);

  return (
    <div style={{ backgroundColor: colors.BACKGROUND }} className={styles.container}>
      <Head>
        <title>GLIZZY</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Your favorite creators in the palm of your hand." />
        <meta name="theme-color" content={colors.BACKGROUND} />
        <link
          rel="preload"
          href="/fonts/glizzy/glizzy.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/pt-mono/pt_mono_bold_glizzy.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <Media
        queries={{
          mobile: `all and (max-width: ${MOBILE_WIDTH}px)`,
          desktop: `all and (min-width: ${MOBILE_WIDTH + 1}px)`,
          portrait: "screen and (orientation: portrait)",
          landscape: "screen and (orientation: landscape)"
        }}
      >
        {matches => {
          setIsMobile(matches.mobile && matches.portrait);
          return null;
        }}
      </Media>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.video}
        width="100%"
        height="100%"
        ref={videoRef}
      >
        {videos && videos.map(v => <source src={v.video.url} type={v.contentType} key={v.video.url} />)}
      </video>
      <div></div>
      <div className={styles.textContainer}>
        <div className={styles.logoContainer}>
          <span className={styles.logo}>GLIZZY</span>
        </div>
        <div className={styles.sloganContainer}>
          <span className={styles.slogan}>YOUR FAVORITE CREATORS IN THE PALM OF YOUR HAND.</span>
        </div>
        <div className={styles.shopContainer}>
          <span className={styles.shop}>[ COMING SOON ]</span>
        </div>
      </div>
      <div></div>
      <div className={styles.footer}>
        <div className={styles.copyrightContainer}>
          <span className={styles.copyright}>{"\u00A92022 GLIZZY LABS LLC"}</span>
        </div>
        <div className={styles.socialMediaContainer}>
          <a href="https://twitter.com/getglizzy" className={styles.socialMediaIcon}>
            <TwitterIcon fill={colors.SOCIALMEDIA} />
          </a>
          <a href="https://instagram.com/getglizzy" className={styles.socialMediaIcon} >
            <InstagramIcon fill={colors.SOCIALMEDIA} />
          </a>
          <a href="https://www.tiktok.com/@glizzylabs" className={styles.socialMediaIcon} >
            <TikTokIcon fill={colors.SOCIALMEDIA} />
          </a>
        </div>
      </div>
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