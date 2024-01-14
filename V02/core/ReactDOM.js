import React from './React'
const render = (app, container) => {
  
  React.render(app, container)
}

const createRoot = (container) => {
  return {
    render(App) {
      render(App, container)
    }
  }
}

const ReactDOM = {
  createRoot
}

export default ReactDOM