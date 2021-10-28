import React, { PureComponent } from 'react'
import Button from '@myntra/uikit-component-button'
import classnames from './input-azure-file.module.scss'
import InputFile from '@myntra/uikit-component-input-file'
import Progress from '@myntra/uikit-component-progress'

import type { InputFileValidationFunction } from '@myntra/uikit-component-input-file'

export interface Props extends BaseProps {
  /**
   * Auto start upload on file selection/change.
   * @since v0.11.0
   */
  autoStartUpload?: boolean
  /**
   * Clear value on successful upload.
   * @since v0.11.0
   */
  clearOnSuccess?: boolean
  /**
   *
   */
  placeholder?: string
  /**
   *
   */
  apiRoot: string
  /**
   * Appname to which Azure credentials are configured to
   */
  appName: string
  /**
   * The handler called when file is uploaded successfully.
   */
  onSuccess?(payload: { name: string; url: string }): void
  /**
   * The handler called if any error occurs.
   */
  onError?(error: Error): void
  /**
   * The validations passed from parent to be done before upload
   */
  validations?: Array<InputFileValidationFunction> | InputFileValidationFunction
}

interface InputAzureFileState {
  isUploading: boolean
  uploadProgress: number
  files: FileList | null
}

/**
 * A file input component that handles client side Azure blob uploads.
 *
 * __NOTE:__ This component depends on spectrum server to process uploads.
 *
 * @since 1.5.4
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-azure-file
 */
export default class InputAzureFile extends PureComponent<Props> {
  static defaultProps = {
    autoStartUpload: true,
    clearOnSuccess: false,
    placeholder: 'Choose a file...',
    appName: 'default',
  }

  state = {
    isUploading: false,
    uploadProgress: 0,
    files: null,
  }

  handleInputChange = (files: FileList) => {
    this.setState(
      {
        files,
        isUploading: false,
        uploadProgress: 0,
      },
      () => {
        if (this.props.autoStartUpload) {
          this.triggerUpload()
        }
      }
    )
    files.item(0) && this.props.onChange && this.props.onChange(files.item(0))
  }

  async triggerUpload() {
    if (this.state.files === null || this.state.files.length === 0) {
      return this.emitFileNotFoundError()
    }
    const file = this.state.files.item(0)
    this.setState({ isUploading: true })
    const url = `${this.props.apiRoot}/api/file-manager/getUploadToken/${this.props.appName}?fileNames=${file.name}`
    try {
      const response = await fetch(url, { credentials: 'include' })
      if (!response.ok) {
        this.handleError(new Error(response.statusText))
      } else {
        const sasMap = (await response.json()) || {}
        if (!sasMap[file.name]) {
          return this.handleError(new Error('Unable to generate Upload token'))
        }
        const { fileNameWithPath, sasUrl } = sasMap[file.name]
        const sasUrlObj = new URL(sasUrl)

        const request = new XMLHttpRequest()
        const fileUrl = `${sasUrlObj.origin}${sasUrlObj.pathname}`

        request.upload.onprogress = (event) => {
          if (event.lengthComputable)
            this.setState({
              uploadProgress: Math.floor((event.loaded / event.total) * 100),
              isUploading: true,
            })
        }
        request.upload.onloadend = () => {
          this.setState({ uploadProgress: 100, isUploading: false })
        }
        request.onloadend = (event) => {
          if (request.status === 201) {
            if (this.props.onSuccess) {
              this.props.onSuccess({ url: fileUrl, name: fileNameWithPath })
              if (this.props.clearOnSuccess || this.props.autoclear) {
                this.resetState()
              }
            }
          } else if (request.status !== 0) {
            this.handleError(new Error(request.statusText))
          }
        }
        request.onerror = (event) => {
          this.handleError(new Error(request.statusText))
        }
        request.open('PUT', sasUrl, true)
        request.setRequestHeader('x-ms-blob-type', 'BlockBlob')
        request.setRequestHeader('Content-Type', file.type)
        request.send(file)
      }
    } catch (err) {
      this.handleError(err)
    }
  }

  private emitFileNotFoundError() {
    this.props.onError(new Error('No file found'))
  }

  private handleError(error: Error) {
    this.resetState()
    if (this.props.onError) this.props.onError(error)
  }

  private resetState(state?: Partial<InputAzureFileState>) {
    !this.props.autoStartUpload && this.setState({ files: null })
    this.setState({
      uploadProgress: 0,
      isUploading: false,
      ...state,
    })
  }

  private handleUploadClick = () => {
    if (!this.state.files) {
      this.emitFileNotFoundError()
    } else {
      this.triggerUpload()
    }
  }
  render() {
    const {
      apiRoot,
      autoStartUpload,
      className,
      placeholder,
      onSuccess,
      appName,
      clearOnSuccess,
      ...props
    } = this.props

    return (
      <InputFile
        value={this.state.files}
        onChange={this.handleInputChange}
        placeholder={placeholder}
        className={className}
        actions={(browse) => (
          <div className={classnames('container')}>
            {this.state.isUploading ? (
              <Progress
                className={classnames('progress')}
                type="bar"
                style={{ width: '100px' }}
                value={this.state.uploadProgress}
              />
            ) : (
              <Button
                className={classnames('button')}
                type="secondary"
                loading={autoStartUpload ? this.state.isUploading : false}
                disabled={autoStartUpload ? false : this.state.isUploading}
                onClick={browse}
                size="small"
              >
                Browse
              </Button>
            )}
            {!autoStartUpload && (
              <Button
                className={classnames('button')}
                type="secondary"
                disabled={this.state.isUploading}
                onClick={this.handleUploadClick}
                size="small"
              >
                Upload
              </Button>
            )}
          </div>
        )}
        {...props}
      />
    )
  }
}
