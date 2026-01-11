# Deploying MNEEBet from Frontend Directory

You can now deploy your smart contracts directly from the `frontend` folder.

## 1. Install Dependencies
First, ensure you have installed the new Hardhat dependencies:

```bash
cd frontend
npm install
```

## 2. Configure Environment
Open `frontend/.env.local` and ensure you have the following keys:

```ini
# RPC URL for Ethereum Mainnet
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Your wallet private key (Must have ETH for gas)
PRIVATE_KEY=0x...

# Etherscan API Key (For verification)
ETHERSCAN_API_KEY=YourEtherscanKey
```

## 3. Deploy to Mainnet
Run the deployment script:

```bash
npm run deploy:mainnet
```

## 4. Other Commands

- **Compile Contracts**: `npm run compile`
- **Run Tests**: `npm run test`
- **Deploy to Sepolia**: `npm run deploy:sepolia`

## Directory Structure
- **Contracts**: `frontend/contracts/MNEEBet.sol`
- **Scripts**: `frontend/scripts/deploy.js`
- **Tests**: `frontend/test/MNEEBet.test.js`
- **Config**: `frontend/hardhat.config.js`
