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

  const slideRef = React.createRef<HTMLDivElement>();
  const arrowRef = React.createRef<HTMLDivElement>();

  let width = Math.min(window.innerWidth, 1440)
  const isTouchScreen = window.matchMedia('(pointer: coarse)').matches;
  let bannerStyle = {}
  let arrowStyle = {}

  const TimerID = useRef<any>([])

  const onClickHandler = (i: number) => {
    if (i !== 1) {
      let bar = document.getElementById("banner_bar" + String(CurrentSlide));
      if (bar === null) {
        console.log("can not find target bar")
      } else {
        bar.style.filter = "brightness(50%)";
      }
    }
    setCurrentSlide(i)
  }

  const stopBanner = () => {
    for (let i = 0 ; i <TimerID.current.length ; i ++) {
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
      <div className="banner-positionBar">
        {bars}
      </div>
    </div>);
}

export function Banner_main1({ width }: any) {
  return (<div className="banner-main main1-background">
    <div className="banner-main-slogan main1-slogan1">"이어봐에는 수많은 엔딩이 존재합니다🕵️‍♂️"</div>
    <div className="banner-main-slogan main1-slogan2">이 순간에도 많은 이야기들이 재생산되고 있습니다. 탐험하세요!</div>
    <button className="banner-main-button main1-button1"
      onClick={() => { window.scrollTo({ top: width * 3 / 7, left: 0, behavior: 'smooth' }) }}>
      스토리 플레이하기
    </button>
  </div>);
}

export function Banner_main2(props: any) {
  const { isModalVisible, setIsModalVisible } = props
  return (<div className="banner-main main2-background">
    <div className="banner-main-slogan main2-emoji1">👨‍💻</div>
    <div className="banner-main-slogan main2-slogan1">피드백을 요청합니다!</div>
    <div className="banner-main-slogan main2-slogan2">더 멋진 서비스를 위해 여러분의 의견을 남겨주세요.</div>
    <button className="banner-main-button main2-button1" onClick={() => setIsModalVisible(true)}>
      피드백 남기기
    </button>
    <ContactUs isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
  </div>);
}

export function Banner_main3({ width }: any) {
  return (<div className="banner-main main3-background">
    <div className="banner-main-slogan main3-slogan1">선택의 길과 마주하세요🧭</div>
    <div className="banner-main-slogan main3-slogan2">각각의 선택은 모두 다른 스토리로 이어질 것입니다.</div>
    <div className="banner-main-slogan main3-slogan3">"이야기가 맘에들지 않다구요? 그럼 자신의 스토리로 이어보세요!"</div>
    <button className="banner-main-button main3-button1"
      onClick={() => { window.scrollTo({ top: width * 3 / 7, left: 0, behavior: 'smooth' }) }}>
      스토리 이으러가기
    </button>
  </div>);
}

export function Banner_main4({ replace }: Props_type) {
  return (<div className="banner-main main4-background">
    <div className="banner-main-slogan main4-slogan1">같이 나누고 싶은 이야기가 있나요?</div>
    <div className="banner-main-slogan main4-slogan2">"이어봐에서 펼쳐보세요!"</div>
    <div className="banner-main-slogan main4-slogan3">당신의 캐릭터와 배경으로 새로운 게임을 생성할 수 있습니다.</div>
    <NewGameButton replace={replace} />
  </div>);
}