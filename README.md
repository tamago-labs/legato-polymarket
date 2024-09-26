# Legato Polymarket 

**Polymarket, built for Move, powered by AI**

![Screencast2024-09-25153313-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/22e2dac8-5588-4f95-928b-1145837c362c)

Legato’s new DeFi's prediction market product, developed at the Aptos Code Collision Hackathon and now live on Mainnet, letting users predict various outcomes from BTC prices to custom markets tied to trending topics.

The project uses AI's LLM to analyze external data, such as historical prices and news, to set probabilities for each outcome, leading to real-time dynamic odds that balance liquidity providers and bettors within the system.

- [YouTube](https://youtu.be/JcuDIRG7eIY)
- [Dapp](https://legato.finance)

## Highlighted Features
- Supports BTC & APT price predictions (+1 custom market that we introduce from time to time like the US election)
- Real-time dynamic odds with AI (With Claude AI, Voyage AI and Langchain)
- Provide liquidity to earn passive yield from counter bets and Aptos staking rewards
- Live on Aptos Mainnet

## System Overview
![Legato - Market Prediction - September 2024 (1).png](https://cdn.dorahacks.io/static/files/1922dad4dd23377f8da0eba4773b1d0c.png)

The system comprises two main modules:

1. **AI Engine** - Running on the backend, it's essentially a RAG application that extends the knowledge capacity of the LLM (in our case, Claude AI) by providing context before further analysis.

2. **Smart Contract** - Built with Aptos Move, it features a liquidity pool that issues LP tokens as FA assets when liquidity is supplied. The value of LP tokens increases over time and can be exchanged for more APT upon withdrawal.

It works by the admin team (Legato) creating a round that contains information about what to predict (such as BTC price for the next month) and outcomes with a maximum of 4 options (for example, A. <$60,000 and B. >$60,000). At the end of the round, the admin is obligated to reveal the result, and then the smart contract will automatically distribute the prizes to all winners.
