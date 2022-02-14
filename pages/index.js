import Head from "next/head";
import Media from "react-media";
import { useEffect, useRef, useState } from "react";

import TwitterIcon from "../assets/icons/twitter.svg";
import InstagramIcon from "../assets/icons/instagram.svg";
import TikTokIcon from "../assets/icons/tiktok.svg";

import { MOBILE_WIDTH, colors } from "../utils/consts";
import { useScrollBlock } from '../utils/hooks';
import styles from '../styles/Home.module.css'
import client, {
  frontPageArrowQuery,
  frontPagePosterQuery,
  frontPageAnimationQuery,
  frontPageSketchQuery, }
from "../utils/contentful";


const Home = ({ 
  mobilePosterUrl,
  desktopPosterUrl,
  mobileVideos,
  desktopVideos,
  mobileSketchUrl,
  desktopSketchUrl,
  arrowUrl,
}) => {
  // TODO: only show videos if phone is not in low battery mode

  const [posterUrl, setPosterUrl] = useState("");
  const [sketchUrl, setSketchUrl] = useState("");
  const [videos, setVideos] = useState(null);
  const [isMobile, setIsMobile] = useState(null);
  const [sketchLoaded, setSketchLoaded] = useState(false);
  const videoRef = useRef({});

  const [blockScroll, allowScroll] = useScrollBlock();

  useEffect(() => {
    // remove scrolling and rotation
    blockScroll();
  
    // get if on mobile for optimal loading
    const onMobile = window.innerWidth < MOBILE_WIDTH;
    setIsMobile(onMobile);
    setPosterUrl(onMobile ? mobilePosterUrl : desktopPosterUrl);
    setVideos(onMobile ? mobileVideos : desktopVideos);
    setSketchUrl(onMobile ? mobileSketchUrl : desktopSketchUrl);
  }, []);

  useEffect(() => {
    if (!videos) {
      return;
    }
    setVideos(isMobile ? mobileVideos : desktopVideos);
    setPosterUrl(isMobile ? mobilePosterUrl : desktopPosterUrl);
    setSketchUrl(isMobile ? mobileSketchUrl: desktopSketchUrl);
    videoRef.current?.load();
  }, [isMobile]);

  return (
    <div style={{ backgroundColor: colors.BACKGROUND }} className={styles.container}>
      <Head>
        <title>GLIZZY</title>
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://images.ctfassets.net" />
        <link rel="dns-prefetch" href="https://images.ctfassets.net" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color={colors.GLIZZYPINK} />
        <meta name="msapplication-TileColor" content={colors.BACKGROUND}></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0" />
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
        poster={posterUrl}
        className={styles.video}
        width="100%"
        height="100%"
        ref={videoRef}
      >
        {videos && videos.map(v => <source src={v.video.url} type={v.contentType} key={v.video.url} />)}
      </video>
      {
        sketchUrl && (
          <img
            src={sketchUrl}
            width="100%"
            height="100%"
            type="image/png"
            className={styles.video}
            style={{ zIndex: 1 }}
            onLoad={() => setSketchLoaded(true)}
            alt="sketches"
          />
        )
      }
      <div></div>
      <div className={styles.textContainer}>
        <div className={styles.mainTextContainer}>
          <div className={styles.logoContainer}>
            <span className={styles.logo}>GLIZZY</span>
          </div>
          <div className={styles.sloganContainer}>
            <span className={styles.slogan}>YOUR FAVORITE CREATORS IN THE PALM OF YOUR HAND.</span>
          </div>
        </div>
      </div>
      <div className={styles.shopContainer}>
        <span className={styles.shop}>[ COMING SOON ]</span>
        {
          arrowUrl && (
            <img
              src={arrowUrl}
              width={100}
              height={75}
              alt="arrow sketch"
              className={styles.arrow}
              style={{ opacity: sketchLoaded ? 1 : 0 }}
            />
          )
        }
      </div>
      <div></div>
      <div className={styles.footer}>
        <div className={styles.copyrightContainer}>
          <span className={styles.copyright}>{"\u00A92022 GLIZZY LABS LLC"}</span>
        </div>
        <div className={styles.socialMediaContainer}>
          <a href="https://twitter.com/getglizzy" className={styles.socialMediaIcon} title="Twitter">
            <TwitterIcon fill={colors.SOCIALMEDIA} />
          </a>
          <a href="https://instagram.com/getglizzy" className={styles.socialMediaIcon} title="Instagram">
            <InstagramIcon fill={colors.SOCIALMEDIA} />
          </a>
          <a href="https://www.tiktok.com/@glizzylabs" className={styles.socialMediaIcon} title="TikTok">
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

  const {
    data: {
      frontPageBgSketchCollection: {
        items: sketchImages
      }
    }
  } = await client.query({ query: frontPageSketchQuery });

  const {
    data: {
      frontPageBgArrowCollection: {
        items: arrowImages
      }
    }
  } = await client.query({ query: frontPageArrowQuery });

  return {
    props: { 
      mobileVideos: videos.filter(v => v.isMobile === true),
      desktopVideos: videos.filter(v => v.isMobile === false),
      mobilePosterUrl: images.filter(img => img.isMobile === true)[0]?.image.url || null,
      desktopPosterUrl: images.filter(img => img.isMobile === false)[0]?.image.url || null,
      mobileSketchUrl: sketchImages.filter(img => img.isMobile === true && img.contentType === "image/png")[0]?.image.url || null,
      desktopSketchUrl: sketchImages.filter(img => img.isMobile === false && img.contentType === "image/png")[0]?.image.url || null,
      arrowUrl: arrowImages[0]?.image.url || null
    },
    revalidate: 600
  }
}

export default Home;