import { utils } from 'ethers';
import { HardhatUserConfig, task } from 'hardhat/config';
import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-tracer';
import './task';

task('accounts', 'list ethers accounts with balance').setAction(async (taskArgs, hre) => {
  for (const account of await hre.ethers.getSigners())
    console.log(account.address, hre.ethers.utils.formatEther(await account.getBalance()));
});
const getMnemonic = (networkName?: string) => {
  const mnemonic = networkName ? process.env['MNEMONIC_' + networkName.toUpperCase()] : process.env.MNEMONIC;
  if (!mnemonic || mnemonic === '') return 'test test test test test test test test test test test junk';
  return mnemonic;
};
const accounts = (chain?: string) => {
  return { mnemonic: getMnemonic(chain) };
};
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.4.24',
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        version: '0.8.9',
        settings: { optimizer: { enabled: true, runs: 100 } },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    hardhat: {
      accounts: accounts(),
    },
    localhost: {
      accounts: accounts(),
    },
    arbitrum_goerli: {
      url: 'https://goerli-rollup.arbitrum.io/rpc',
      chainId: 421613,
      accounts: accounts(),
      gasMultiplier: 1.05,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};

export default config;
