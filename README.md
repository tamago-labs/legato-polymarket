# Legato Polymarket 

**Building Polymarket for Move, powered by AI**

![Screencast2024-09-25153313-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/22e2dac8-5588-4f95-928b-1145837c362c)

Legato’s new DeFi's prediction market product, developed at the [Aptos Code Collision Hackathon](https://aptosfoundation.org/events/code-collision) and now live on Mainnet, letting users predict various outcomes from BTC prices to custom markets tied to trending topics or provide liquidity to a liquidity pool to earn passive income from countering bets and Aptos staking rewards through Legato's liquid staking.

The system leverages AI's LLM to analyze external data, such as historical prices and news, to find appropriate probabilities for each outcome, leading to real-time dynamic odds that allow users to bet with ease. This also balances the supply side and demand side between liquidity providers and bettors within the system.

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

1. **AI Engine** - Running on the backend, it's essentially a RAG application that extends the knowledge capacity of the LLM (in our case, Claude AI) by providing context before further processing.

2. **Smart Contract** - Built with Aptos Move, it features a liquidity pool that issues LP tokens as FA assets when liquidity is supplied. The value of LP tokens increases over time and can be exchanged for more APT upon withdrawal.

It works by the admin team (Legato) creating a round that contains information about what to predict (such as BTC price for the next month) and outcomes with a maximum of 4 options (for example, A. <$60,000 and B. >$60,000). 

At the end of the round, the admin is obligated to reveal the result and then the smart contract will automatically distribute the prizes to all winners.

## AI-Engine

One of the core modules, made with Node.js and Express, runs on the server and uses [Langchain](https://www.langchain.com/) to interconnect all the underlying AI services we’re utilizing from LLM to text embedding services. We will see this approach become more common when we want to integrate dApps with AI.

The engine operates on a daily schedule, there is a config file to provide round and outcome details and relevant context links, as shown below.

```
export const CONFIG = {
    markets: ["BTC", "APT"],
    rounds: [1, 2],
    timestamps: [1727658000, 1728867600],
    context: [
        "https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/apt-prices.md",
        "https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/btc-prices.md"
    ],
    outcomes: {
        "BTC" : [
            "A. < $60,000",
            "B. $60,000 - $63,000",
            "C. $63,000 - $66,000",
            "D. > $66,000"
        ],
        "APT" : [
            "A. < $7.5",,
            "B. > $7.5",
        ]
    }

}
```

Consequently, the text prompt is created and used to query the LLM as follows and the result is then uploaded to the smart contract.

```
Please suggest probabilities between 0 and 1 on our DeFi prediction market system
predicting the BTC price on Oct 1, 2024, with the following outcomes:
A. < $60,000,
B. $60,000 - $63,000,
C. $63,000 - $66,000
D. > $66,000
```

Prior to querying, the prompt needs to be guided by the system prompt, as shown below.

```
You are an AI agent assigned to analyze external data and set appropriate values for DeFi protocols.
Use the following pieces of context to answer the question.
Return the result as an array with the values only.
\n\n
Context: {context}
```

The provided context contains historical prices of BTC and APT allowing the AI to understand the most recent situation and respond accurately.

| ID                           | Title                                    |
| ---------------------------- | ---------------------------------------- |
| [apt-prices](https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/apt-prices.md)    | APT Historical Prices & Volumes     |  
| [btc-prices](https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/btc-prices.md)    | BTC Historical Prices & Volumes         |

Apart from checking probabilities on the smart contract, the engine has its own simple database (PouchDB) and API endpoints that allow us to fetch reports on each round and markets that have been analyzed.

|   |type|description|
|---|--- |---                      |
|**/**|get|for heartbeat|
|**/report/:market/:round**|get|get a report |

## Smart Contract

The smart contract is one of the main modules and is crucial for the DeFi prediction market. It's written in Aptos Move and stores values set by AI, manages liquidity pools, handles bets and distributes rewards automatically.

Each outcome's odds are calculated automatically using the following formula, which sums the raw values provided by the AI engine and each outcome's liquidity. The default weight is 70%, meaning that 70% comes from the AI and 30% comes from the liquidity pool.

![Screenshot from 2024-09-26 12-47-54](https://github.com/user-attachments/assets/c19428f1-67a6-4cc1-8b67-ace2ec8f871e)

Final odds are calculated from 1/p(adjusted). For example, if we want to bet on outcome A with odds of 3.0, when we place a bet of 1 APT, we will receive 3 APT at the end of the round before deducting the winning fee, which is set to a default of 10%. Each round lasts for 2 weeks, during which we can place bets on the current round and any future available rounds. Odds are subject to change at any time but will be locked once the bet is placed.

![Untitled Diagram drawio (14)](https://github.com/user-attachments/assets/82d7548f-5b23-499a-a3b2-2c0b5d42a37e)


Before anyone can bet on an outcome, liquidity must be added to the liquidity pool. We implement a single liquidity pool system that covers P/L for all markets and rounds. The pool is integrated with Legato's liquid staking to earn staking rewards. Basically , we can add liquidity to the pool starting from 1 APT. All APT will be kept in the liquid staking vault until it reaches 11 APT, at which point the vault will move the APT to the validator.

Since all APT are staked (or pending staking), when withdrawing, we need to request a withdrawal and wait up to 3 days for the vault to complete the unstaking process from the validator. Once completed, APT will be transferred to the original wallet automatically.

## How to Use

Navigate to https://legato.finance and go to the market section then perform the following actions:

**1. Connect The Wallet**

* Click connect and choose your preferred wallet (e.g., Petra, Martian) and authorize the connection.
* Ensure your wallet is funded with APT to participate in betting or provide liquidity.

**2. Place a Bet**

* Select a market (BTC or APT) and review the available outcomes and their current odds.
* Choose the outcome you want to bet on, enter the amount of APT and confirm the transaction.
* Once the bet is placed, your odds will lock in and the system will automatically update your position.

**3. Claim Rewards**

* If you have a winning bet, your rewards will be transferred directly to your wallet after the round concludes.

## How to Test


The project uses a Lerna monorepo. After downloading this repo onto your machine, you can then run:

```
npm install
```
  
Ensure you obtain all API keys from the AI services we are using and place them in the .env file.

```
ANTHROPIC_API_KEY=your-api-key
VOYAGEAI_API_KEY=your-api-key 
```

You may also provide the necessary values as shown in the .env file. Once completed, we can run tests of the AI engine and smart contract as follows.

```
npm run test
npm run test-engine
```

The engine itself can also run with the following components to read the provided context, analyze and set outcome probabilities on the smart contract.

```
npm run package:engine
```

## Deployment

### Aptos Mainnet

Component Name | ID/Address
--- | --- 
Market Contract |  0x3de3ff1f80b7fce6dff30ebddedf09977328a0b4f958a6d942731a696816cb31
LP Metadata | 0x6d4acd6d6f6506af452abe82fc0fe6b987346f232e1428adfea5411859800e75

## Roadmap

Currently, we've deployed the MVP of our prediction market including the AI engine live on Aptos Mainnet and we're looking forward to building more sophisticated features that enable market creation by users and expanding to other chains. 

This repo contains only the early version of the project. More updates, including new features and improvements, will be merged into the main [Legato repo](https://github.com/tamago-labs/legato-finance).

## License

MIT © [Tamago Labs](https://github.com/tamago-labs)

