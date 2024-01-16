import React from './React'


const commitRoot = (rootFiber) => {
  if (!rootFiber) return

  commitFiber(rootFiber)
}

const commitFiber = (fiber) => {
  if (!fiber) return
  const isFunctionComponent = typeof fiber.type === 'function'

  if (!isFunctionComponent && !fiber.dom) {
    fiber.dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)

    Object.keys(fiber.props).forEach(key => {
      if (key === 'children') return;
      fiber.dom[key] = fiber.props[key]
    })
  }

  if (fiber.dom) {
    let parent = fiber.parent
    while (parent) {
      if (parent.dom) {
        parent.dom.appendChild(fiber.dom)
        break;
      } else {
        parent = parent.parent
      }
    }
  }
  commitFiber(fiber.child)
  commitFiber(fiber.sibling)

}

const render = (fiber, container) => {
  fiber.dom = container

  commitRoot(fiber)
}

const createRoot = (container) => {
  return {
    render: (node) => {
      React.createFiber(node).then(fiber => {
        render(fiber, container)
      })
    }
  }
}

const ReactDOM = {
  createRoot
}

export default ReactDOM