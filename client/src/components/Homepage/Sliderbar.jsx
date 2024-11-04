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
    <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-100">
      <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-10">Explore Meeting Places</h2>
      <Slider {...settings}>
        {dataHomes.map((place) => (
          <div key={place.id} className="p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={place.imgSrc}
                alt={place.title}
                className="w-full h-96 object-cover rounded-t-lg"
              />
              <div>
                <div className="p-6 flex flex-col md:flex-row md:justify-between items-center">
                  <div className="flex-1 md:pr-8">
                    <h3 className="text-xl font-semibold text-gray-800">{place.title}</h3>
                    <p className="text-gray-600 mt-2 leading-relaxed">{place.description}</p>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300">
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
