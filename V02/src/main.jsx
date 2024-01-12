import React from './../core/React.js'
import ReactDOM from './../core/ReactDOM.js'

import App from './App'

const root = document.querySelector('#app')


console.log(<App />)

ReactDOM.createRoot(
  root
).render(
  <App />
)