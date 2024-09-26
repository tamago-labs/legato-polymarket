


import { expect } from "chai";
import RagChain from "../core/ragChain.js";
import axios from "axios"

let chain

describe('#rag_market()', function () {

    before(function () {
        chain = new RagChain()
    })

    it('should build rag chain success', async function () {

        // Fed the knowledge
        const apt_price = await axios.get("https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/apt-prices.md")
        await chain.add("apt_price", Buffer.from(apt_price.data).toString('base64'))

        const btc_price = await axios.get("https://raw.githubusercontent.com/tamago-labs/legato-polymarket/refs/heads/main/packages/context/btc-prices.md")
        await chain.add("btc_price", Buffer.from(btc_price.data).toString('base64'))

        await chain.build(["apt_price", "btc_price"])

    })

    it('should suggest probability values success', async function () {

        const q = [
            "Please suggest probabilities between 0 and 1 on our DeFi prediction market system",
            "predicting the BTC price on Oct 1, 2024, with the following outcomes:",
            "A. < $60,000",
            "B. $60,000 - $63,000",
            "C. $63,000 - $66,000",
            "D. > $66,000",
        ].join()

        // Uncomment to reveal 
        // const result = await chain.query(q)
        // console.log(result)

        // Example output
        // Based on the provided historical BTC price data, here are the suggested probabilities for the BTC price on Oct 1, 2024:
        // [0.3, 0.25, 0.25, 0.2]
        // Explanation:
        // A. < $60,000: 0.3 (30% probability)
        // The prices in the data show a range between $54,841 and $71,333, with several instances below $60,000, so a moderate probability is assigned.
        // B. $60,000 - $63,000: 0.25 (25% probability)
        // The data shows a few instances within this range, so a moderate probability is assigned.
        // C. $63,000 - $66,000: 0.25 (25% probability)
        // The data shows a few instances within this range as well, so a moderate probability is assigned.
        // D. > $66,000: 0.2 (20% probability)
        // The data shows fewer instances above $66,000, so a slightly lower probability is assigned.
        // These probabilities are based on the historical price distribution and can be adjusted based on additional market analysis or external factors

    })

    after(async function () {
        await chain.destroy()
    })

})