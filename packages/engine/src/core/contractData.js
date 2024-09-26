import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey, U64, U8 } from "@aptos-labs/ts-sdk"

import assert from "assert"
import dotenv from "dotenv"


dotenv.config()

// A class that handles Aptos's smart contract updating

class ContractData {


    getAptosConfig = () => {
        const aptosConfig = new AptosConfig({ network: Network.TESTNET })
        const aptos = new Aptos(aptosConfig)
        return aptos
    }

    getAccount = async () => {
        const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY);
        return await Account.fromPrivateKey({ privateKey });
    }

    getAccountAddress = async () => {
        const account = await this.getAccount()
        return `${account.accountAddress}`
    }

    updateValues = async (market, round, values) => {

        console.log("Update with values:", values)

        const sdk = await this.getAptosConfig()

        const account = await this.getAccount()

        const txn = await sdk.transaction.build.simple({
            sender: account.accountAddress,
            data: {
                function: "0x3de3ff1f80b7fce6dff30ebddedf09977328a0b4f958a6d942731a696816cb31::market::set_market_probabilities",
                functionArguments: [
                    new U64(Number(round)),
                    new U8(market === "BTC" ? 0 : 1),
                    new U64(Number(values[0] || 0) * 10000),
                    new U64(Number(values[1] || 0) * 10000),
                    new U64(Number(values[2] || 0) * 10000),
                    new U64(Number(values[3] || 0) * 10000),
                    new U64(15000)
                ],
            },
        });

        const response = await sdk.signAndSubmitTransaction({ signer: account, transaction: txn });

        console.log("Waiting for transaction ", response.hash )

        // wait for transaction
        await sdk.waitForTransaction({ transactionHash: response.hash });

        console.log(`${market} round ${round} has updated`)

    }

}

export default ContractData