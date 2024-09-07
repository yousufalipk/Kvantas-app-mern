import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { loader1, loader2, loader3, loader4 } from "../../assets";

const ImageSlider = ({ onFinish }) => {
  const images = [loader1, loader2, loader3, loader4];

  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <></>,
    prevArrow: <></>,
    afterChange: (current) => {
      setActiveSlide(current);
    },
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "30px", width: "100%" }}>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={` ${i === activeSlide ? " bg-blue-700" : "bg-white"}`}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          opacity: i === activeSlide ? 1 : 0.75,
        }}
      ></div>
    ),
  };

  const handleImageClick = () => {
    if (activeSlide === images.length - 1) {
      onFinish();
    } else if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div>
      <Slider ref={sliderRef} {...settings} className="custom-slider">
        {images.map((image, index) => (
          <div key={index} onClick={handleImageClick}>
            <img
              src={image}
              alt={`Slide ${index}`}
              style={{ width: "100%", height: "100vh", cursor: "pointer" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
