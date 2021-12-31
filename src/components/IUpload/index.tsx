import './pc.less'

import { useState, ReactNode } from 'react'
import { Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'

export interface IUploadProps {
  action?: string
  method?: 'POST' | 'PUT'
  onDone?: (s?: any) => void
  children?: ReactNode
}

// for preview
function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const IUpload = (props: IUploadProps) => {
  const { action = 'https://www.mocky.io/v2/5cc8019d300000980a055e76', method = 'post', children, onDone } = props
  const [fileList, setFileList] = useState<any>([])

  const onChange = async ({ fileList: newFileList }: UploadChangeParam) => {
    setFileList(newFileList)
    onDone &&
      newFileList[0] &&
      onDone({
        file: newFileList[0],
        preview: newFileList[0]?.originFileObj ? await getBase64(newFileList[0]?.originFileObj) : ''
      })
  }

  return (
    <Upload action={action} method={method} fileList={fileList} onChange={onChange} showUploadList={false}>
      {children}
    </Upload>
  )
}

export default IUpload
