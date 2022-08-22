import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {}, []);

  console.log("key: ", process.env.NEXT_PUBLIC_API_KEY);

  const handleCreate = () => {
    setLoading(true);

    const data = {
      key: process.env.NEXT_PUBLIC_API_KEY,
      chain_id: "97",
      name: "Thentic NFT",
      short_name: "THN",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    };

    fetch(process.env.NEXT_PUBLIC_CREATE_CONTRACT_URL, options).then((data) => {
      console.log("data: ", data);
      setLoading(false);
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Test Thentic</h1>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
