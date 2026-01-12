# MNEEBet - Decentralized P2P Betting Arena

**Built for:** Programmable Finance & Automation Track  
**MNEE Integration:** `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF` (Ethereum Mainnet)  
**Live Demo:** [https://mneebet.vercel.app](https://mneebet.vercel.app)  
**Contract (Sepolia):** `0x3480874a63D459046993915b52e612ee69947a81`

---

## 🚨 Important Note on Deployment

**Due to insufficient ETH for mainnet gas fees (~0.03-0.05 ETH), this submission is deployed on Sepolia testnet with a mock MNEE token.**

Our smart contract is **production-ready** and uses the **exact same interface** as the real MNEE token. Once deployment funds are secured post-hackathon, we can deploy to mainnet by simply changing one address in the constructor. The protocol is fully functional and demonstrates complete MNEE stablecoin integration.

---

## Inspiration

Traditional betting platforms are **broken**. They custody your funds, charge hidden fees, delay payouts, and can freeze accounts arbitrarily. We've all heard stories of centralized platforms refusing withdrawals or manipulating odds. 

When I discovered **MNEE stablecoin** and this hackathon, I realized we could build something revolutionary: a **truly peer-to-peer betting platform** where:
- Users never lose custody of their funds
- Smart contracts enforce rules automatically
- Winners get paid instantly with **zero fees**
- Stable USD-pegged currency eliminates volatility

The inspiration was simple: **What if money could move automatically between people based on verifiable outcomes, without any middleman taking a cut?**

That's programmable finance at its core.

---

## What it does

MNEEBet is a **non-custodial P2P betting protocol** powered by MNEE stablecoin. Here's how it works:

### The Complete Flow

1. **Alice** creates a bet: _"I will run a mile in under 5 minutes by Jan 15th"_
2. **Alice** stakes 100 MNEE and selects **Charlie** as the judge
3. **Bob** sees the bet in the marketplace and accepts it
4. **Bob** stakes 100 MNEE (now 200 MNEE locked in smart contract)
5. After Jan 15th, **Charlie** (the judge) verifies if Alice succeeded
6. **Charlie** selects the winner → Smart contract **instantly pays 200 MNEE** to the winner

### Key Features

✅ **Automated Escrow** - MNEE funds locked in smart contract, not held by platform  
✅ **Atomic Settlement** - Winner receives full pot in single transaction  
✅ **Zero Fees** - 100% of pot goes to winner, always  
✅ **Stable Value** - MNEE maintains $1.00 peg throughout bet lifecycle  
✅ **Human Judges** - Flexible resolution for any verifiable outcome  
✅ **On-Chain Identity** - Username system for reputation building  

---

## How we built it

### Smart Contract Architecture

**Tech Stack:**
- Solidity 0.8.20 with OpenZeppelin libraries
- ReentrancyGuard for attack prevention
- Pausable emergency controls
- Custom username registry for social layer

**Key Design Decisions:**

**1. Judge-Based Resolution:** Unlike prediction markets that require price feeds, we use human judges for maximum flexibility. This allows bets on ANY verifiable outcome (fitness goals, project deadlines, personal challenges).

**2. Instant Atomic Payouts:** Most betting platforms require a separate "claim" transaction. We eliminated this—when the judge resolves, the winner is paid in the **same transaction**. This is true programmable finance.

**3. MNEE-First Design:** Built specifically for MNEE stablecoin integration:

```solidity
constructor(address _mneeToken) {
    mneeToken = IERC20(_mneeToken);
}

// Escrow on bet creation
mneeToken.transferFrom(creator, address(this), amount);

// Instant payout on resolution
mneeToken.transfer(winner, totalPot);
```

**4. Zero-Fee Economics:** No platform fee extraction. Sustainable through ecosystem growth, not rent-seeking.

### Frontend Implementation

**Stack:**
- Next.js 16.1 with TypeScript
- Wagmi v2 + TanStack Query for blockchain state
- RainbowKit for wallet connections
- Custom brutalist design system

**UX Highlights:**
- 5-step wizard for bet creation with validation
- Real-time marketplace with filtering
- Seamless MNEE approval flow
- Mobile-responsive throughout

---

## Challenges we ran into

### 1. Mainnet Deployment Blocked by Gas Costs 😓

The biggest challenge was **not having enough ETH** for mainnet deployment. Gas estimates showed 0.03-0.05 ETH required (~$80-130 USD), which I couldn't afford as a solo developer.

**Solution:** Deploy to Sepolia with mock MNEE token to demonstrate full functionality. The contract is mainnet-ready—only the token address needs changing.

### 2. Judge Trust Model vs Pure Automation

Initially, I wanted fully automated resolution using oracles. But I realized:
- Oracles are expensive and limited to specific data (sports scores, prices)
- Most interesting bets are subjective (personal goals, project completion)
- Human judgment is more flexible and practical

**Solution:** Embrace the hybrid model—smart contracts for custody and settlement, humans for outcome verification. This is actually more powerful than pure automation.

### 3. Atomic Payout Implementation

Getting instant payouts working correctly was tricky. I had to ensure:
- ReentrancyGuard on all fund movements
- Sufficient contract balance checks
- Proper state updates **after** successful transfers
- Gas optimization to avoid failed transactions

**Solution:** Used OpenZeppelin's battle-tested patterns and extensive testing on Sepolia.

### 4. Username System vs Address-Only UX

Raw addresses `0x742d...` are terrible UX. But on-chain username systems are complex.

**Solution:** Built a simple but effective username registry directly into the betting contract. Users can search by name or address, building reputation through readable identities.

### 5. Stablecoin Integration Complexity

ERC-20 approval flows confuse users. I needed to make MNEE approval seamless.

**Solution:** 
- Check allowance before bet creation/acceptance
- Show "Approve MNEE" button if insufficient allowance
- Use clear loading states: "AUTHORIZING_FUNDS..."
- Switch to "Accept Challenge" once approved

---

## Accomplishments that we're proud of

### 🏆 Technical Excellence

**1. Production-Grade Smart Contract**
- ~650 lines of Solidity
- Zero known vulnerabilities
- Comprehensive event logging
- Gas-optimized design

**2. Complete End-to-End Implementation**
- Not just a prototype—fully functional platform
- Username system, bet creation, marketplace, resolution
- Professional UI/UX with custom design system

**3. True Programmable Finance**
- Demonstrated automated escrow with instant settlement
- Zero-fee economics through smart contract design
- Stable value preservation with MNEE stablecoin

### 💡 Innovation

**1. First Non-Custodial P2P Betting Platform**
- Not a prediction market (different model)
- Not a centralized casino (no house)
- Pure peer-to-peer with smart contract as neutral arbiter

**2. Judge-Based Human Oracle System**
- Hybrid approach: automation + human judgment
- More flexible than pure oracle solutions
- Scalable through reputation systems

**3. Stablecoin-First Architecture**
- Eliminates volatility from betting
- Predictable outcomes and payouts
- Shows real-world utility of MNEE

### 🎨 Design & UX

**1. Brutalist Aesthetic That Works**
- Unique visual identity
- High contrast and accessibility
- Professional polish throughout

**2. Mobile-Responsive Experience**
- Works perfectly on phones
- Touch-optimized interactions
- Progressive web app ready

---

## What we learned

### Technical Lessons

**1. Smart Contract Security is Everything**
- Always use ReentrancyGuard on fund movements
- State changes after external calls
- OpenZeppelin patterns save lives

**2. Gas Optimization Matters**
- Minimize storage reads/writes
- Batch operations where possible
- Every wei of gas counts for users

**3. ERC-20 Integration Subtleties**
- Approval flow UX is critical
- Always check allowances before transfers
- Clear error messages for insufficient balance

### Product Lessons

**4. Simplicity Wins**
- Started complex (prediction markets, oracle integration)
- Ended simple (P2P bets with judges)
- Simple is more useful and easier to understand

**5. Stablecoins Enable New Use Cases**
- MNEE's $1.00 peg makes betting predictable
- Users understand "100 MNEE = $100 USD"
- Volatility is a massive barrier to adoption

**6. On-Chain Identity is Powerful**
- Usernames build social layer
- Enable reputation and trust
- Foundation for network effects

### Personal Growth

**7. Solo Development is Hard but Rewarding**
- Learned full stack: Solidity → TypeScript → UI/UX
- Every decision was mine to make
- Proud of shipping complete product alone

**8. Constraints Drive Creativity**
- No ETH for mainnet → Use Sepolia with mock token
- No oracle budget → Use human judges
- Turned limitations into features

---

## What's next for MNEEBet

### Immediate (Post-Hackathon)

**🚀 Mainnet Deployment**
- Secure 0.03-0.05 ETH for deployment gas
- Deploy to Ethereum with real MNEE token (`0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`)
- Launch to real users with real USD-backed stakes

**🔐 Security Audit**
- Engage professional audit firm
- Launch bug bounty program
- Community security review

### Phase 2 (Q1-Q2 2026)

**📊 Enhanced Features**
- Multi-party bets (3+ participants)
- Tournament mode (bracket-style)
- Judge reputation scores
- Bet templates for common use cases

**🤖 AI Integration**
- AI-powered bet term suggestions
- Natural language bet creation
- Evidence analysis for judges
- Fraud detection

### Phase 3 (Q3-Q4 2026)

**🔗 Oracle Integration**
- Chainlink price feeds for sports
- Automated settlement for data-driven markets
- API-based outcome verification
- Hybrid judge + oracle resolution

**📱 Mobile Apps**
- Native iOS and Android
- Push notifications
- Streamlined mobile UX
- Offline bet creation

### Phase 4 (2027+)

**🌐 Ecosystem Expansion**
- Deploy to L2s (Optimism, Arbitrum, Base)
- Cross-chain bet bridging
- DAO governance with token
- Professional sports betting support

**💼 B2B Offerings**
- White-label betting infrastructure
- API for third-party integrations
- Corporate challenge platforms
- Esports integration

---

## Why This Project Matters for Web3

### Solving Real Coordination Problems

MNEEBet demonstrates how **programmable money** can eliminate intermediaries in financial coordination:

1. **Trustless Escrow**: No need to trust a platform—smart contract holds funds
2. **Transparent Resolution**: All decisions on-chain and verifiable
3. **Instant Settlement**: No waiting for manual payouts
4. **Fair Economics**: Zero fees means participants keep 100%

### MNEE Stablecoin Showcase

This project proves MNEE's utility as **programmable stable money**:

- ✅ Used as escrow currency in smart contracts
- ✅ Enables predictable financial outcomes
- ✅ Eliminates volatility from peer-to-peer transactions
- ✅ Ready for real-world financial applications

### Future of Finance

MNEEBet is a blueprint for **automated financial coordination**:

- Replace centralized betting platforms
- Enable P2P financial agreements
- Build reputation through on-chain history
- Scale coordination without intermediaries

**This is programmable finance in action.**

---

## Technical Details

### Smart Contract

**Sepolia Deployment:**
- MNEEBet: `0x3480874a63D459046993915b52e612ee69947a81`
- Mock MNEE: `0xb8B51876429980d20ed20796B1C4294f1Fc75145`

**Mainnet Ready:**
- MNEE Token: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`
- Deployment pending: Gas costs (~0.03-0.05 ETH)

**Key Functions:**
```solidity
createBet(opponent, amount, terms, deadline, judge)
acceptBet(betId)
resolveWithJudge(betId, winner)
cancelBet(betId)
```

**Security:**
- OpenZeppelin ReentrancyGuard
- Ownable access control
- Pausable emergency circuit breaker
- 30-day dispute timelock

### Frontend

**Live Demo:** [https://mneebet.vercel.app](https://mneebet.vercel.app)

**Tech Stack:**
- Next.js 16.1
- TypeScript
- Wagmi v2
- RainbowKit
- TailwindCSS

**Repository:** [github.com/NikhilRaikwar/MNEEBet](https://github.com/NikhilRaikwar/MNEEBet)

---

## Team

**Nikhil Raikwar** - Solo Developer  
📍 Bhopal, Madhya Pradesh, India  
🐦 [@NikhilRaikwarr](https://twitter.com/NikhilRaikwarr)  
💻 [GitHub](https://github.com/NikhilRaikwar)

---

## Built With

- Solidity
- OpenZeppelin
- Ethereum
- MNEE Stablecoin
- Next.js
- TypeScript
- Wagmi
- RainbowKit
- TailwindCSS
- Vercel

---

**🏆 Built for MNEE Hackathon: Programmable Finance & Automation**

*Demonstrating how programmable money eliminates intermediaries in peer-to-peer financial coordination.*

**Live Demo:** [https://mneebet.vercel.app](https://mneebet.vercel.app)  
**Smart Contract:** [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x3480874a63D459046993915b52e612ee69947a81)  
**Documentation:** [GitHub Repository](https://github.com/NikhilRaikwar/MNEEBet)