import { useAppKitNetwork, useAppKitAccount } from '@reown/appkit/react'
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useEffect, useMemo, useState } from 'react'
const BondingCurveABI = [{ "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }, { "internalType": "uint256", "name": "initialSupply", "type": "uint256" }, { "internalType": "uint256", "name": "basePriceWei", "type": "uint256" }, { "internalType": "uint256", "name": "slopeWeiPerToken", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "ethIn", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokensOut", "type": "uint256" }], "name": "Bought", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokensIn", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethOut", "type": "uint256" }], "name": "Sold", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "basePrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "buy", "outputs": [{ "internalType": "uint256", "name": "tokensOut", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "currentPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokensIn", "type": "uint256" }], "name": "estimateEthForTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "ethIn", "type": "uint256" }], "name": "estimateTokensForEth", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "sell", "outputs": [{ "internalType": "uint256", "name": "ethOut", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "slope", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]

const BondingCurveToken = "0x052D237850FEaD46C860eD1FE63f18Cdb53F1c20"

import { parseEther, formatEther } from 'viem'

function App() {
  const { isConnected, address } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()

  // ---- UI state ----
  const [buyEth, setBuyEth] = useState('0.01')
  const [buyEst, setBuyEst] = useState<bigint | null>(null)

  const [sellTok, setSellTok] = useState('0')
  const [sellEst, setSellEst] = useState<bigint | null>(null)

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  // ---- Reads ----
  const priceQ = useReadContract({
    address: BondingCurveToken,
    abi: BondingCurveABI,
    functionName: 'currentPrice',
    query: { refetchInterval: 10_000 }
  })

  const supplyQ = useReadContract({
    address: BondingCurveToken,
    abi: BondingCurveABI,
    functionName: 'totalSupply',
    query: { refetchInterval: 10_000 }
  })

  const symbolQ = useReadContract({
    address: BondingCurveToken,
    abi: BondingCurveABI,
    functionName: 'symbol'
  })

  const decimalsQ = useReadContract({
    address: BondingCurveToken,
    abi: BondingCurveABI,
    functionName: 'decimals'
  })

  const myBalQ = useReadContract({
    address: BondingCurveToken,
    abi: BondingCurveABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: isConnected && !!address, refetchInterval: 12_000 }
  })

  const estBuyQ = useReadContract({
    address: BondingCurveToken,
    abi: BondingCurveABI,
    functionName: 'estimateTokensForEth',
    args: [buyEth && Number(buyEth) > 0 ? parseEther(buyEth) : 0n],
    query: { enabled: Number(buyEth) > 0 }
  })

  // sell estimate
  const estSellQ = useReadContract({
    address: BondingCurveToken,
    abi: BondingCurveABI,
    functionName: 'estimateEthForTokens',
    args: [sellTok && Number(sellTok) > 0 ? parseEther(sellTok) : 0n],
    query: { enabled: Number(sellTok) > 0 }
  })

  // ---- Writes ----
  const {
    writeContract,
    data: writeHash,
    isPending: writePending,
    isSuccess: writeSent,
    error: writeError
  } = useWriteContract()

  // Wait for mined
  const waitQ = useWaitForTransactionReceipt({
    hash: writeHash ?? txHash,
    confirmations: 1
  })

  // Update tx hash display
  useEffect(() => {
    if (writeHash) setTxHash(writeHash)
  }, [writeHash])

  // Auto-estimate when inputs change
  useEffect(() => {
    ; (async () => {
      try {
        if (Number(buyEth) > 0) {
          const { data } = await estBuyQ.refetch({ throwOnError: false, cancelRefetch: true })
          setBuyEst((data as bigint) ?? null)
        } else setBuyEst(null)
      } catch { setBuyEst(null) }
    })()
  }, [buyEth])

  useEffect(() => {
    ; (async () => {
      try {
        if (Number(sellTok) > 0) {
          const { data } = await estSellQ.refetch({ throwOnError: false, cancelRefetch: true })
          setSellEst((data as bigint) ?? null)
        } else setSellEst(null)
      } catch { setSellEst(null) }
    })()
  }, [sellTok])

  // ---- Actions ----
  const handleBuy = async () => {
    if (!isConnected) return
    try {
      writeContract({
        address: BondingCurveToken,
        abi: BondingCurveABI,
        functionName: 'buy',
        value: parseEther(buyEth)
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleSell = async () => {
    if (!isConnected) return
    try {
      writeContract({
        address: BondingCurveToken,
        abi: BondingCurveABI,
        functionName: 'sell',
        args: [parseEther(sellTok)]
      })
    } catch (e) {
      console.error(e)
    }
  }

  const status = useMemo(() => {
    if (writePending) return 'Submitting transaction...'
    if (writeSent && !waitQ.isSuccess) return 'Waiting for confirmations...'
    if (waitQ.isSuccess) return 'Transaction confirmed'
    if (writeError) return (writeError as any)?.shortMessage || (writeError as Error).message
    return ''
  }, [writePending, writeSent, waitQ.isSuccess, writeError])

  return (
    <>

      {/* <div style={{ maxWidth: 720, margin: '24px auto', fontFamily: 'ui-sans-serif' }}>
        <h2>Bonding Curve Token</h2>
        <div style={{ fontSize: 12 }}>
          ChainId: {chainId ?? '—'} &nbsp;|&nbsp; Connected: {isConnected ? 'yes' : 'no'}
        </div>

        <div style={{ marginTop: 12 }}>
          <div><b>Symbol:</b> {symbolQ.data as string ?? "..."} </div>
          <div><b>Decimals:</b> {decimalsQ.data as string ?? '…'}</div>
          <div><b>Current price:</b> {priceQ.data ? `${formatEther(priceQ.data as bigint)} ETH / token` : '…'}</div>
          <div><b>Total supply:</b> {supplyQ.data ? `${formatEther(supplyQ.data as bigint)} ${symbolQ.data ?? ''}` : '…'}</div>
          <div><b>Your balance:</b> {myBalQ.data ? `${formatEther(myBalQ.data as bigint)} ${symbolQ.data ?? ''}` : (isConnected ? '0' : '—')}</div>
        </div>

        <hr style={{ margin: '20px 0' }} />

        <section>
          <h3>Buy</h3>
          <label>
            ETH to spend:&nbsp;
            <input
              value={buyEth}
              onChange={(e) => setBuyEth(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <div>Est. tokens: <b>{buyEst ? formatEther(buyEst) : '0'}</b> {symbolQ.data as string ?? ''}</div>
          <button onClick={handleBuy} disabled={!isConnected || Number(buyEth) <= 0}>Buy</button>
        </section>

        <hr style={{ margin: '20px 0' }} />

        <section>
          <h3>Sell</h3>
          <label>
            Tokens to sell:&nbsp;
            <input
              value={sellTok}
              onChange={(e) => setSellTok(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <div>Est. ETH back: <b>{sellEst ? formatEther(sellEst) : '0'}</b> ETH</div>
          <button onClick={handleSell} disabled={!isConnected || Number(sellTok) <= 0}>Sell</button>
        </section>

        {status && <div style={{ marginTop: 12 }}><b>Status:</b> {status}</div>}
        {txHash && (
          <div style={{ marginTop: 4 }}>
            <b>Tx:</b> <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
          Note: selling requires the contract to hold enough ETH; buy first or pre-fund the contract.
        </div>
      </div> */}


      <div className="min-h-screen bg-[#0b0d10] text-zinc-200 px-4 py-10 w-full">
        <div className="mx-auto max-w-6xl">
          <div className='flex items-center justify-between mb-8'>
            <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight">
              CURVE Bonding — Buy & Sell
            </h1>
            <appkit-button />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Buy Card */}
            <section className="relative rounded-xl border border-emerald-800/40 bg-emerald-950/30 p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-emerald-400"
                    >
                      <path d="M4 14l5-5 4 4 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2 className="text-xl font-semibold">Buy CURVE</h2>
                </div>

                <span className="rounded-full border border-emerald-700/40 bg-emerald-900/30 px-3 py-1 text-xs text-emerald-300">
                  Bonding Curve
                </span>
              </div>

              <label className="mb-2 block text-sm text-zinc-400">Pay with ETH</label>
              <div className="mb-5 flex items-center justify-between text-xs text-zinc-400">
                <span></span>
                <span>Current Price: {priceQ.data ? `${Number(formatEther(priceQ.data as bigint)).toFixed(6)} ETH / token` : '…'}</span>
              </div>

              <input
                type="text"
                value={buyEth}
                onChange={(e) => setBuyEth(e.target.value)}
                placeholder="0.00"
                className="mb-4 w-full rounded-lg border border-emerald-800/40 bg-[#111415] px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none ring-emerald-700/30 focus:border-emerald-500 focus:ring-2"
              />
              {/* Estimated Value */}
              <p className="mb-4 text-xs text-zinc-400">
                Estimated Value: <span className="text-emerald-300">{buyEst ? formatEther(buyEst) : '0'} {symbolQ.data as string ?? ''}</span>
              </p>
              <button
                className="w-full rounded-lg bg-emerald-700 py-3 font-medium text-white shadow hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleBuy} disabled={!isConnected || Number(buyEth) <= 0}
              >
                {!writePending ? "Buy CURVE" : "Loading..."}
              </button>
            </section>

            {/* Sell Card */}
            <section className="relative rounded-xl border border-red-900/40 bg-red-950/30 p-6 shadow-[0_0_0_1px_rgba(239,68,68,0.12)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-red-400"
                    >
                      <path d="M20 10l-5 5-4-4-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2 className="text-xl font-semibold">Sell CURVE</h2>
                </div>

                <span className="rounded-full border border-red-900/40 bg-red-900/30 px-3 py-1 text-xs text-red-300">
                  Bonding Curve
                </span>
              </div>

              <label className="mb-2 block text-sm text-zinc-400">Pay with SCT Tokens</label>
              <div className="mb-5 flex items-center justify-between text-xs text-zinc-400">
                <span></span>
                <span>Current Price: {priceQ.data ? `${Number(formatEther(priceQ.data as bigint)).toFixed(6)} ETH / token` : '…'}</span>
              </div>

              <input
                type="text"
                placeholder="0.00"
                className="mb-4 w-full rounded-lg border border-red-900/40 bg-[#111415] px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none ring-red-800/30 focus:border-red-500 focus:ring-2"
                value={sellTok}
                onChange={(e) => setSellTok(e.target.value)}
              />
              {/* Estimated Value */}
              <p className="mb-4 text-xs text-zinc-400">
                Estimated Value: <span className="text-red-300">{sellEst ? formatEther(sellEst) : '0'} ETH</span>
              </p>

              <button
                className="w-full rounded-lg bg-red-700 py-3 font-medium text-white shadow hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSell} disabled={!isConnected || Number(sellTok) <= 0}
              >
                Sell CURVE
              </button>
            </section>
          </div>
          {/* Token Information */}
          <div className="rounded-xl border border-zinc-700 bg-[#111415] p-6 text-sm mt-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Token Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-zinc-400">Token Name:</span>{" "}
                <span className="font-medium text-white">Curve Token</span>
              </div>


              <div>
                <span className="text-zinc-400">Symbol:</span>{" "}
                <span className="font-medium text-white">{symbolQ.data as string ?? "..."}</span>
              </div>
              <div>
                <span className="text-zinc-400">Total Supply:</span>{" "}
                <span className="font-medium text-white">{supplyQ.data ? `${formatEther(supplyQ.data as bigint)} ${symbolQ.data ?? ''}` : '…'}</span>
              </div>
              <div>
                <span className="text-zinc-400">Contract Address:</span>{" "}
                <span className="font-mono text-emerald-400">
                  {BondingCurveToken}
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Decimals:</span>{" "}
                <span className="font-medium text-white">{decimalsQ.data as string ?? '…'}</span>
              </div>
            </div>
          </div>
          {/* Chain & Wallet Information */}
          <div className="rounded-xl border border-zinc-700 bg-[#111415] p-6 text-sm mt-4">
            <h2 className="mb-4 text-lg font-semibold text-white">Chain & Wallet</h2>
            <div className="space-y-2">

              <div>
                <span className="text-zinc-400">Chain ID:</span>{" "}
                <span className="font-medium text-white">{chainId}</span>
              </div>
              <div>
                <span className="text-zinc-400">Connected: </span>{" "}
                <span className="font-medium text-white">{isConnected ? 'yes' : 'no'}</span>
              </div>
              <div>
                <span className="text-zinc-400">Your balance:: </span>{" "}
                <span className="font-medium text-white">{myBalQ.data ? `${formatEther(myBalQ.data as bigint)} ${symbolQ.data ?? ''}` : (isConnected ? '0' : '—')}</span>
              </div>
            </div>
          </div>
          {status && <div style={{ marginTop: 12 }}><b>Status:</b> {status}</div>}
          {txHash && (
            <div style={{ marginTop: 4 }}>
              <b>Tx:</b> <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
            </div>
          )}
        </div>
      </div>

    </>
  )
}



export default App
