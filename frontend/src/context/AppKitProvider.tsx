import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = '8433bd36a54f931d1307f14d93f1f805';

// 2. Create a metadata object - optional
const metadata = {
    name: 'Bonding curve',   
    description: 'Bonding curve',
    url: '', 
    icons: ['']
}

// 3. Set the networks
export const networks = [sepolia] as [AppKitNetwork, ...AppKitNetwork[]] 

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    // ssr: true
})

// 5. Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        email: false,
        socials: false,
        analytics: false,
        swaps: false,
        onramp: false,
    },
    themeMode: "dark",
})

type AppKitProviderProps = {
  children: React.ReactNode
}

export function AppKitProvider({ children }:AppKitProviderProps) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}