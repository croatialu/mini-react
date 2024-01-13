import React from './core/React.js'
import ReactDOM from './core/ReactDOM.js'

const root = document.querySelector('#root')



const App = React.createElement(
  'div',
  { id: 'app' },
  'hello',
  'nihao',

  React.createElement(
    'div',
    {
      'data-xxx': '666'
    },

    '666-value'
  )
)

ReactDOM.createRoot(
  root
).render(
  App
)