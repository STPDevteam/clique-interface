import { useTokenInfoByExplorer } from 'hooks/useStpExplorerData'

export default function ShowTokenHolders({ address }: { address: string | undefined }) {
  const info = useTokenInfoByExplorer(address)
  return <>{info?.holdersCount || '-'}</>
}
