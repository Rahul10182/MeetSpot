import React from 'react';
import Slider from "react-slick";
import dataHomes from "../../Data/dataHome";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./arrow.css"; // Import custom styles for arrows

const Sliderbar = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-8">Explore Meeting Places</h2>
      <Slider {...settings}>
        {dataHomes.map((place) => (
          <div key={place.id} className="p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={place.imgSrc}
                alt={place.title}
                className="w-full h-96 object-cover"
              />
              <div>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex-1 pr-4 mx-32">
                    <h3 className="text-lg font-bold text-gray-800">{place.title}</h3>
                    <p className="text-gray-600 mt-2">{place.description}</p>
                  </div>
                  <button className="px-4 py-2 mx-32 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Let’s MeetUp
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Sliderbar;
