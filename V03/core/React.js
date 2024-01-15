const createElement = (type, props, ...children) => {

  return {
    type,
    props: {
      ...props,
      // children
      children: children.map(child => {
        return (typeof child === 'string' || typeof child === 'number') ? createTextElement(child) : child
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

const initChildren = (work) => {
  const children = work.props.children || [];

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

/**
 * 
 * @param { typeof nextUnitOfWork } work 
 */
function performUnitOfWork(work) {
  if (!work.dom) {
    work.dom = createDOM(work.type)
    // 填充props
    updateProps(work.dom, work.props)
  }

  initChildren(work)

  if (work.child) {
    return work.child
  }

  if (work.sibling) {
    return work.sibling
  }

  let parent = work.parent
  while (parent) {
    if (parent.sibling) {
      return parent.sibling
    }
    parent = parent.parent
  }

  return null
}

function workLoop(deadline) {
  let shouldYield = false

  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYield = deadline.timeRemaining() < 1
  }

  if(!nextUnitOfWork && root) {
    // end 
    console.log('fiber 结构构建完成， 准备进入更新dom阶段')
    commitRoot(root)
    // clear 掉， 确保render 调用一次， 就渲染一次。即 防止在空闲时候多次执行
    root = null
  }

  window.requestIdleCallback(workLoop)
}

function commitRoot(root){
  if(!root) return 
  // 从根节点开始去追加dom 到页面上
  commitWork(root)
}

function commitWork(work){
  if(!work)return 
  work.parent?.dom?.appendChild?.(work.dom)
  
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