import React, { useState } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';

const RoomCard = ({ room, onBookNow, fromdate, todate }) => {
  const [detailsModal, setDetailsModal] = useState(false);

  const defaultImage =
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  const roomImages =
    room.photos && room.photos.length > 0 ? room.photos : [defaultImage];

  return (
    <>
      <MDBCard className="h-100 shadow-sm border-0 room-card overflow-hidden transition-all">
        <div className="position-relative overflow-hidden room-card-img-wrapper">
          <MDBCardImage
            src={roomImages[0]}
            position="top"
            alt={`Room ${room.roomNumber}`}
            className="room-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
          <div className="room-price-tag">
            <span className="price-currency">$</span>
            <span className="price-amount">{room.rent}</span>
            <span className="price-period">/night</span>
          </div>
          <span className="badge rounded-pill bg-dark bg-opacity-75 room-type-badge text-uppercase">
            {room.type}
          </span>
        </div>

        <MDBCardBody className="d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0 text-dark">Room {room.roomNumber}</h5>
            <span className="badge bg-light text-dark border">
              <MDBIcon fas icon="users" className="me-1 text-primary" /> Max {room.count * 2} Guests
            </span>
          </div>

          <p className="text-muted small text-truncate-2 flex-grow-1 mb-3">
            {room.description}
          </p>

          {/* Quick Amenities Icon Strip */}
          <div className="d-flex gap-3 text-muted small mb-3 border-top border-bottom py-2">
            <span title="High-Speed Wi-Fi">
              <MDBIcon fas icon="wifi" className="text-secondary me-1" /> Free Wi-Fi
            </span>
            <span title="Climate Control">
              <MDBIcon fas icon="snowflake" className="text-secondary me-1" /> AC
            </span>
            <span title="Smart Television">
              <MDBIcon fas icon="tv" className="text-secondary me-1" /> Smart TV
            </span>
          </div>

          <div className="d-flex gap-2 mt-auto">
            <MDBBtn
              color="light"
              className="flex-grow-1 border shadow-none"
              onClick={() => setDetailsModal(true)}
            >
              <MDBIcon fas icon="info-circle" className="me-1" /> Details
            </MDBBtn>
            <MDBBtn
              color="primary"
              className="flex-grow-1 bg-gradient-gold border-0 fw-bold"
              onClick={() => onBookNow(room)}
            >
              <MDBIcon fas icon="calendar-check" className="me-1" /> Book Now
            </MDBBtn>
          </div>
        </MDBCardBody>
      </MDBCard>

      {/* Room Details Modal */}
      <MDBModal open={detailsModal} setOpen={setDetailsModal} tabIndex="-1">
        <MDBModalDialog size="lg" centered>
          <MDBModalContent className="rounded-4 overflow-hidden border-0 shadow-lg">
            <MDBModalHeader className="bg-dark text-white border-0 py-3">
              <MDBModalTitle className="d-flex align-items-center gap-2">
                <MDBIcon fas icon="bed" className="text-warning" />
                Room {room.roomNumber} - {room.type}
              </MDBModalTitle>
              <MDBBtn
                className="btn-close btn-close-white"
                color="none"
                onClick={() => setDetailsModal(false)}
              ></MDBBtn>
            </MDBModalHeader>

            <MDBModalBody className="p-4">
              {roomImages.length > 1 ? (
                <MDBCarousel showIndicators showControls className="rounded-3 overflow-hidden mb-4 shadow-sm">
                  {roomImages.map((imgUrl, index) => (
                    <MDBCarouselItem itemId={index + 1} key={index}>
                      <img
                        src={imgUrl}
                        className="d-block w-100 modal-room-carousel-img"
                        alt={`Room view ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                    </MDBCarouselItem>
                  ))}
                </MDBCarousel>
              ) : (
                <img
                  src={roomImages[0]}
                  alt="Room view"
                  className="w-100 rounded-3 mb-4 modal-room-carousel-img object-cover shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
              )}

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 text-center border">
                    <span className="text-muted small text-uppercase d-block">Nightly Rate</span>
                    <span className="fs-3 fw-bold text-primary">${room.rent}</span>
                    <span className="text-muted small"> / night</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-3 text-center border">
                    <span className="text-muted small text-uppercase d-block">Room Category</span>
                    <span className="fs-4 fw-bold text-dark">{room.type}</span>
                    <span className="text-muted small d-block">Capacity: {room.count * 2} Guests</span>
                  </div>
                </div>
              </div>

              <h6 className="fw-bold mb-2">Room Overview & Features</h6>
              <p className="text-muted lead fs-6">{room.description}</p>

              <h6 className="fw-bold mt-4 mb-3">Included Hotel Amenities</h6>
              <div className="row row-cols-2 row-cols-md-3 g-2 text-muted small">
                <div className="col d-flex align-items-center gap-2">
                  <MDBIcon fas icon="check-circle" className="text-success" /> High-Speed Wi-Fi
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <MDBIcon fas icon="check-circle" className="text-success" /> 24/7 Room Service
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <MDBIcon fas icon="check-circle" className="text-success" /> Air Conditioning
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <MDBIcon fas icon="check-circle" className="text-success" /> Smart HD TV
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <MDBIcon fas icon="check-circle" className="text-success" /> Mini Bar & Safe
                </div>
                <div className="col d-flex align-items-center gap-2">
                  <MDBIcon fas icon="check-circle" className="text-success" /> En-suite Bathroom
                </div>
              </div>
            </MDBModalBody>

            <MDBModalFooter className="bg-light border-0 py-3">
              <MDBBtn color="secondary" onClick={() => setDetailsModal(false)}>
                Close
              </MDBBtn>
              <MDBBtn
                color="primary"
                className="bg-gradient-gold border-0 fw-bold"
                onClick={() => {
                  setDetailsModal(false);
                  onBookNow(room);
                }}
              >
                <MDBIcon fas icon="calendar-check" className="me-1" /> Proceed to Booking
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default RoomCard;
