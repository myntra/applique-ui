<p align="center">
  <img width="300px" src="https://myntrascmuistatic.myntassets.com/partner-assets/applique/images/homepage/myntraStichLogo.png">
</p>

<h1 align="center">Applique Design System</h1>

<p align="center">A React implementation of Myntra's UI framework for enterprise design system</p>

Myntra's UI framework for enterprise design system is a comprehensive solution for front-end development. With a focus on user experience (UX) and intuitive user interface (UI), our framework integrates the latest design practices to create a seamless experience for users. 

The framework is built using React and TypeScript, providing robust and scalable components for fast-paced development. 

## Using the React components

Our framework offers a diverse range of components, including both basic elements such as Text and Button, as well as more complex components like Virtual List and Schema Form.

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

Our framework includes seamless integration of icons with select components like Button and NavBar, passed as React elements to the relevant component. 

We provide a basic set of icons for immediate use, as well as the option to utilize custom icons for a personalized touch.

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
Contributions through pull requests are encouraged. For further information, refer to the [contribution guidelines](https://applique.myntra.com/for-developers/how-to-contribute).
