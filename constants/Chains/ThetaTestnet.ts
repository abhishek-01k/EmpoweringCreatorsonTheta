import { defineChain } from "thirdweb";


export const ThetaTestnet = defineChain({
    id: 365,
    name: "Theta Testnet",
    rpc: 'https://eth-rpc-api-testnet.thetatoken.org/rpc',
    nativeCurrency: { name: "TFUEL", symbol: "TFUEL", decimals: 0 }
});