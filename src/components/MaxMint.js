import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";

const MaxMint = ({ provider, nft, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [enteredMintVal, setMintVal] = useState(0);

  //   const mintValChangeHandler = async (e) => {
  //     // setMintVal(e.target.value);
  //     console.log(enteredMintVal);
  //   };

  const maxMintHandler = async (e) => {
    e.preventDefault();
    console.log(enteredMintVal);
    try {
      const signer = await provider.getSigner();

      const transaction = await nft
        .connect(signer)
        .setMaxBalance(parseInt(enteredMintVal));
    } catch {
      window.alert("Invalid Mint amount set");
    }
  };

  return (
    <Form
      onSubmit={maxMintHandler}
      style={{ maxWidth: "360 px", margin: "50 px auto" }}
    >
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Control
          type="number"
          onChange={(e) => setMintVal(e.target.value)}
          placeholder="Max Mint Value"
        />
        {isWaiting ? (
          <Spinner
            animation="border"
            style={{ display: "block", margin: "0 auto" }}
          />
        ) : (
          <Button variant="primary" type="submit" style={{ width: "100%" }}>
            Submit
          </Button>
        )}
      </Form.Group>
    </Form>
  );
};
export default MaxMint;
