import { defineChain } from "thirdweb";


export const ThetaMainnet = defineChain({
    id: 361,
    name: "Theta",
    rpc: 'https://eth-rpc-api-testnet.thetatoken.org/rpc',
    nativeCurrency: { name: "TFUEL", symbol: "TFUEL", decimals: 0 }
});