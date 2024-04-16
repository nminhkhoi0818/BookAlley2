import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default class SliderComponent extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div>
        <Slider {...settings}>
          <div>
            <img src="/images/Banner_01.png" alt="" />
          </div>
          <div>
            <img src="/images/Banner_02.png" alt="" />
          </div>
        </Slider>
      </div>
    );
  }
}
