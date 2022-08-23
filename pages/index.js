import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import Card from "../components/card";

export default function Home() {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [curContract, setCurContract] = useState(null);
  const [isOpened, setOpened] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const data = {
        key: process.env.NEXT_PUBLIC_API_KEY,
        chain_id: "97",
      };

      const res = await axios({
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        url: process.env.NEXT_PUBLIC_GET_CONTRACTS_URL,
        params: data,
      });

      setContracts(res.data.contracts);

      if (res.data.contracts.length) {
        data = {
          key: process.env.NEXT_PUBLIC_API_KEY,
          chain_id: "97",
        };

        res = await axios({
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
          url: process.env.NEXT_PUBLIC_GET_NFTS_URL,
          params: data,
        });

        setNFTs(res.data.nfts);
      }

      setLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const handleMint = () => {
    if (!curContract) {
      setOpened(true);
      return;
    }

    router.push({
      pathname: "/mint",
      query: {
        nft_id: nfts.filter((nft) => nft.contract === curContract.contract)
          .length,
        contract: curContract.contract,
      },
    });
  };

  const handleContractChanged = (e) => {
    if (parseInt(e.target.value) === -1) {
      setCurContract(null);
    }
    setCurContract(
      contracts.filter((contract) => contract.status === "success")[
        e.target.value
      ]
    );
  };

  if (isLoading) {
    return (
      <div role="status">
        <svg
          className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!contracts.length) {
    return (
      <div>
        <p className="text-2xl">No Contracts</p>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => router.push("/deploy")}
        >
          Deploy Contracts
        </button>
      </div>
    );
  }

  if (!contracts.filter((contract) => contract.status === "success").length) {
    return (
      <div>
        There are pending contracts, no succeed
        <p></p>
      </div>
    );
  }

  const filteredNFTs = curContract
    ? nfts.filter((nft) => nft.contract === curContract.contract)
    : nfts;

  return (
    <div>
      {contracts.length ? (
        <div className="mb-6">
          <label
            htmlFor="contracts"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Select a Contract
          </label>
          <select
            id="contracts"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            defaultValue={-1}
            onChange={handleContractChanged}
          >
            <option value={-1}>All Contracts</option>
            {contracts
              .filter((contract) => contract.status === "success")
              .map((contract, index) => (
                <option value={index} key={index}>
                  {contract.contract}
                </option>
              ))}
          </select>
        </div>
      ) : null}

      {nfts.length ? (
        <div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleMint}
          >
            Mint new NFT
          </button>
          {filteredNFTs.filter((nft) => nft.status === "success").length ? (
            <p className="text-2xl">Minted NFTs</p>
          ) : null}
          <div className="grid grid-flow-col auto-cols-max">
            {filteredNFTs
              .filter((nft) => nft.status === "success")
              .map((nft, index) => (
                <Card
                  key={index}
                  name={JSON.parse(nft.data).name}
                  url={JSON.parse(nft.data).url}
                  description={JSON.parse(nft.data).description}
                  link={nft.transaction_url}
                />
              ))}
          </div>
          {filteredNFTs.filter((nft) => nft.status === "pending").length ? (
            <p className="text-2xl mt-8">Pending NFTs</p>
          ) : null}
          <div className="grid grid-flow-col auto-cols-max">
            {filteredNFTs
              .filter((nft) => nft.status === "pending")
              .map((nft, index) => (
                <Card
                  key={index}
                  name={JSON.parse(nft.data).name}
                  url={JSON.parse(nft.data).url}
                  description={JSON.parse(nft.data).description}
                  link={nft.transaction_url}
                />
              ))}
          </div>
        </div>
      ) : (
        <div>
          <p>No NFTs. Please mint</p>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleMint}
          >
            Mint NFTs
          </button>
        </div>
      )}

      <div
        id="toast-warning"
        className={`flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${
          isOpened ? "" : "hidden"
        }`}
        role="alert"
      >
        <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Warning icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">
          Please select a contract.
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={() => setOpened(false)}
        >
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <p className="text-2xl">Pending Contracts</p>
      {contracts
        .filter((contract) => contract.status === "pending")
        .map((contract, index) => (
          <a href={contract.transaction_url} target="_blank" key={index}>
            <p>{contract.name}</p>
          </a>
        ))}
    </div>
  );
}
