// setup file
const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

enzyme.configure({ adapter: new Adapter() })

global.shallow = enzyme.shallow
global.mount = enzyme.mount
