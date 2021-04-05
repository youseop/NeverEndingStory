import React, { useEffect, useState } from "react"
import { NewGameButton } from "./LandingPage_buttons";
import ContactUs from "../Footer/ContactUs"
import { SVG } from "../../svg/icon";
import "./LandingPage_banners.css"

interface Props_type {
  replace: Function;
}

const TOTAL_SLIDES = 3;

export function Banner_main({ replace }: Props_type) {
  const [CurrentSlide, setCurrentSlide] = useState(0);
  const [TimerID, setTimerID] = useState<NodeJS.Timeout | undefined>(undefined);
  const [IsModalVisible, setIsModalVisible] = useState(false);

  const slideRef = React.createRef<HTMLDivElement>();
  const arrowRef = React.createRef<HTMLDivElement>();

  const stopBanner = () => {
    if (TimerID) {
      clearTimeout(TimerID);
    }
  }

  const startBanner = () => {
    const timer = setTimeout(() => {
      nextBanner()
    }, CurrentSlide == 0 ? 0 : 3000);
    setTimerID(timer)
  }

  const nextBanner = () => {
    if (CurrentSlide >= TOTAL_SLIDES - 1) {
      setCurrentSlide(0)
    } else {
      setCurrentSlide(CurrentSlide + 1)
    }
  }

  useEffect(() => {
    if (slideRef.current) {
      if (CurrentSlide != 0) {
        slideRef.current.style.transition = "all 1s ease-in-out";
      } else {
        slideRef.current.style.transition = "all 0s";
      }
      slideRef.current.style.transform = `translateX(-${CurrentSlide * 100 / TOTAL_SLIDES}%)`;
    }
    startBanner()
    return () => {
      stopBanner()
    }
  }, [CurrentSlide])

  return (
    <div>
      <div className="banner-container" ref={slideRef}
        onMouseEnter={() => stopBanner()} onMouseLeave={() => startBanner()}>
        <Banner_main1 replace={replace} />
        <Banner_main2 isModalVisible={IsModalVisible} setIsModalVisible={setIsModalVisible} />
        <Banner_main1 replace={replace} />
      </div>
      <div
        className="banner-right-arrow"
        ref={arrowRef}
        onClick={() => { nextBanner(); }}>
        <SVG src="arrow_1" width="100" height="100" color="#F5F5F5" />
      </div>
    </div>);
}

export function Banner_main1({ replace }: Props_type) {
  return (<div className="banner-main1">
    <div className="banner-main1-slogan1">NEVER ENDING</div>
    <div className="banner-main1-slogan2">함께 만드는 무한한 이야기</div>
    <NewGameButton replace={replace} />
  </div>);
}

export function Banner_main2(props: any) {
  const { isModalVisible, setIsModalVisible } = props
  return (<div className="banner-main2">
    <div className="banner-main2-imoji">👨‍💻</div>
    <div className="banner-main2-slogan1">피드백을 요청합니다!</div>
    <div className="banner-main2-slogan2">더 멋진 서비스를 위해 여러분의 의견을 남겨주세요.</div>
    <button className="banner-main2-button" onClick={() => setIsModalVisible(true)}>
      피드백 남기기
    </button>
    <ContactUs isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
  </div>);
}