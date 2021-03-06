import React, { useEffect, useState, useRef } from "react"
import { NewGameButton } from "./LandingPage_buttons";
import ContactUs from "../Footer/ContactUs"
import { SVG, Circle } from "../../svg/icon";
import "./LandingPage_banners.css"

interface Props_type {
  replace: Function;
}

const TOTAL_SLIDES = 5;

export function Banner_main({ replace }: Props_type) {
  const [CurrentSlide, setCurrentSlide] = useState(1);
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [IsLoaded, setIsLoaded] = useState(false);
  const [width, setWidth] = useState(Math.min(window.innerWidth, 1440));

  const slideRef = React.createRef<HTMLDivElement>();
  const arrowRef = React.createRef<HTMLDivElement>();

  const isTouchScreen = window.matchMedia('(pointer: coarse)').matches;
  let bannerStyle = {}
  let arrowStyle = {}
  let positionBarStyle = { top: "90%"  }

  const TimerID = useRef<any>([])

  const onClickHandler = (i: number) => {
    if (CurrentSlide !== 0) {
      let bar = document.getElementById("banner_bar" + String(CurrentSlide));
      if (bar === null) {
        console.log("can not find target bar")
      } else {
        bar.style.filter = "brightness(50%)";
      }
    }
    if(i==0  && isTouchScreen){
      setCurrentSlide(1)
    }else{
      setCurrentSlide(i)
    }
  }

  const stopBanner = () => {
    for (let i = 0; i < TimerID.current.length; i++) {
      clearTimeout(TimerID.current[i])
    }
    TimerID.current = []
  }

  const startBanner = () => {
    const timer = setTimeout(() => {
      nextBanner()
    }, CurrentSlide == 0 ? 0 : 10000);
    TimerID.current.push(timer)
  }

  const nextBanner = () => {
    if (CurrentSlide >= TOTAL_SLIDES - 1) {
      onClickHandler(0)
    } else {
      onClickHandler(CurrentSlide + 1)
    }
  }

  function handleResize() {
    setWidth(Math.min(window.innerWidth, 1440))
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (!isTouchScreen) {
      startBanner()
    }
    if (slideRef.current) {
      if (CurrentSlide != 0 && IsLoaded) {
        slideRef.current.style.transition = "all 1s ease-in-out";
      } else {
        slideRef.current.style.transition = "all 0s";
      }
      setIsLoaded(true);
      slideRef.current.style.transform = `translateX(-${CurrentSlide * 100 / TOTAL_SLIDES}%)`;
    }

    //* bar
    if (CurrentSlide !== 0) {
      let bar = document.getElementById("banner_bar" + String(CurrentSlide));
      if (bar === null) {
        console.log("can not find target bar")
      } else {
        bar.style.filter = "brightness(100%)";
      }
    }

    return () => {
      if (!isTouchScreen) {
        stopBanner()
      }
    }
  }, [CurrentSlide])


  if (isTouchScreen) {
    arrowStyle = { opacity: 0.5 }
  }

  if (width > 767) {
    bannerStyle = { height: width * 3 / 7 }
    positionBarStyle = { top: `${width * 3 / 7 * 0.9}px` }
  }

  //* bars
  const bars = [];
  for (let i = 1; i <= TOTAL_SLIDES - 1; i++) {
    bars.push(
      <div id={`banner_bar${i}`} className="banner-bar" key={`${i}`}
        onClick={() => { onClickHandler(i) }}>
        <Circle />
      </div>
    )
  }

  return (
    <div>
      <div className="banner-container" ref={slideRef} style={bannerStyle}>
        <Banner_main2 isModalVisible={IsModalVisible} setIsModalVisible={setIsModalVisible} />
        <Banner_main1 width={width} />
        <Banner_main3 width={width} />
        <Banner_main4 replace={replace} />
        <Banner_main2 isModalVisible={IsModalVisible} setIsModalVisible={setIsModalVisible} />

      </div>
      <div
        className="banner-right-arrow"
        ref={arrowRef}
        onClick={() => { nextBanner(); }}
        style={arrowStyle}>
        <SVG src="arrow_1" width="100%" height="100%" color="#F5F5F5" />
      </div>
      <div className="banner-positionBar" style={positionBarStyle}>
        {bars}
      </div>
    </div>);
}

export function Banner_main1({ width }: any) {
  return (<div className="banner-main main1-background">
    <div className="banner-main-slogan main1-slogan1">"??????????????? ????????? ????????? ???????????????????????????????"</div>
    <div className="banner-main-slogan main1-slogan2">??? ???????????? ?????? ??????????????? ??????????????? ????????????. ???????????????!</div>
    <button className="banner-main-button main1-button1"
      onClick={() => { window.scrollTo({ top: width * 3 / 7, left: 0, behavior: 'smooth' }) }}>
      ????????? ???????????????
    </button>
  </div>);
}

export function Banner_main2(props: any) {
  const { isModalVisible, setIsModalVisible } = props
  return (<div className="banner-main main2-background">
    <div className="banner-main-slogan main2-emoji1">???????????</div>
    <div className="banner-main-slogan main2-slogan1">???????????? ???????????????!</div>
    <div className="banner-main-slogan main2-slogan2">??? ?????? ???????????? ?????? ???????????? ????????? ???????????????.</div>
    <button className="banner-main-button main2-button1" onClick={() => setIsModalVisible(true)}>
      ????????? ?????????
    </button>
    <ContactUs isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
  </div>);
}

export function Banner_main3({ width }: any) {
  return (<div className="banner-main main3-background">
    <div className="banner-main-slogan main3-slogan1">????????? ?????? ???????????????????</div>
    <div className="banner-main-slogan main3-slogan2">????????? ????????? ?????? ?????? ???????????? ????????? ????????????.</div>
    <div className="banner-main-slogan main3-slogan3">"???????????? ???????????? ????????????? ?????? ????????? ???????????? ???????????????!"</div>
    <button className="banner-main-button main3-button1"
      onClick={() => { window.scrollTo({ top: width * 3 / 7, left: 0, behavior: 'smooth' }) }}>
      ????????? ???????????????
    </button>
  </div>);
}

export function Banner_main4({ replace }: Props_type) {
  return (<div className="banner-main main4-background">
    <div className="banner-main-slogan main4-slogan1">?????? ????????? ?????? ???????????? ??????????</div>
    <div className="banner-main-slogan main4-slogan2">"??????????????? ???????????????!"</div>
    <div className="banner-main-slogan main4-slogan3">????????? ???????????? ???????????? ????????? ????????? ????????? ??? ????????????.</div>
    <NewGameButton replace={replace} />
  </div>);
}