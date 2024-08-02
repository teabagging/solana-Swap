'use client';

import styles from './swap.module.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction, Connection } from '@solana/web3.js';
import React, { useState, useEffect, useCallback } from 'react';

const assets = [
  { name: 'SOL', mint: 'So11111111111111111111111111111111111111112', decimals: 9},
  { name: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6},
  { name: 'BTC', mint: 'ArXETDYEcKmPWTN7CbLtAtw3bruJbrtwb3FD1RnvXFuf', decimals: 3 }, 
  { name: 'ETH', mint: 'EBBHUma1N1pAZBFjSHEqRRaZ6zGYjWsbiQDrkftFSQuh', decimals: 3 },
  { name: 'USDC', mint: '3zwVdm5GkUFfJDMJSaMGjQtaMA7sqVWpCynoXcJ6kaX7', decimals: 3 },
  { name: 'USDT', mint: '45t4Cpoj5uZFmurz2bD1pEmXD4x1WaD3kSnetpHx9ZNi', decimals: 3 },
  { name: 'PEPE', mint: '53riQbBXCEFcuxZKBv98QRZhgPgkwpwpRwvGtWqUBd1u', decimals: 3 },
  { name: 'BNB', mint: '124XZFhE8ABFYSuDZkxbkKTKjqrB7CpHCspCPsQJPQvL', decimals: 3 },
  { name: 'BUSD', mint: 'J8ctjxNqi8vsKS5awupxoe3oK2qzcD3haJdrU8NnwP3x', decimals: 3 },
  { name: 'FDUSD', mint: '6fyVxagdYGtYv1u117cctvrYGJQwEYmg8LivELTT5yZL', decimals: 3 },
  { name: 'sol', mint: 'ATvWFEriuCm5ES26sXncc8tYBiDnjGbahzG6fp3uYQBk', decimals: 3 },
  { name: 'otter', mint: '7BkF2u2nUe3MrTUXY2sYdyuCQHrDBtrRzHqARrRWSg7g', decimals: 3 },
  { name: 'GF', mint: '4RtELABCLKgbptLRLGitdzcLrFnkhpgA57xj53QgoTTA', decimals: 3 },
  { name: 'peace', mint: '2qkVV1aJSq29RCufbc7yCcGsS7k97ZkQaZzUb9pM1Nnh', decimals: 3 },
  { name: 'DONALD', mint: 'AkfGJmaS6DznynN8xA9FhbdbGGYhXSwJv5ZdC6P5TRB4', decimals: 3 },
  { name: 'FOOTBALL', mint: '4mWmAgFp6cq2FWjbLcYgHAWZe1RNXac1r7jBRfKTeWkS', decimals: 3 },
  { name: 'A', mint: '26BH9BqQQG6WLGoGmWYsW5qd6bM4Bzuz59hBxRAkg6ak', decimals: 3 },
  { name: 'Jump', mint: 'EgNMgTbTFy1pE15YfhFTpsB97ATpojMWsFPvpHnH8vdV', decimals: 3 },
  { name: 'DOGE', mint: 'AncaR5NrA9ZbDY8tWntGyb5CZAK8QhDLfGhJBG3NWwrR', decimals: 3 },
  { name: 'QQ', mint: '6nr68C4TW9ZTXddKp3QHHcbaQyRMiPPeqqkUcf2wjU2d', decimals: 3 },  
  { name: 'clown', mint: 'Hv4D1ohDS6xTiBfHU4gXxCLUM5ekFAb74s9J3H5TzdBx', decimals: 3 },
  { name: 'anonymous', mint: '8FSGagHqgjWDb3FKz8DrXuPjf5U4eX26YTmpTpk1iYsG', decimals: 3 },
  { name: 'CAT', mint: 'nVS6UVNVL2zQsorZpqmsrR527eqGacMAHtSV7tHKci7', decimals: 3 },
  { name: 'miqi', mint: '42RrRKsSPbYYcfBzBgVFHg6txmgTdiqoLttCjPJoeJWW', decimals: 3 },
  { name: 'YY', mint: '7pajZABTSzNciQaXBBeKn93DxjCZmU8fur8X3VpNG6eo', decimals: 3 },
  { name: 'panda', mint: '5BLtJtMYYw3QxWcXGr9fTPHAVFe766to1WRYLQYJBJrn', decimals: 3 },
  { name: 'Sheep', mint: '7BkF2u2nUe3MrTUXY2sYdyuCQHrDBtrRzHqARrRWSg7g', decimals: 3 },
  { name: 'rabbit ', mint: 'ECGz3d727sk2iECrQxTkTLgSDKeiheTcPkoBZn9UWc4n', decimals: 3 },
  { name: 'ORD', mint: 'B96wBokgFf5KsuPra3dSnd3nPeiY3fAD48bAshMALQ44', decimals: 3 },
  { name: 'monkey', mint: 'EZanCZ9pteNqBRDT3azxawzaDCE478UuJsHp9HLv2Z1v ', decimals: 3 },
  { name: 'RAT', mint: 'DaZacZ6z8jAMgwBsMsGfFjuUeVpnoTxTLMkweSXgUyap', decimals: 3 },
  { name: 'dragon', mint: '5Pg797Jd9CFCi8MUUoh7N7g6iWsboHC2SeWs7rRyxVwe', decimals: 3 },
  { name: 'X', mint: 'DRvqhBuYsb5U1U8FVqAGzRpm431mmxJ1hTkK4WPXkbQH', decimals: 3 },
  { name: 'Cow', mint: 'EMQvrURJHps2qZYb4mRb8pNRDmWjzBt57krsoc4B8cHc', decimals: 3 },
  { name: 'YAYA', mint: 'GFXzsU8XJCCLRqr7PWcK1gihEi88LVHE49HjkvcMjkiT', decimals: 3 },
  { name: 'seal', mint: 'CzA7tZRbUBtfzJRUDRBf7V1YQFJJ2pLhajUVjKBm8Ahu', decimals: 3 },  
  { name: 'Satoshi Nakamoto', mint: 'F37bUysKLHJBvFNCxAfGhDMArbZdk7LY1xAEc2MaqZja', decimals: 3 },
];

