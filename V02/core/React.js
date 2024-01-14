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
 * 
 * @param { typeof nextUnitOfWork } work 
 */
function performUnitOfWork(work) {
  console.log(work, 'work')
  if (!work.dom) {
    work.dom = createDOM(work.type)
    work.parent?.dom?.appendChild?.(work.dom)
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

  let parentSibling = null

  while (work.parent) {
    parentSibling = work.parent.sibling
    if (parentSibling) {
      return parentSibling
    }
    work = work.parent
  }

  return null
}

function workLoop(deadline) {
  let shouldYield = false

  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYield = deadline.timeRemaining() < 1
  }


  window.requestIdleCallback(workLoop)
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

  console.log(nextUnitOfWork, 'next')
}

const React = {
  createElement,
  createTextElement,
  render,
}

export default React