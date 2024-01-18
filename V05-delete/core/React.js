import { createPromise } from './utils'

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

const getFiber = (fiber) => {
  switch (typeof fiber) {
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
      return createTextElement(fiber)
    case 'object':
      // 当 app 为 null 时，渲染出来的内容为空
      if (fiber === null) {
        return createTextElement('')
      }
      return fiber
    default:
      return fiber
  }
}

const updateFunctionComponent = (fiber) => {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

const updateHostComponent = (fiber) => {

  if (!fiber.dom) {
    const dom = fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
    fiber.dom = dom
    updateProps(dom, fiber.props, {})
  }

  const children = fiber.props.children;

  reconcileChildren(fiber, children)
}

const updateProps = (dom, nextProps, prevProps) => {
  Object.keys(prevProps).forEach(key => {
    if (key === 'children') return
  
    if(key in nextProps) return

    if (key.startsWith('on')) {
      const eventName = key.substring(2).toLowerCase()
      dom.removeEventListener(eventName, prevProps[key])
    } else {
      dom.removeAttribute(key)
    }
  })

  Object.keys(nextProps).forEach(key => {
    if (key === 'children') return

    if (key.startsWith('on')) {
      const eventName = key.substring(2).toLowerCase()
      dom.removeEventListener(eventName, prevProps[key])
      dom.addEventListener(eventName, nextProps[key])
    } else {
      dom[key] = nextProps[key]
    }
  })

}

const reconcileChildren = (wipFiber, children) => {
  let oldChildFiber = wipFiber.alternate?.child;
  let prevChild = null


  children.flat().forEach((child, index) => {
    const childFiber = getFiber(child);

    const isSameType = oldChildFiber && childFiber.type === oldChildFiber.type

    const newFiber = isSameType ? {
      type: childFiber.type,
      props: childFiber.props,
      dom: oldChildFiber.dom,
      alternate: oldChildFiber,
      effectTag: 'UPDATE',

      parent: wipFiber,
      sibling: null,
      child: null
    } : {
      type: childFiber.type,
      props: childFiber.props,
      dom: null,
      alternate: null,
      effectTag: 'PLACEMENT',

      parent: wipFiber,
      sibling: null,
      child: null
    }

    if(!isSameType && oldChildFiber){
      
      deletions.push(oldChildFiber)
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
    oldChildFiber = oldChildFiber?.sibling
  });


  while(oldChildFiber){
    deletions.push(oldChildFiber)
    oldChildFiber = oldChildFiber.sibling
  }
}


function performUnitOfWork(fiber) {

  const isFunctionComponent = typeof fiber.type === 'function'
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }


  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }

    nextFiber = nextFiber.parent
  }

  return;
}



let wipRoot = null
let currentRoot = null
let nextWorkOfUnit = null
let deletions = [];
function workLoop(deadline) {
  let shouldYield = false

  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }


  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)


function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}

function commitDeletion(fiber){

  let fiberParent = fiber.parent

  while(!fiberParent.dom){
    fiberParent = fiberParent.parent
  }

  let fiberChild = fiber

  while(!fiberChild.dom){
    fiberChild = fiberChild.child
  }

  fiberParent.dom.removeChild(fiberChild.dom)
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  let fiberParent = fiber.parent;

  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  switch (fiber.effectTag) {
    case 'PLACEMENT':
      fiber.dom && fiberParent.dom.appendChild(fiber.dom)
      break
    case 'UPDATE':
      fiber.dom && updateProps(fiber.dom, fiber.props, fiber.alternate.props)
      break;
  }


  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }

  nextWorkOfUnit = wipRoot
}


function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  }

  nextWorkOfUnit = wipRoot
}

const React = {
  createElement,
  render,
  update
}

export default React