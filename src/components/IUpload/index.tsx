import './pc.less'

import { ReactNode } from 'react'
import { message, Upload } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/lib/upload'
import { uploadPictureAddress } from 'utils/fetch/server'
import axios from 'axios'

export interface IUploadProps {
  action?: string
  method?: 'POST' | 'PUT'
  onPreviewStr?: (s?: any) => void
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
  const { action = uploadPictureAddress(), method = 'post', children } = props

  const onChange = async ({ fileList: newFileList }: UploadChangeParam) => {
    const newFile = newFileList[newFileList.length - 1]
    // onDone &&
    //   newFile &&
    //   onDone({
    //     file: newFile,
    //     preview: newFile?.originFileObj ? await getBase64(newFile?.originFileObj) : ''
    //   })
    props?.onPreviewStr && props.onPreviewStr(newFile?.originFileObj ? await getBase64(newFile?.originFileObj) : '')
    props.setResult(newFile.response?.data?.data || '')
  }

  return (
    <Upload
      action={action}
      method={method}
      customRequest={options => {
        const param = new FormData()
        param.append('file', options.file)
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
        axios.post(options.action, param, config).then(res => {
          options.onSuccess(res, options.file)
        })
      }}
      beforeUpload={beforeUpload}
      onChange={onChange}
      showUploadList={false}
    >
      {children}
    </Upload>
  )
}

export default IUpload
