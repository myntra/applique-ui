declare namespace Form {
  declare function Text(
    props: Field.Props & Form.FormFieldProps & InputText.Props
  ): JSX.Element
  declare function Select(
    props: Field.Props & Form.FormFieldProps & InputSelect.Props
  ): JSX.Element
  declare function Checkbox(
    props: Field.Props & Form.FormFieldProps & InputCheckbox.Props
  ): JSX.Element
  declare function CheckBox(
    props: Field.Props & Form.FormFieldProps & InputCheckbox.Props
  ): JSX.Element
  declare function Date(
    props: Field.Props & Form.FormFieldProps & InputDate.Props
  ): JSX.Element
  declare function S3File(
    props: Field.Props & Form.FormFieldProps & InputS3File.Props
  ): JSX.Element
  declare function Masked(
    props: Field.Props & Form.FormFieldProps & InputMasked.Props
  ): JSX.Element
  declare function Number(
    props: Field.Props & Form.FormFieldProps & InputNumber.Props
  ): JSX.Element
  declare function TextArea(
    props: Field.Props & Form.FormFieldProps & InputTextArea.Props
  ): JSX.Element
}

/**
 *
 *
 * @since 0.3.0
 * @status EXPERIMENTAL
 * @category layout
 * @see http://uikit.myntra.com/components/tabs#tab
 */
declare function Tab(props: Tab.Props): JSX.Element
declare namespace Tab {
  interface Props extends BaseProps {
    title?: number
  }
}

declare namespace Text {
  const title: Text
  const h1: Text
  const h2: Text
  const h3: Text
  const h4: Text
  const body: Text
  const p: Text
  const caption: Text
  const button: Text
  const textLink: Text
}
