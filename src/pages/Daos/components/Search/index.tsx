import './index.less'
import IconSearch from '../../../../assets/images/icon-search.svg'
export type SearchParams = {
  value: string
  type: string
}
interface ISearchProps {
  onSearch: (val: SearchParams) => void
  placeholder?: string
}
export default function Index({ placeholder, onSearch }: ISearchProps) {
  return (
    <div className="search-container">
      <input className="ant-input" type="text" placeholder={placeholder || 'search'} />
      <div
        className="icon-search"
        onClick={() => {
          onSearch({
            value: '1',
            type: '1'
          })
        }}
      >
        <img src={IconSearch} alt="" />
      </div>
    </div>
  )
}