const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: T) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Swap() {
  const [fromAsset, setFromAsset] = useState(assets[0]);
  const [toAsset, setToAsset] = useState(assets[1]);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [quoteResponse, setQuoteResponse] = useState(null);

  const wallet = useWallet();

  // Need a custom RPC so you don't get rate-limited, don't rely on users' wallets
  const connection = new Connection(
    'https://mainnet.helius-rpc.com/?api-key=014d589b-2725-4817-9455-b30146808b7c'
  );

  const handleFromAssetChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFromAsset(
      assets.find((asset) => asset.name === event.target.value) || assets[0]
    );
  };

  const handleToAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToAsset(
      assets.find((asset) => asset.name === event.target.value) || assets[0]
    );
  };

  const handleFromValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setFromAmount(Number(event.target.value));
    };
    
  const debounceQuoteCall = useCallback(debounce(getQuote, 500), []);

  useEffect(() => {
    debounceQuoteCall(fromAmount);
  }, [fromAmount, debounceQuoteCall]);

  async function getQuote(currentAmount: number) {
    if (isNaN(currentAmount) || currentAmount <= 0) {
      console.error('Invalid fromAmount value:', currentAmount);
      return;
    }

    const quote = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromAsset.mint}&outputMint=${toAsset.mint}&amount=${currentAmount * Math.pow(10, fromAsset.decimals)}&slippage=0.5`
      )
    ).json();

    if (quote && quote.outAmount) {
      const outAmountNumber =
        Number(quote.outAmount) / Math.pow(10, toAsset.decimals);
      setToAmount(outAmountNumber);
    }

    setQuoteResponse(quote);
  }

  async function signAndSendTransaction() {
    if (!wallet.connected || !wallet.signTransaction) {
      console.error(
        'Wallet is not connected or does not support signing transactions'
      );
      return;
    }

    // get serialized transactions for the swap
    const { swapTransaction } = await (
      await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet.publicKey?.toString(),
          wrapAndUnwrapSol: true,
          // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
          // feeAccount: "fee_account_public_key"
        }),
      })
    ).json();

    try {
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      }, 'confirmed');
      
      console.log(`https://solscan.io/tx/${txid}`);

    } catch (error) {
      console.error('Error signing or sending the transaction:', error);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.innerContainer}>
        <div className={styles.inputContainer}>
          <div className={styles.labels}>You pay</div>
          <input
            type="number"
            value={fromAmount}
            onChange={handleFromValueChange}
            className={styles.inputField}
          />
          <select
            value={fromAsset.name}
            onChange={handleFromAssetChange}
            className={styles.selectField}
          >
            {assets.map((asset) => (
              <option key={asset.mint} value={asset.name}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.labels}>You receive</div>
          <input
            type="number"
            value={toAmount}
            // onChange={(e) => setToAmount(Number(e.target.value))}
            className={styles.inputField}
            readOnly
          />
          <select
            value={toAsset.name}
            onChange={handleToAssetChange}
            className={styles.selectField}
          >
            {assets.map((asset) => (
              <option key={asset.mint} value={asset.name}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={signAndSendTransaction}
          className={styles.button}
          disabled={toAsset.mint === fromAsset.mint}
        >
          Swap
        </button>
      </div>
    </div>
  );
}

/* Sample quote response

    {
      "inputMint": "So11111111111111111111111111111111111111112",
      "inAmount": "100000000",
      "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "outAmount": "9998099",
      "otherAmountThreshold": "9948109",
      "swapMode": "ExactIn",
      "slippageBps": 50,
      "platformFee": null,
      "priceImpactPct": "0.000146888216121999999999995",
      "routePlan": [
        {
          "swapInfo": {
            "ammKey": "HcoJqG325TTifs6jyWvRJ9ET4pDu12Xrt2EQKZGFmuKX",
            "label": "Whirlpool",
            "inputMint": "So11111111111111111111111111111111111111112",
            "outputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            "inAmount": "100000000",
            "outAmount": "10003121",
            "feeAmount": "4",
            "feeMint": "So11111111111111111111111111111111111111112"
          },
          "percent": 100
        },
        {
          "swapInfo": {
            "ammKey": "ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq",
            "label": "Meteora DLMM",
            "inputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "inAmount": "10003121",
            "outAmount": "9998099",
            "feeAmount": "1022",
            "feeMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
          },
          "percent": 100
        }
      ],
      "contextSlot": 242289509,
      "timeTaken": 0.002764025
    }
    */
