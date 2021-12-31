import './pc.less'

import CommonHeader from './Header'
import CommonSider from './Sider'

export default function Layout({ children }: { children: any }) {
  return (
    <div className="container" style={{ width: '100%' }}>
      <CommonHeader />
      <CommonSider />
      {children}
    </div>
  )
}
