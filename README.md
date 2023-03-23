# Arbitrum Airdrop Claim Script

This is a simple script to claim the Arbitrum airdrop. It allows you to claim the airdrop for multiple addresses at once.

## Usage

Clone the repo:

```shell
git clone https://github.com/Sasank-C/Airdrop-Claim.git
cd Airdrop-Claim
```

Install Hardhat and its dependencies:

```shell
npm install
```

Rename the `.env.example` file to `.env` and fill in your private keys and rpc url. Add as many private keys as you want to claim for and edit the `accounts` array in `hardhat.config.ts` to match the number of private keys you added. 

Deploy claim script:

```shell
npx hardhat run --network arbitrum scripts/deploy.ts
```


Additional scripts:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
