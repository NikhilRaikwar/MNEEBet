// Contract addresses
export const MNEE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MNEE_TOKEN_ADDRESS as `0x${string}`;
export const MNEEBET_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MNEEBET_CONTRACT_ADDRESS as `0x${string}`;

// Bet Status enum (matches contract)
export enum BetStatus {
  Open = 0,
  Active = 1,
  PendingResolve = 2,
  Resolved = 3,
  Cancelled = 4,
  Disputed = 5,
}

// Winner enum (matches contract)
export enum Winner {
  None = 0,
  Creator = 1,
  Opponent = 2,
  Draw = 3,
}

// Status labels
export const BET_STATUS_LABELS: Record<BetStatus, string> = {
  [BetStatus.Open]: 'Open',
  [BetStatus.Active]: 'Active',
  [BetStatus.PendingResolve]: 'Pending Resolve',
  [BetStatus.Resolved]: 'Resolved',
  [BetStatus.Cancelled]: 'Cancelled',
  [BetStatus.Disputed]: 'Disputed',
};

// Winner labels
export const WINNER_LABELS: Record<Winner, string> = {
  [Winner.None]: 'None',
  [Winner.Creator]: 'Creator',
  [Winner.Opponent]: 'Opponent',
  [Winner.Draw]: 'Draw',
};
