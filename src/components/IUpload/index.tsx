import './pc.less'

import { useState, ReactNode } from 'react'
import { message, Upload } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/lib/upload'

export interface IUploadProps {
  action?: string
  method?: 'POST' | 'PUT'
  onDone?: (s?: any) => void
  children?: ReactNode
  setResult: (val: string) => void
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

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt = file.size / 1024 / 1024 < 2
  if (!isLt) {
    message.error('Image must smaller than 500KB!')
  }
  return isJpgOrPng && isLt
}

const IUpload = (props: IUploadProps) => {
  const { action = 'https://www.mocky.io/v2/5cc8019d300000980a055e76', method = 'post', children, onDone } = props
  const [fileList, setFileList] = useState<any>([])

  const onChange = async ({ fileList: newFileList }: UploadChangeParam) => {
    setFileList(newFileList)
    const curBase64 = newFileList[0]?.originFileObj ? await getBase64(newFileList[0]?.originFileObj) : ''
    onDone &&
      newFileList[0] &&
      onDone({
        file: newFileList[0],
        preview: newFileList[0]?.originFileObj ? await getBase64(newFileList[0]?.originFileObj) : ''
      })
    props.setResult(typeof curBase64 === 'string' ? curBase64 : '')
  }

  return (
    <Upload
      action={action}
      method={method}
      beforeUpload={beforeUpload}
      fileList={fileList}
      onChange={onChange}
      showUploadList={false}
    >
      {children}
    </Upload>
  )
}

export default IUpload
