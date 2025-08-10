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
      <appkit-button />
      <div style={{ maxWidth: 720, margin: '24px auto', fontFamily: 'ui-sans-serif' }}>
        <h2>Bonding Curve Token</h2>
        <div style={{ fontSize: 12}}>
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
      </div>
    </>
  )
}

export default App
