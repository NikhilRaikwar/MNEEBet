// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MNEEBet
 * @dev Peer-to-peer betting platform using MNEE stablecoin
 * @notice This contract escrows MNEE ERC-20 (a USD-backed stablecoin) as the betting currency.
 * Because MNEE is stable, the pot value does not fluctuate during the dispute period, which is important for fair resolution.
 */
contract MNEEBet is ReentrancyGuard, Ownable {
    
    // MNEE token address on Ethereum mainnet
    IERC20 public immutable mneeToken;
    
    // Pause state
    bool public paused;
    
    enum BetStatus {
        Open,           // Bet created, waiting for opponent
        Active,        // Both parties deposited, bet is live
        Resolved,      // Winner determined, funds already paid
        Cancelled,     // Bet cancelled before acceptance or via emergency
        Disputed       // Parties disagree, needs arbitration
    }
    
    enum Winner {
        None,
        Creator,
        Opponent,
        Draw
    }
    
    struct Bet {
        uint256 betId;
        address creator;
        address opponent;
        uint256 amount;           // Amount each party bets
        string terms;             // Bet description
        uint256 deadline;         // Timestamp when bet should be judged
        BetStatus status;
        Winner winner;
        address judge;            // Address of human judge (required)
        uint256 createdAt;
        uint256 resolvedAt;
    }
    
    // Mapping from bet ID to Bet struct
    mapping(uint256 => Bet) public bets;
    
    // Counter for bet IDs
    uint256 public betCounter;
    
    // Track user's bets
    mapping(address => uint256[]) public userBets;
    
    // Username mapping
    mapping(string => address) public usernameToAddress;
    mapping(address => string) public addressToUsername;
    mapping(string => bool) public usernameExists;
    
    // Events
    event BetCreated(
        uint256 indexed betId,
        address indexed creator,
        address indexed opponent,
        uint256 amount,
        string terms,
        uint256 deadline,
        address judge
    );
    
    event BetFunded(uint256 indexed betId, address indexed user, uint256 amount);
    
    event BetAccepted(uint256 indexed betId, address indexed opponent);
    
    event BetResolved(
        uint256 indexed betId,
        Winner winner,
        address resolvedBy
    );
    
    event BetCancelled(uint256 indexed betId);
    
    event BetDisputed(uint256 indexed betId, address indexed disputer);
    
    event UsernameRegistered(address indexed user, string username);
    
    event Paused(address account);
    event Unpaused(address account);
    
    // Modifiers
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }
    
    modifier betExists(uint256 _betId) {
        require(_betId < betCounter, "Bet does not exist");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _mneeToken Address of MNEE token contract
     */
    constructor(address _mneeToken) Ownable(msg.sender) {
        require(_mneeToken != address(0), "Invalid MNEE token address");
        mneeToken = IERC20(_mneeToken);
    }
    
    /**
     * @dev Register a username
     * @param _username Username to register (3-20 characters, alphanumeric and underscores)
     */
    function registerUsername(string memory _username) external whenNotPaused {
        require(bytes(_username).length >= 3 && bytes(_username).length <= 20, "Username must be 3-20 characters");
        require(!usernameExists[_username], "Username already taken");
        require(bytes(addressToUsername[msg.sender]).length == 0, "Address already has username");
        
        // Remove old username if exists (currently unreachable due to require above,
        // you can later loosen the require if you want username changes)
        string memory oldUsername = addressToUsername[msg.sender];
        if (bytes(oldUsername).length > 0) {
            usernameExists[oldUsername] = false;
            usernameToAddress[oldUsername] = address(0);
        }
        
        usernameToAddress[_username] = msg.sender;
        addressToUsername[msg.sender] = _username;
        usernameExists[_username] = true;
        
        emit UsernameRegistered(msg.sender, _username);
    }
    
    /**
     * @dev Get address by username
     * @param _username Username to lookup
     */
    function getAddressByUsername(string memory _username) external view returns (address) {
        return usernameToAddress[_username];
    }
    
    /**
     * @dev Get username by address
     * @param _user Address to lookup
     */
    function getUsernameByAddress(address _user) external view returns (string memory) {
        return addressToUsername[_user];
    }
    
    /**
     * @dev Create a new bet
     * @param _opponent Address of the opponent (use address(0) for open bet)
     * @param _amount Amount of MNEE each party will bet (must be > 0)
     * @param _terms Description of bet terms
     * @param _deadline Timestamp when bet should be judged
     * @param _judge Address of human judge (required, cannot be creator or opponent)
     */
    function createBet(
        address _opponent,
        uint256 _amount,
        string memory _terms,
        uint256 _deadline,
        address _judge
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(_amount > 0, "Amount must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(bytes(_terms).length > 0, "Terms cannot be empty");
        require(_opponent != msg.sender, "Cannot bet against yourself");
        require(_judge != address(0), "Judge required");
        require(_judge != msg.sender, "Judge cannot be creator");
        require(_judge != _opponent, "Judge cannot be opponent");
        
        // Transfer creator's bet amount to contract
        require(
            mneeToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        uint256 betId = betCounter++;
        
        bets[betId] = Bet({
            betId: betId,
            creator: msg.sender,
            opponent: _opponent,
            amount: _amount,
            terms: _terms,
            deadline: _deadline,
            status: BetStatus.Open,
            winner: Winner.None,
            judge: _judge,
            createdAt: block.timestamp,
            resolvedAt: 0
        });
        
        userBets[msg.sender].push(betId);
        
        emit BetCreated(
            betId,
            msg.sender,
            _opponent,
            _amount,
            _terms,
            _deadline,
            _judge
        );
        
        emit BetFunded(betId, msg.sender, _amount);
        
        return betId;
    }
    
    /**
     * @dev Accept an open bet
     * @param _betId ID of the bet to accept
     */
    function acceptBet(uint256 _betId) external whenNotPaused nonReentrant betExists(_betId) {
        Bet storage bet = bets[_betId];
        
        require(bet.status == BetStatus.Open, "Bet not open");
        require(
            bet.opponent == address(0) || bet.opponent == msg.sender,
            "Not designated opponent"
        );
        require(msg.sender != bet.creator, "Cannot accept own bet");
        require(block.timestamp < bet.deadline, "Bet deadline passed");
        
        // Transfer opponent's bet amount to contract (must match creator's amount)
        require(
            mneeToken.transferFrom(msg.sender, address(this), bet.amount),
            "Transfer failed"
        );
        
        bet.opponent = msg.sender;
        bet.status = BetStatus.Active;
        
        userBets[msg.sender].push(_betId);
        
        emit BetFunded(_betId, msg.sender, bet.amount);
        emit BetAccepted(_betId, msg.sender);
    }
    
    /**
     * @dev Resolve bet with human judge and pay out immediately
     * @param _betId ID of the bet
     * @param _winner Winner of the bet (Creator, Opponent, or Draw)
     */
    function resolveWithJudge(
        uint256 _betId,
        Winner _winner
    ) external whenNotPaused betExists(_betId) {
        Bet storage bet = bets[_betId];
        
        require(bet.status == BetStatus.Active, "Bet not active");
        require(msg.sender == bet.judge, "Only judge can resolve");
        require(block.timestamp >= bet.deadline, "Deadline not reached");
        require(_winner != Winner.None, "Must specify winner");
        require(
            _winner == Winner.Creator || 
            _winner == Winner.Opponent || 
            _winner == Winner.Draw,
            "Invalid winner"
        );
        
        uint256 totalPot = bet.amount * 2;
        
        // Safety check: ensure contract has enough balance (coarse global guard)
        require(
            mneeToken.balanceOf(address(this)) >= totalPot,
            "Insufficient contract balance"
        );
        
        // Perform payouts based on winner
        if (_winner == Winner.Creator) {
            require(bet.opponent != address(0), "No opponent");
            require(mneeToken.transfer(bet.creator, totalPot), "Transfer failed");
        } else if (_winner == Winner.Opponent) {
            require(bet.opponent != address(0), "No opponent");
            require(mneeToken.transfer(bet.opponent, totalPot), "Transfer failed");
        } else if (_winner == Winner.Draw) {
            require(bet.opponent != address(0), "No opponent");
            require(mneeToken.transfer(bet.creator, bet.amount), "Transfer failed");
            require(mneeToken.transfer(bet.opponent, bet.amount), "Transfer failed");
        }
        
        // Update bet state after successful transfers
        bet.winner = _winner;
        bet.status = BetStatus.Resolved;
        bet.resolvedAt = block.timestamp;
        
        emit BetResolved(_betId, _winner, msg.sender);
    }
    
    /**
     * @dev Cancel an open bet (only creator can cancel before acceptance)
     * @param _betId ID of the bet
     */
    function cancelBet(uint256 _betId) external whenNotPaused nonReentrant betExists(_betId) {
        Bet storage bet = bets[_betId];
        
        require(bet.status == BetStatus.Open, "Can only cancel open bets");
        require(msg.sender == bet.creator, "Only creator can cancel");
        
        bet.status = BetStatus.Cancelled;
        
        // Return creator's funds
        require(
            mneeToken.transfer(bet.creator, bet.amount),
            "Transfer failed"
        );
        
        emit BetCancelled(_betId);
    }
    
    /**
     * @dev Dispute a bet result (triggers manual review flag)
     * @param _betId ID of the bet
     */
    function disputeBet(uint256 _betId) external whenNotPaused betExists(_betId) {
        Bet storage bet = bets[_betId];
        
        require(bet.status == BetStatus.Resolved, "Bet not resolved");
        require(
            msg.sender == bet.creator || msg.sender == bet.opponent,
            "Not a participant"
        );
        
        bet.status = BetStatus.Disputed;
        
        emit BetDisputed(_betId, msg.sender);
    }
    
    /**
     * @dev Get bet details
     * @param _betId ID of the bet
     */
    function getBet(uint256 _betId) 
        external 
        view 
        betExists(_betId) 
        returns (Bet memory) 
    {
        return bets[_betId];
    }
    
    /**
     * @dev Get all bets for a user
     * @param _user Address of the user
     */
    function getUserBets(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userBets[_user];
    }
    
    /**
     * @dev Get payout information for a bet
     * @param _betId ID of the bet
     * @return amount The amount each party staked
     * @return totalPot The total pot (2 * amount)
     * @return winnerPayout The payout for the winner (totalPot, since no fees)
     */
    function getPayoutInfo(uint256 _betId) 
        external 
        view 
        betExists(_betId) 
        returns (uint256 amount, uint256 totalPot, uint256 winnerPayout) 
    {
        Bet memory bet = bets[_betId];
        amount = bet.amount;
        totalPot = bet.amount * 2;
        winnerPayout = totalPot; // No fees, winner gets full pot
    }
    
    /**
     * @dev Get bets in a range (for frontend scanning)
     * @param _startId Starting bet ID (inclusive)
     * @param _endId Ending bet ID (exclusive)
     * @return Array of Bet structs
     * @notice Frontends should filter by status == Open || status == Active to show joinable bets
     */
    function getBetsInRange(uint256 _startId, uint256 _endId) 
        external 
        view 
        returns (Bet[] memory) 
    {
        require(_endId <= betCounter, "End ID exceeds bet counter");
        require(_startId < _endId, "Invalid range");
        
        uint256 length = _endId - _startId;
        Bet[] memory result = new Bet[](length);
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = bets[_startId + i];
        }
        
        return result;
    }
    
    /**
     * @dev Get active bets count (O(n), fine for hackathon scale)
     */
    function getActiveBetsCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < betCounter; i++) {
            if (bets[i].status == BetStatus.Active || 
                bets[i].status == BetStatus.Open) {
                count++;
            }
        }
        return count;
    }
    
    // Admin functions
    
    /**
     * @dev Pause the contract (prevents all state-changing operations)
     */
    function pause() external onlyOwner whenNotPaused {
        paused = true;
        emit Paused(msg.sender);
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }
    
    /**
     * @dev Emergency withdraw (only in case of critical issues)
     * @param _betId ID of the bet
     * @notice Can be called even when paused. Use case is for Active or Disputed bets that have not been resolved and paid out.
     */
    function emergencyWithdraw(uint256 _betId) 
        external 
        onlyOwner 
        betExists(_betId) 
    {
        Bet storage bet = bets[_betId];
        require(
            bet.status == BetStatus.Disputed || 
            bet.status == BetStatus.Active ||
            block.timestamp > bet.deadline + 30 days,
            "Not eligible for emergency withdrawal"
        );
        
        // Return funds to both parties if bet hasn't been resolved
        if (bet.status == BetStatus.Active || bet.status == BetStatus.Disputed) {
            require(mneeToken.transfer(bet.creator, bet.amount), "Transfer failed");
            if (bet.opponent != address(0)) {
                require(mneeToken.transfer(bet.opponent, bet.amount), "Transfer failed");
            }
        }
        
        bet.status = BetStatus.Cancelled;
    }
}
