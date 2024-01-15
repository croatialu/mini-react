const createElement = (type, props, ...children) => {

  return {
    type,
    props: {
      ...props,
      // children
      children: children.map(child => {
        const isTextNode = typeof child === 'string' || typeof child === 'number'

        return isTextNode ? createTextElement(child) : child
      }).flat()
    }
  }
}

const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}



const createDOM = (type) => {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)
}

const updateProps = (dom, props) => {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

const initChildren = (work, children) => {
  let previousChild = null
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      dom: null,
      parent: work,
      sibling: null,
      child: null
    }
    if (index === 0) {
      work.child = newWork
    } else {
      previousChild.sibling = newWork
    }
    previousChild = newWork
  })
}

/**
 * @type { null | { type: string | Function, props: Record<string, any>, dom: HTMLElement, child?: any, parent?: any, sibling?: any }}
 */
let nextUnitOfWork = null

/**
 * 记录根节点
 */
let root = null


const updateFunctionComponent = (work) => {
  const children = [work.type(work.props)]
  initChildren(work, children)
}

const updateHostComponent = (work) => {
  if (!work.dom) {
    work.dom = createDOM(work.type)
    // 填充props
    updateProps(work.dom, work.props)
  }

  const children = work.props.children
  initChildren(work, children)
}

/**
 * 
 * @param { typeof nextUnitOfWork } work 
 */
function performUnitOfWork(work) {

  const isFunctionComponent = typeof work.type === 'function'

  if (isFunctionComponent) {
    updateFunctionComponent(work)
  } else {
    updateHostComponent(work)
  }

  if (work.child) {
    return work.child
  }

  let fiber = work

  while (fiber) {
    if (fiber.sibling) {
      return fiber.sibling
    }
    fiber = fiber.parent
  }
  return null
}

function workLoop(deadline) {
  let shouldYield = false

  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && root) {
    // end 
    console.log('fiber 结构构建完成， 准备进入更新dom阶段')
    commitRoot(root)
    // clear 掉， 确保render 调用一次， 就渲染一次。即 防止在空闲时候多次执行
    root = null
  }

  window.requestIdleCallback(workLoop)
}

function commitRoot(root) {
  if (!root) return
  console.log(root, 'root')
  // 从根节点开始去追加dom 到页面上
  commitWork(root)
}

function commitWork(work) {
  if (!work) return

  // 如果自身没有 dom，就不进行dom 的追加了（函数组件）
  if (work.dom) {
    // 有dom 的情况， 则对应的是原生标签， 需要找到 parent.dom 去append dom， 
    // 又因为 parent 可能是一个函数组件， 没有dom， 所以需要继续往上找
    let parent = work.parent
    while (parent) {
      if (parent.dom) {
        parent.dom.appendChild(work.dom)
        break
      }
      parent = parent.parent
    }
  }

  commitWork(work.child)
  commitWork(work.sibling)
}


window.requestIdleCallback(workLoop)


function render(app, container) {

  nextUnitOfWork = {
    dom: container,
    props: {
      children: [app]
    },
    parent: null,
    sibling: null,
    child: null
  }


  // 记录根节点， 每次render 都会重新记录一次
  root = nextUnitOfWork
}

const React = {
  createElement,
  createTextElement,
  render,
}

export default React