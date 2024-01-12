import React from './React.js'

const render = (app, container) => {

  const el = (() => {

    if(app.type === 'TEXT_ELEMENT'){
      return document.createTextNode('')
    }

    if(typeof app.type === 'function'){
      const node = app.type(app.props)

      return render(node, container)
    }

    return document.createElement(app.type)
  })()

  console.log(el, 'ellll')

  // props 
  Object.keys(app.props).forEach(key => {
    if(key === 'children' || typeof app.type === 'function') return;

    el[key] = app.props[key]
  })


  // children

  const children = app.props.children;


  children.forEach(child => {
    render(child, el)
  })

  container.appendChild(el)

  return el
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