export * from "./components";

export { default as T } from "@applique-ui/text";

export { default as Alert } from "@applique-ui/banner";

// TODO: create a codemod for renaming Tag to Badge
export { default as Tag } from "@applique-ui/badge";
// TODO: create a codemod for renaming DropDown to Dropdown
export { default as DropDown } from "@applique-ui/dropdown";
// TODO: create a codemod for renaming InputCheckBox to InputCheckbox
export { default as InputCheckBox } from "@applique-ui/input-checkbox";
// TODO: Implement or deprecate InputSwitch
export { default as InputSwitch } from "@applique-ui/input-checkbox";

import * as u from "@applique-ui/uikit-utils";

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
