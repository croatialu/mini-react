import React from './React'
import TaskExecutor from './TaskExecutor'

const taskExecutor = new TaskExecutor()


const commitRoot = (rootFiber) => {
  if (!rootFiber) return

  taskExecutor.add(() => {
    commitFiber(rootFiber)
  })
}



const updateFunctionComponent = (fiber) => {

}

const updateHostComponent = (fiber) => {

  if (!fiber.type) return
  debugger
  switch (fiber.effectTag) {
    case 'update':
      const oldFiber = fiber.alternate;
      fiber.dom = oldFiber.dom;

      // new 1, old 0; update  
      // new 1, old 1; update
      // new 0, old 0;
      // new 0, old 1; remove
      Object.keys(oldFiber.props).forEach(key => {
        if (key === 'children') return;
        if (key in fiber.props) return;

        if (key.startsWith('on')) {
          console.log('解绑', key)
          const eventType = key.toLowerCase().slice(2)
          fiber.dom.removeEventListener(eventType, oldFiber.props[key])
        }
        fiber.dom.removeAttribute(key)
      })

      Object.keys(fiber.props).forEach(key => {
        if (key === 'children') return;

        if (key.startsWith('on')) {
          console.log('解绑', key)
          console.log('绑定', key)
          const eventType = key.toLowerCase().slice(2)
          console.log(fiber, 'fiber')
          fiber.dom.removeEventListener(eventType, oldFiber.props[key])
          fiber.dom.addEventListener(eventType, fiber.props[key])
          return;
        }

        fiber.dom[key] = fiber.props[key]
      })

      break
    case 'placement':
      fiber.dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)
      Object.keys(fiber.props).forEach(key => {
        if (key === 'children') return;

        if (key.startsWith('on')) {
          const eventType = key.toLowerCase().slice(2)
          // 
          console.log('绑定', key)
          fiber.dom.addEventListener(eventType, fiber.props[key])
          return;
        }

        fiber.dom[key] = fiber.props[key]
      })
      break
  }


}

const commitFiber = (fiber) => {
  if (!fiber) return
  const isFunctionComponent = typeof fiber.type === 'function'

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
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
  console.log(fiber)
  commitRoot(fiber)

  taskExecutor.addEventListener('finished', () => {
    let child = fiber.child

    while (child) {
      if (child.dom) {
        container.appendChild(child.dom)
        break;
      } else {
        child = child.child
      }
    }
  })
}
let appContainer = null
const createRoot = (container) => {
  appContainer = container
  return {
    render: (node) => {
      React.createFiber(node).then(fiber => {
        render(fiber, container)
      })
    }
  }
}

async function update() {
  const newFiber = await React.updateFiber()
  console.log(newFiber, 'newFiber')
  render(newFiber, appContainer)
  // console.log(oldFiber, 'oldFiber')
  // render(oldFiber, oldFiber.dom)
}

const ReactDOM = {
  createRoot,
  update,
}

export default ReactDOM