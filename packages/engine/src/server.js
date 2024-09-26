import express from "express";
import cors from "cors"
import * as fastq from "fastq";
import cron from "node-cron"
import RagChain from "./core/ragChain.js";
import ContractData from "./core/contractData.js"

import { CONFIG } from "./config.js";

import dotenv from "dotenv"
import { parseValues } from "./utils/string.js";

dotenv.config()

export const app = express()

const chain = new RagChain()
const contract = new ContractData()

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(cors())

// Implement a simple pub-sub

const queue = fastq.promise(async (args) => {

    const { config } = args

    // Build a RAG chain first
    console.log("Building RAG...")
    await chain.init(config.context)

    let count = 0

    for (let round of config.rounds) {

        console.log("Working on round#", round)

        for (let market of config.markets) {

            const outcomes = config.outcomes[market]

            const prompt = [
                `Please suggest probabilities between 0 and 1 on our DeFi prediction market system`,
                `predicting the ${market} price on ${(new Date(Number(config.timestamps[count]) * 1000)).toUTCString()}, with the following outcomes:`,
            ].concat(outcomes).join()

            console.log("Querying with:", prompt)

            const report = await chain.query(prompt)

            await chain.saveReport(market.toUpperCase(), round, report)
            console.log("Report saved.")

            // Update values on the smart contract

            try {
                const values = parseValues(report)
                await contract.updateValues(market, round, values)
            } catch (e) {
                console.log(e)
            }
        }

        count += 1
    }

}, 1)

// Routes

// health-check
app.get('/', async (req, res) => {
    return res.status(200).json({ status: "ok" });
})

app.get("/report/:symbol/:round", async (req, res) => {

    const { params } = req
    const { symbol, round } = params

    try {
        return res.status(200).json(await chain.getReport(symbol.toUpperCase(), round))
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }
})



const updateProbabilities = async () => {

    console.log("Find probabilities for ", CONFIG.rounds.length, " rounds on ", CONFIG.markets)

    // markets: ["BTC", "APT"],
    // rounds: [1, 2],
    // timestamps: [1727658000, 1728867600],
    // context: [
    //     "https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/apt-prices.md",
    //     "https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/btc-prices.md"
    // ],
    // outcomes: {
    //     "BTC" : [
    //         "A. < $60,000",
    //         "B. $60,000 - $63,000",
    //         "C. $63,000 - $66,000",
    //         "D. > $66,000"
    //     ],
    //     "APT" : [
    //         "A. < $7.5",,
    //         "B. > $7.5",
    //     ]
    // }

    queue.push({ config: CONFIG })

}

cron.schedule('*/3 * * * *', updateProbabilities)
