import React from 'react';
import {
  MDBCarousel,
  MDBCarouselItem,
  MDBBtn,
  MDBIcon,
  MDBContainer,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
  return (
    <div className="hero-carousel-wrapper position-relative">
      <MDBCarousel showIndicators showControls fade interval={5000}>
        <MDBCarouselItem itemId={1}>
          <div
            className="carousel-image-slide"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')",
            }}
          >
            <MDBContainer className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-white">
              <span className="badge rounded-pill bg-warning text-dark px-3 py-2 mb-3 fw-bold text-uppercase tracking-wider">
                Luxury Hospitality Experience
              </span>
              <h1 className="hero-headline display-3 fw-bold mb-3">
                Experience Unrivaled Elegance & Comfort
              </h1>
              <p className="hero-subtext lead col-lg-8 mb-4">
                Discover bespoke rooms, breathtaking skyline views, five-star dining, and personalized hospitality at HotelPro.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link to="/home">
                  <MDBBtn color="warning" size="lg" className="px-4 py-3 fw-bold shadow-lg rounded-pill text-dark">
                    <MDBIcon fas icon="calendar-alt" className="me-2" /> Book Your Stay Now
                  </MDBBtn>
                </Link>
                <Link to="/rooms">
                  <MDBBtn outline color="light" size="lg" className="px-4 py-3 rounded-pill">
                    <MDBIcon fas icon="images" className="me-2" /> View Suites
                  </MDBBtn>
                </Link>
              </div>
            </MDBContainer>
          </div>
        </MDBCarouselItem>

        <MDBCarouselItem itemId={2}>
          <div
            className="carousel-image-slide"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80')",
            }}
          >
            <MDBContainer className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-white">
              <span className="badge rounded-pill bg-info text-white px-3 py-2 mb-3 fw-bold text-uppercase tracking-wider">
                Exquisite Oceanfront Retreat
              </span>
              <h1 className="hero-headline display-3 fw-bold mb-3">
                Serene Escapes & Private Villas
              </h1>
              <p className="hero-subtext lead col-lg-8 mb-4">
                Wake up to soothing ocean waves and warm sunsets from your private panoramic balcony.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link to="/home">
                  <MDBBtn color="warning" size="lg" className="px-4 py-3 fw-bold shadow-lg rounded-pill text-dark">
                    <MDBIcon fas icon="search" className="me-2" /> Check Availability
                  </MDBBtn>
                </Link>
              </div>
            </MDBContainer>
          </div>
        </MDBCarouselItem>

        <MDBCarouselItem itemId={3}>
          <div
            className="carousel-image-slide"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=80')",
            }}
          >
            <MDBContainer className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-white">
              <span className="badge rounded-pill bg-success text-white px-3 py-2 mb-3 fw-bold text-uppercase tracking-wider">
                World-Class Amenities
              </span>
              <h1 className="hero-headline display-3 fw-bold mb-3">
                Fine Dining, Spa & Infinite Horizons
              </h1>
              <p className="hero-subtext lead col-lg-8 mb-4">
                Indulge in our heated infinity pool, thermal luxury spa, and award-winning Michelin-star restaurant.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link to="/home">
                  <MDBBtn color="warning" size="lg" className="px-4 py-3 fw-bold shadow-lg rounded-pill text-dark">
                    <MDBIcon fas icon="concierge-bell" className="me-2" /> Reserve Your Suite
                  </MDBBtn>
                </Link>
              </div>
            </MDBContainer>
          </div>
        </MDBCarouselItem>
      </MDBCarousel>
    </div>
  );
};

export default HeroCarousel;
