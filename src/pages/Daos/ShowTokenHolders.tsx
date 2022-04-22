import { useDaoMembers } from 'hooks/useBackedServer'
// import { useTokenInfoByExplorer } from 'hooks/useStpExplorerData'

export default function ShowTokenHolders({ address }: { address: string | undefined }) {
  // const info = useTokenInfoByExplorer(address)
  const { page } = useDaoMembers(address)
  return <>{page.total}</>
}
