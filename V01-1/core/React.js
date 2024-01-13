const createElement = (type, props, ...children) => {

  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextElement(child) : child
      })
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


const React = {
  createElement,
  createTextElement
}

export default React