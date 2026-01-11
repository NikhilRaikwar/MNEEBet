import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  rainbowWallet, 
  coinbaseWallet, 
  walletConnectWallet,
  trustWallet,
  ledgerWallet
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http, fallback } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const customSepolia = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: {
      http: [
        'https://eth-sepolia.g.alchemy.com/v2/M3Z3za6jNjXTLeAq4BzWO',
        'https://ethereum-sepolia-rpc.publicnode.com',
        'https://rpc.sepolia.org',
        'https://1rpc.io/sepolia',
        'https://sepolia.drpc.org',
      ],
    },
  },
};

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: 'Others',
      wallets: [
        trustWallet,
        ledgerWallet,
      ],
    },
  ],
  {
    appName: 'MNEEBet',
    projectId,
  }
);

export const config = createConfig({
  connectors,
  chains: [customSepolia, mainnet],
  transports: {
    [customSepolia.id]: fallback([
      http('https://eth-sepolia.g.alchemy.com/v2/M3Z3za6jNjXTLeAq4BzWO'),
      http('https://ethereum-sepolia-rpc.publicnode.com'),
      http('https://rpc.sepolia.org'),
      http('https://1rpc.io/sepolia'),
      http('https://sepolia.drpc.org'),
    ]),
    [mainnet.id]: http(),
  },
  ssr: true,
});
