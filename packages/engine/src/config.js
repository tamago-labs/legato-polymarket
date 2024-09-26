

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