import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { fallback, http } from 'wagmi';

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

export const config = getDefaultConfig({
  appName: 'MNEEBet',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default',
  chains: [mainnet, customSepolia],
  transports: {
    [mainnet.id]: http(),
    [customSepolia.id]: fallback([
      http('https://eth-sepolia.g.alchemy.com/v2/M3Z3za6jNjXTLeAq4BzWO'),
      http('https://ethereum-sepolia-rpc.publicnode.com'),
      http('https://rpc.sepolia.org'),
      http('https://1rpc.io/sepolia'),
      http('https://sepolia.drpc.org'),
    ]),
  },
  ssr: true,
});
