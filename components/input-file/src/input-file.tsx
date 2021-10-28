import React, { PureComponent } from 'react'
import classnames from './input-file.module.scss'
import Input from '@myntra/uikit-component-input-text'
import Button from '@myntra/uikit-component-button'
import { createRef } from '@myntra/uikit-utils'

export type InputFileValidationFunction = {(file: FileList): void}

export interface Props extends BaseProps {
  placeholder?: string
  actions?(browse: () => void): React.ReactNode
  onChange?(files: FileList): void
  value?: FileList
  onError?(error: Error): void
  validations?: Array<InputFileValidationFunction> | InputFileValidationFunction
}

/**
 * A file input component that handles client side S3 uploads.
 *
 * @since 1.1.0
 * @status READY
 * @category input
 * @see http://uikit.myntra.com/components/input-file
 */
export default class InputFile extends PureComponent<Props> {
  static defaultProps = {
    placeholder: 'Choose a file...',
    actions: (upload) => (
      <Button type="secondary" onClick={upload} size="small">
        Browse
      </Button>
    ),
  }

  refInputFile: React.RefObject<HTMLInputElement>

  constructor(props) {
    super(props)

    this.refInputFile = createRef()
  }

  runValidations = (files: FileList) => {
    if(!this.props.validations) return

    if(Array.isArray(this.props.validations)) {
      for(const validation of this.props.validations) {
        validation(files);
      }

      return
    }

    this.props.validations(files)
  }

  handleOnChange = (e) => {
    const files = e.target.files
    try {
      this.runValidations(files)
      this.props.onChange && this.props.onChange(files)
    } catch(e) {
      this.props.onError && this.props.onError(e);
    }
  }

  handleBrowseClick = () => {
    this.refInputFile.current && this.refInputFile.current.click()
  }

  get filenames() {
    const filenames = []
    if (this.props.value && this.props.value.length > 0) {
      for (const file of Array.from(this.props.value)) {
        filenames.push(file.name)
      }
    }
    return filenames.join(', ')
  }

  render() {
    const { placeholder, actions, value, onError, ...props } = this.props

    return (
      <div className={classnames('input-file')}>
        <Input
          className={classnames('preview')}
          placeholder={placeholder}
          onClick={this.handleBrowseClick}
          value={this.filenames}
          title={this.filenames}
        />
        <input
          {...props}
          className={classnames('file')}
          onChange={this.handleOnChange}
          hidden
          type="file"
          ref={this.refInputFile}
        />
        {typeof actions === 'function'
          ? actions(this.handleBrowseClick)
          : actions}
      </div>
    )
  }
}
