export * from "./components";

export { default as T } from "@myntra/uikit-component-text";

export { default as Alert } from "@myntra/uikit-component-banner";

// TODO: create a codemod for renaming Tag to Badge
export { default as Tag } from "@myntra/uikit-component-badge";
// TODO: create a codemod for renaming DropDown to Dropdown
export { default as DropDown } from "@myntra/uikit-component-dropdown";
// TODO: create a codemod for renaming InputCheckBox to InputCheckbox
export { default as InputCheckBox } from "@myntra/uikit-component-input-checkbox";
// TODO: Implement or deprecate InputSwitch
export { default as InputSwitch } from "@myntra/uikit-component-input-checkbox";
// TODO: create a codemod for renaming S3Upload to InputS3File
export { default as S3Upload } from "@myntra/uikit-component-input-s3-file";

import * as u from "@myntra/uikit-utils";

export { u };

export function ThemeProvider({ children }) {
  return children;
}

/**
 * Function creator that accepts a propMap and returns a method which accepts a set of props
 * and renames props present in inputProps to new propName present in the propMap
 */
export function interopPropTransformer(
  mappings: Record<string, string>,
  coercions: Record<string, (name: string) => string> = {}
) {
  const hasMappings = Object.keys(mappings).length > 0;
  const hasCoercions = Object.keys(coercions).length > 0;
  const fn = (props: any) => {
    const target = { ...props };

    if (hasMappings) {
      Object.entries(mappings).map(([from, to]) => {
        if (from in props) target[to] = props[from];
        delete target[from];
      });
    }

    if (hasCoercions) {
      Object.entries(coercions).map(([name, fn]) => {
        if (name in props) target[name] = fn(target[name]);
      });
    }

    return target;
  };

  fn.mappings = mappings;
  fn.coercions = coercions;

  return fn;
}
