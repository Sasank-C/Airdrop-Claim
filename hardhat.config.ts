import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";

dotenvConfig({path: resolve(__dirname, "./.env")});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.16",
    settings: {
        optimizer: {
            enabled: true,
            runs: 20000,
        },
    },
},
  networks: {
    arbitrum: {
      url: process.env.ARB_URL as string,
      accounts: [process.env.PRIVATE_KEY as string, process.env.PRIVATE_KEY2 as string, process.env.PRIVATE_KEY3 as string],
      forking: {
        url: process.env.ARB_URL as string,
        blockNumber: 16890400,
      },
    },
    // hardhat: {
    //   forking: {
    //     url: "https://arb-mainnet.g.alchemy.com/v2/your-api-key",
    //     blockNumber: 16890400,
    //   },
    // },
  },
};

export default config;
