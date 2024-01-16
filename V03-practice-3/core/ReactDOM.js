import React from './React'
import TaskExecutor from './TaskExecutor'

const taskExecutor = new TaskExecutor()


const commitRoot = (rootFiber) => {
  if (!rootFiber) return

  taskExecutor.add(() => {
    commitFiber(rootFiber)
  })
}

const commitFiber = (fiber) => {
  if (!fiber) return
  const isFunctionComponent = typeof fiber.type === 'function'

  if (!isFunctionComponent && !fiber.dom && fiber.type) {
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

  taskExecutor.add(() => {
    commitFiber(fiber.child)
  })

  taskExecutor.add(() => {
    commitFiber(fiber.sibling)
  })

}

const render = (fiber, container) => {
  commitRoot(fiber)

  taskExecutor.addEventListener('finished', () => {
    let child = fiber.child

    while (child) {
      if (child.dom) {
        container.appendChild(child.dom)
        break;
      }else {
        child = child.child
      }
    }
  })
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