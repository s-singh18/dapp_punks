import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";
import { ethers } from "ethers";

const Mint = ({ provider, nft, cost, mintingOn, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);

  const mintHandler = async (e) => {
    e.preventDefault();

    try {
      const signer = await provider.getSigner();
      const transaction = await nft.connect(signer).mint(parseInt(mintAmount), {
        value: ethers.utils.parseUnits(
          (ethers.utils.formatUnits(cost, "ether") * mintAmount).toString(),
          "ether"
        ),
      });
      await transaction.wait();
    } catch {
      window.alert("User rejected or transaction reverted");
    }

    setIsLoading(true);
  };

  return (
    <Form
      onSubmit={mintHandler}
      style={{ maxWidth: "450px", margin: "50px auto" }}
    >
      {isWaiting ? (
        <Spinner
          animation="border"
          style={{ display: "block", margin: "0 auto" }}
        />
      ) : (
        <Form.Group>
          {!mintingOn ? (
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%" }}
              disabled
            >
              Mint
            </Button>
          ) : (
            <>
              <Form.Control
                className="mx-auto"
                type="number"
                placeholder="Mint number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
              />
              <Button variant="primary" type="submit" style={{ width: "100%" }}>
                Mint
              </Button>
            </>
          )}
        </Form.Group>
      )}
    </Form>
  );
};

export default Mint;
