import React from './React'
const render = (fiber, container) => {

}

const createRoot = (container) => {
  return {
    render: (node) => {
      const fiber = React.createFiber(node)

      render(fiber, container)
    }
  }
}

const ReactDOM = {
  createRoot
}

export default ReactDOM