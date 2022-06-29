# Overview

## Usage

```jsx
import React, { Component } from 'react';

import MyComponent from '@hubblr/form';
import '@hubblr/form/dist/index.scss';

class FormExampleSimple extends Component {
  render() {
    return <MyComponent />;
  }
}
```

## FormExampleSimple

Check [here](https://hubblr.github.io/hubblr-react-components/) to see some example use cases of the included components.

TODO: REMOVE THESE

- basic text inputs

### Form

| Prop                     | Type            | Required           | Default    | Description                                                                                                                                                                                                                                      |
| ------------------------ | --------------- | ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| children                 | `node`          | :heavy_check_mark: | -          | The content of the `<Form>`. Should include some input components.                                                                                                                                                                               |
| isDisabled               | `boolean`       |                    | `false`    | Whether the user can submit the form.                                                                                                                                                                                                            |
| onSubmit                 | `() => boolean` | :heavy-check-mark: |            | Callback to fire when form is submitted. If this returns `false` trigger another validation afterwards.                                                                                                                                          |
| onSubmitValidationFailed | `() => void`    |                    | `() => {}` | Callback to fire when form validation fails on submit.                                                                                                                                                                                           |
| className                | `string`        |                    | ""         | CSS classes to apply to the form.                                                                                                                                                                                                                |
| navIsFixed               | `boolean`       |                    | `false`    | When your page contains a navbar positioned with `position: sticky` or `position: fixed` jumping to the first unselected element needs to take its size into account. Set this prop to `true` if you want the form to correct its jump behavior. |

### Input

| Prop                 | Type                          | Required           | Default     | Description                                                                                                                                                                                |
| -------------------- | ----------------------------- | ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| children             | `node`                        |                    | null        | The content of the `<Input>`. Should include some input components.                                                                                                                        |
| name                 | `string`                      | :heavy_check_mark: |             | HTML `<input>` `name` attribute.                                                                                                                                                           |
| groupName            | `string`                      |                    | ""          | Name used for validation. All `<Input>`s with the same `groupName` are validated together. Is used to identify the error message for the `<ValidationError>`. Defaults to the `name` prop. |
| placeholder          | `string`                      |                    | ""          | HTML `<input>` `placeholder` attribute.                                                                                                                                                    |
| inputClasses         | `string`                      |                    | ""          | `class` directly applied to the `<input>` element.                                                                                                                                         |
| groupClassNames      | `string`                      |                    | ""          | `class` applied to a wrapper around both the label and the `<input>` element.                                                                                                              |
| innerGroupClassNames | `string`                      |                    | ""          | `class` applied to a wrapper around the `<input>` element.                                                                                                                                 |
| labelClassNames      | `string`                      |                    | ""          | `class` applied to the label above the `<input>`.                                                                                                                                          |
| type                 | `string`                      |                    | "text"      | HTML `<input>` `type` attribute.                                                                                                                                                           |
| onValidate           | `() => boolean`               |                    | `undefined` | Validation of user input. Return `true` if input is valid, otherwise return `false` or an error message.                                                                                   | Validation of user input. Return `true` if input is valid, otherwise return `false` or an error message. |
| onBlur               | `() => void`                  |                    | `undefined` | Function that runs after validation on `<input>` blur.                                                                                                                                     |
| value                | `string`                      |                    | `undefined` | HTML `<input>` `type` attribute.                                                                                                                                                           |
| inputRef             | `React.Ref<HTMLInputElement>` |                    | `undefined` | React ref attached to the `<input>` element.                                                                                                                                               |
| label                | `string`                      |                    | `undefined` | Text label above the `<input>` element.                                                                                                                                                    |
| showValidationError  | `boolean`                     |                    | `false`     | Whether to render a `<ValidationError>` with the current error message under the `<input>`.                                                                                                |
| stickPlaceholderHint | `boolean`                     |                    | `false`     | Whether to show the label above the `<input>` element.                                                                                                                                     |
| validateWith         | `string[]`                    |                    | `[]`        | Other related inputs to also validate during this component's validation.                                                                                                                  |
| relatedFields        | `string[]`                    |                    | `[]`        | Other related inputs to also validate during this component's validation.                                                                                                                  |
| hideValidateOnEmpty  | `boolean`                     |                    | `false`     | If set to `true` hides validation error if the input is empty. The error will still show on form submit.                                                                                   |
| isOptional           | `boolean`                     |                    | `false`     | If set to `true` this field may be empty on form submit.                                                                                                                                   |

## Validation

### Registering a custom input
