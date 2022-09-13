import path from 'path'
import fs from 'fs'
import { rollup } from 'rollup2'
import config from '../mdx_rollup.config.mjs'
import utils from './utils.mjs'

import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { componentsDir, components } = utils

function outputOptions(component) {
    const outputDir = path.resolve(componentsDir, component, './dist/docs')
    return [{
        dir: outputDir,
        exports: 'named',
        outro: `window.Docs = window.Docs || {}; \n window.Docs['${component}'] = exports;`,
        format: 'iife',
        name: component,
        extend: true,
        globals: {
            'react': 'React',
        },
    }]
}

async function generateOutputs(bundle, component) {
    const outputOptionsList = outputOptions(component)
    for (const outputOptions of outputOptionsList) {
      await bundle.write(outputOptions);
    }
}

async function build() {
    for (const component of components) {
        await buildDoc(component)
    }
    console.log('.... Done')
}

async function buildDoc(component) {
    const inputFile = path.resolve(componentsDir, component, './docs/index.mdx')
    
    if (!fs.existsSync(inputFile)) return
    console.log('build docs : ', component)
    
    let bundle
    try {
        bundle = await rollup(config({
            input: inputFile,
        }))
        await generateOutputs(bundle, component);
    } catch (error) {
        console.error(error)
    }
    if (bundle) {
        // closes the bundle
        await bundle.close();
    }
}

build()
.then(console.log)
.catch(console.error)


export default {}