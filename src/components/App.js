import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Countdown from "react-countdown";
import { ethers } from "ethers";

import preview from "../preview.png";

// Components
import Navigation from "./Navigation";
import Data from "./Data";
import Mint from "./Mint";
import Pause from "./Pause";
import MaxMint from "./MaxMint";
import Loading from "./Loading";
import Whitelist from "./Whitelist";
import ControlledCarousel from "./ControlledCarousel";

// ABIs: Import your contract ABIs here
import NFT_ABI from "../abis/NFT.json";

// Config: Import your network config here
import config from "../config.json";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [nft, setNFT] = useState(null);
  const [owner, setOwner] = useState(null);
  const [mintingOn, setMintingOn] = useState(null);
  const [tokenIds, setTokenIds] = useState([]);

  const [account, setAccount] = useState(null);

  const [revealTime, setRevealTime] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [maxBalance, setMaxBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [cost, setCost] = useState(0);
  const [balance, setBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const nft = new ethers.Contract(
      config[31337].nft.address,
      NFT_ABI,
      provider
    );
    setNFT(nft);

    const owner = await nft.owner();
    setOwner(owner);

    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);

    // Fetch Countdown
    const allowMintingOn = await nft.allowMintingOn();
    setRevealTime(allowMintingOn.toString() + "000");

    const maxSupply = await nft.maxSupply();
    setMaxSupply(maxSupply);

    const totalSupply = await nft.totalSupply();
    setTotalSupply(totalSupply);

    const cost = await await nft.cost();
    setCost(cost);
    // console.log(cost);

    const balance = await nft.balanceOf(account);
    setBalance(balance);

    const maxBalance = await nft.maxBalance();
    setMaxBalance(maxBalance);

    const mintingOn = await nft.mintingOn();
    setMintingOn(mintingOn);

    const tokenIds = await nft.walletOfOwner(account);
    let tokenIdStrs = [];
    for (let i = 0; i < tokenIds.length; i++) {
      tokenIdStrs.push(tokenIds[i].toString());
    }

    setTokenIds(tokenIdStrs);
    // console.log(tokenIdStrs);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return (
    <Container>
      <Navigation account={account} />
      <Row>
        <h1 className="my-4 text-center">Dapp Punks</h1>
      </Row>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              {balance > 0 ? (
                <ControlledCarousel tokenIds={tokenIds} />
              ) : (
                // <img
                //   src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${balance.toString()}.png`}
                //   alt="Open Punk"
                //   width="400px"
                //   height="400px"
                // />
                <img src={preview} alt="" />
              )}
            </Col>
            <Col className="my-4 text-center">
              <div>
                <Countdown date={parseInt(revealTime)} className="h2" />
              </div>
              <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />
              <Mint
                provider={provider}
                nft={nft}
                cost={cost}
                mintingOn={mintingOn}
                setIsLoading={setIsLoading}
              />
            </Col>
          </Row>
          {owner === account ? (
            <Row>
              <hr />
              <Col>
                <MaxMint
                  provider={provider}
                  nft={nft}
                  setIsLoading={setIsLoading}
                />
                <p>
                  <strong>Current Mint Cap: </strong>
                  {maxBalance.toString()}
                </p>
              </Col>
              <Col>
                <Pause
                  provider={provider}
                  nft={nft}
                  setIsLoading={setIsLoading}
                />
                <p>
                  <strong>Minting On: </strong>
                  {mintingOn.toString()}
                </p>
              </Col>
              <Col>
                <Whitelist provider={provider} nft={nft} />
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
