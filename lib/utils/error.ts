/**
 * Format error messages for user display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    // Handle common contract errors
    const message = error.message.toLowerCase();
    
    if (message.includes('user rejected')) {
      return 'Transaction was rejected';
    }
    
    if (message.includes('insufficient funds')) {
      return 'Insufficient funds for this transaction';
    }
    
    if (message.includes('allowance')) {
      return 'Please approve MNEE token spending first';
    }
    
    if (message.includes('deadline')) {
      return 'Deadline must be in the future';
    }
    
    if (message.includes('amount below minimum')) {
      return 'Bet amount is below the minimum';
    }
    
    if (message.includes('not open')) {
      return 'This bet is not available for acceptance';
    }
    
    if (message.includes('not resolved')) {
      return 'This bet has not been resolved yet';
    }
    
    if (message.includes('already claimed')) {
      return 'Winnings have already been claimed';
    }
    
    // Return original message if no specific formatting
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}
