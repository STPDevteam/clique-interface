import './pc.less'

import CommonHeader from './Header'
import CommonSider from './Sider'

export default function Layout({ children }: { children: any }) {
  return (
    <div className="container">
      <CommonHeader />
      <CommonSider />
      {children}
    </div>
  )
}
