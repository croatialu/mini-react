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
  })

  await promise
  return tmpWork
}


const performUnitOfWork = (node) => {
  const isFunctionComponent = typeof node.type === 'function'

  const children = isFunctionComponent ? [node.type(node.props)] : node.props.children

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

    const newNode = {
      type: tmpNode.type,
      props: tmpNode.props,
      parent: node,
      sibling: null,
      child: null
    }
    if (index === 0) {
      node.child = newNode
    } else {
      prevChild.sibling = newNode
    }
    prevChild = newNode
  })


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
}

export default React