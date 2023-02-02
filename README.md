<p align="center">
  <img width="300px" src="https://myntrascmuistatic.myntassets.com/partner-assets/applique/images/homepage/myntraStichLogo.png">
</p>

<h1 align="center">Applique Design System</h1>

<p align="center">A React implementation of Myntra's UI framework for enterprise design system</p>

Aims to establish a common vocabulary between everyone in an organization. 
It captures repeating design structures, conventions, and, decisions across dozens of applications and builds as a re-usable pattern library.

UIKit is a continuous effort of finding new patterns and decommissioning older irrelevant patterns, so we adopt a component status convention.

<br />

| Icon | Status       | Description                                                                                                                                                                                                          |
| :--: | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  💔  | DEPRECATED   | **DO NOT USE.** If you're using DEPRECATED component, it's time to migrate as it would removed in next major release.                                                                                                |
|  ❤️  | EXPERIMENTAL | **USE WITH CAUTION.** These components are most likely to graduate to **REVIEWING** state but they can be ocassionally **DEPRECATED** too. If you're using EXPERIMENTAL component, keep your application up to date. |
|  💛  | REVIEWING    | These components are as good as READY component. They would graduate to **READY** after a fixed time (approx. 3 months or 3 minor releases or next major release).                                                   |
|  💚  | READY        | These components are well tested, stable and proven. |

<br />

## Using the React components

We do offer a varity of components which includes simple one's like Text and Button and complex components Virtual List, Schema Form etc.

### Installation
Run the following command using npm:

```bash
npm install @applique-ui/uikit --save
```
If you prefer Yarn, use the following command instead:

```bash
yarn add @applique-ui/uikit
```

### Usage
1. Import any of the provided components directly in your project:

```js
import { Button, Layout, Text } from "@applique-ui/uikit"
```

2. Tell React to render the element in the DOM:

```js
ReactDOM.render(
  <Provider>
    <Layout>
        <Text.Title>Page Title</Text.Title>
        <Button onClick={() => alert('Button clicked!')}>Example button</Button>
    </Layout>
  </Provider>,
  document.querySelector('#app'),
);
```

## Using the icon library

We offer integration of icons with some of our components like Button, NavBar, etc. All these icons are passed as a react element to the desired
component.
We offer some of the basic set of icons that you can use. Apart from that, you can use your own icons as well.

### Installation
Run the following command using npm:

```bash
npm install @myntra/uikit-icons --save
```
If you prefer Yarn, use the following command instead:

```bash
yarn add @myntra/uikit-icons
```

### Usage
1. Import any of the provided icons directly in your project:

```js
import BarsSolid from "@myntra/uikit-icons/svgs/BarsSolid"
import Bell from "@myntra/uikit-icons/svgs/Bell"
import BoxSolid from "@myntra/uikit-icons/svgs/BoxSolid"
```

2. Pass this icon element as a prop to the component:
```js
<Icon name={BarsSolid} />
<Button icon={Bell}>Pencil</Button>
<NavBar.Item icon={BoxSolid}>Home</NavBar.Item>
```

## Contributing
Pull requests are welcome. See the [contribution guidelines](https://uikit.myntra.com/contributing) for more information.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/sunil-jhamnani"><img src="https://avatars.githubusercontent.com/u/54964764?v=4" width="100px;" alt=""/><br /><sub><b>Sunil Jhamnani</b></sub></a></td>
    </tr>
  <table>
