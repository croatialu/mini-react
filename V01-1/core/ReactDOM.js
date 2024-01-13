import React from './React.js'

const render = (app, container) => {

  const el = app.type === 'TEXT_ELEMENT' 
  ? document.createTextNode('') 
  : document.createElement(app.type)


  // props 
  Object.keys(app.props).forEach(key => {
    if(key === 'children') return;

    el[key] = app.props[key]
  })


  // children

  const children = app.props.children;


  children.forEach(child => {
    render(child, el)
  })

  container.appendChild(el)
}


const createRoot = (container) => {
  return {
    render(App){
      render(App, container)
    }
  }
}

const ReactDOM = {
  createRoot
}

export default ReactDOM