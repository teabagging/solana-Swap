'use client'

import { useEffect } from 'react';
import styles from './page.module.css';

function Page() {

  useEffect(() => {
    // Dynamically load the Jupiter script
    const script = document.createElement('script');
    script.src = "https://terminal.jup.ag/main-v2.js";
    script.onload = () => launchJupiter(); // Initialize Jupiter after the script loads
    document.head.appendChild(script);
  }, []);

  function launchJupiter() {
    if (window.Jupiter) {
      window.Jupiter.init({ 
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: "https://mainnet.helius-rpc.com/?api-key=014d589b-2725-4817-9455-b30146808b7c",
        strictTokenList: false,
        defaultExplorer: "SolanaFM",
        formProps: {
          initialAmount: "888888880000",
          initialInputMint: "So11111111111111111111111111111111111111112",
          initialOutputMint: "ArXETDYEcKmPWTN7CbLtAtw3bruJbrtwb3FD1RnvXFuf",
        },
      });
    } else {
      console.error("Jupiter script not loaded yet");
    }
  }
  return (
    <div className={styles.body}>

      <div id="integrated-terminal"></div>

    </div>
  );
}

export default Page;