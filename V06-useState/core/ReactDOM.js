import React from './React'
 
const createRoot = (container) => {
  return {
    render: (node) => {
      React.render(node, container)
    }
  }
}

function update(){
  React.update()
}

const ReactDOM = {
  createRoot,
  update,
}

export default ReactDOM