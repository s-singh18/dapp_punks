import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import { ethers } from "ethers";

const ControlledCarousel = ({ tokenIds }) => {
  return (
    <Carousel>
      {tokenIds.map((id) => (
        <Carousel.Item key={id}>
          <img
            className="d-block w-100"
            src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${id}.png`}
            alt="Open Punk"
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ControlledCarousel;
