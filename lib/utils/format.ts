import { format, formatDistanceToNow } from 'date-fns';
import { formatUnits } from 'viem';
import { BetStatus, Winner, BET_STATUS_LABELS, WINNER_LABELS } from '@/lib/constants';

/**
 * Format bet amount from wei to MNEE display
 */
export function formatBetAmount(amount: bigint, decimals: number = 18): string {
  return parseFloat(formatUnits(amount, decimals)).toFixed(2);
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Get bet status label
 */
export function getBetStatusLabel(status: number): string {
  return BET_STATUS_LABELS[status as BetStatus] || 'Unknown';
}

/**
 * Get winner label
 */
export function getWinnerLabel(winner: number): string {
  return WINNER_LABELS[winner as Winner] || 'None';
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, start: number = 6, end: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Check if deadline has passed
 */
export function isDeadlinePassed(deadline: bigint): boolean {
  return Number(deadline) * 1000 < Date.now();
}

/**
 * Check if user is creator of bet
 */
export function isCreator(userAddress: string | undefined, creatorAddress: string): boolean {
  if (!userAddress) return false;
  return userAddress.toLowerCase() === creatorAddress.toLowerCase();
}

/**
 * Check if user is opponent of bet
 */
export function isOpponent(userAddress: string | undefined, opponentAddress: string): boolean {
  if (!userAddress || !opponentAddress) return false;
  return userAddress.toLowerCase() === opponentAddress.toLowerCase();
}
