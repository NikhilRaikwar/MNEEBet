// Contract types based on MNEEBet.sol

export type BetStatus = 0 | 1 | 2 | 3 | 4 | 5;
export type Winner = 0 | 1 | 2 | 3;

export interface Bet {
  betId: bigint;
  creator: `0x${string}`;
  opponent: `0x${string}`;
  amount: bigint;
  terms: string;
  deadline: bigint;
  status: BetStatus;
  winner: Winner;
  judge: `0x${string}`;
  createdAt: bigint;
  resolvedAt: bigint;
}
