import './pc.less'

import CommonHeader from './Header'
import CommonSider from './Sider'
import { isDaoframeSite } from 'utils/dao'

export default function Layout({ children }: { children: any }) {
  return (
    <div className="container" style={{ width: '100%', paddingLeft: !isDaoframeSite() ? '120px' : 0 }}>
      <CommonHeader />
      {!isDaoframeSite() && <CommonSider />}
      {children}
    </div>
  )
}
