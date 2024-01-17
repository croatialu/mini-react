import { createPromise } from './utils'
import TaskExecutor from './TaskExecutor'


const taskExecutor = new TaskExecutor()


const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children
    }
  }
}

const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    },
  }

}

let oldPayload = null
const createFiber = async (node) => {
  const { resolve, promise } = createPromise()

  const tmpWork = {
    props: {
      children: [node]
    }
  }

  taskExecutor.add(() => {
    performUnitOfWork(tmpWork)
  })

  taskExecutor.addEventListener('finished', () => {
    resolve()
    oldPayload = {
      node, fiber: tmpWork
    }
  })

  await promise
  return tmpWork
}
const updateFiber = async () => {
  const { resolve, promise } = createPromise()

  const tmpWork = {
    props: {
      children: [oldPayload?.node]
    },
    alternate: oldPayload?.fiber
  }

  console.log(oldPayload, 'oldPayload')

  taskExecutor.add(() => {
    performUnitOfWork(tmpWork)
  })

  taskExecutor.addEventListener('finished', () => {
    resolve()
    oldPayload = {
      node: oldPayload?.node, fiber: tmpWork
    }
  })

  await promise
  return tmpWork
}


const updateFunctionComponent = (fiber) => {
  const children = [fiber.type(fiber.props)]

  initChildren(fiber, children)
}

const updateHostComponent = (fiber) => {
  const children = fiber.props.children

  initChildren(fiber, children)
}


const initChildren = (fiber, children) => {
  const oldFiber = fiber.alternate
  let olderFiberChild = oldFiber?.child
  let prevChild = null
  children.flat().forEach((child, index) => {


    const tmpNode = (() => {
      switch (typeof child) {
        /**
         * 这些类型渲染出来的内容都为空
         *  {false} {true} {() => 'some code'} {undefined} {Symbol('abc')}
         */
        case 'boolean':
        case 'bigint':
        case 'function':
        case 'undefined':
        case 'symbol':
          return createTextElement('')
        // 这些类型渲染出来的内容都是其本身
        case 'number':
        case 'string':
          return createTextElement(child)
        case 'object':
          // 当 app 为 null 时，渲染出来的内容为空
          if (child === null) {
            return createTextElement('')
          }
          return child
      }
    })();

    const isSameType = olderFiberChild && olderFiberChild.type === tmpNode.type

    console.log(isSameType ? 'update' : 'placement', 'effectTag')
    const newNode = isSameType ?
      // Update
      {
        type: tmpNode.type,
        props: tmpNode.props,
        parent: fiber,
        sibling: null,
        child: null,
        alternate: olderFiberChild,
        effectTag: 'update'
      } :
      // Add
      {
        type: tmpNode.type,
        props: tmpNode.props,
        parent: fiber,
        sibling: null,
        child: null,
        alternate: null,
        effectTag: 'placement'
      }
    if (index === 0) {
      fiber.child = newNode
    } else {
      prevChild.sibling = newNode
    }

    olderFiberChild = olderFiberChild?.sibling
    prevChild = newNode
  })

}

const performUnitOfWork = (node) => {
  const isFunctionComponent = typeof node.type === 'function'

  if (isFunctionComponent) {
    updateFunctionComponent(node)
  } else {
    updateHostComponent(node)
  }

  if (node.child) {
    return taskExecutor.add(() => performUnitOfWork(node.child))
  }

  let curNode = node;

  while (curNode) {
    if (curNode.sibling) {
      return taskExecutor.add(() => performUnitOfWork(curNode.sibling))
    }

    curNode = curNode.parent
  }

  return null
}


const React = {
  createElement,
  createFiber,
  updateFiber,
}

export default React