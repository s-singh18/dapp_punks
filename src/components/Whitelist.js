import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";

const Whitelist = ({ provider, nft }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    try {
      if (ethers.utils.isAddress(address) === false) return;
      const signer = await provider.getSigner();
      if (action === "addAddress") {
        await nft.connect(signer).addUser(address);
        console.log(`Added Address: ${address}`);
      } else if (action === "removeAddress") {
        await nft.connect(signer).removeUser(address);
        console.log(`Removed Address: ${address}`);
      }
    } catch {
      window.alert("Unable to set whitelist");
    }
  };

  return (
    <Form
      className="justify-content-center"
      onSubmit={(e) => handleSubmit(e, "addAddress")}
    >
      <Form.Group controlId="formInput">
        <Form.Label>Whitelist Form</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Account
      </Button>{" "}
      <Button
        variant="secondary"
        type="submit"
        onClick={(e) => handleSubmit(e, "removeAddress")}
      >
        Remove Account
      </Button>{" "}
    </Form>
  );
};

export default Whitelist;
