import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import PropTypes from 'prop-types';
import { SMALL_IMG_BASE_URL } from '../utils/constants';

const MovieCarousel = ({ items, onSlideClick = () => {} }) => {
  return (
    <Swiper
      slidesPerView={'auto'}
      spaceBetween={30}
      pagination={{ clickable: true }}
      modules={[Pagination]}
      className="movieCarousel"
    >
      {items.map(item => (
        <SwiperSlide key={item.id} style={{ width: '200px' }}>
          <div
            className="movieCarouselSlide cursor-pointer"
            onClick={() => onSlideClick(item)}
          >
            <img
              src={`${SMALL_IMG_BASE_URL}${item.image}`}
              alt={item.title}
              className="w-full h-44 object-cover rounded-lg"
            />
            <h3 className="mt-2 text-white text-sm font-medium truncate">
              {item.title}
            </h3>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

MovieCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      image: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
  onSlideClick: PropTypes.func,
};

export default MovieCarousel;