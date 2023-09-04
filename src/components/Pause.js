import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";

const Pause = ({ provider, nft, cost, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false);

  const pauseHandler = async (e) => {
    e.preventDefault();

    try {
      const signer = await provider.getSigner();
      const transaction = await nft.connect(signer).toggleMinting();
      await transaction.wait();
    } catch {
      window.alert("Unable to toggle minting");
    }

    setIsLoading(true);
  };

  return (
    <Form
      onSubmit={pauseHandler}
      style={{ maxWidth: "450px", margin: "50px auto" }}
    >
      {isWaiting ? (
        <Spinner
          animation="border"
          style={{ display: "block", margin: "0 auto" }}
        />
      ) : (
        <Form.Group>
          <Button variant="primary" type="submit" style={{ width: "100%" }}>
            Toggle Minting
          </Button>
        </Form.Group>
      )}
    </Form>
  );
};

export default Pause;
