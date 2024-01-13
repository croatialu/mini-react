const render = (app, container) => {

  console.log(app, 'app')

  // 创建 dom 元素
  const el = (() => {
    switch (typeof app) {
      /**
       * 这些类型渲染出来的内容都为空
       *  {false} {true} {() => 'some code'} {undefined} {Symbol('abc')}
       */
      case 'boolean':
      case 'bigint':
      case 'function':
      case 'undefined':
      case 'symbol':
        return document.createTextNode('')
      // 这些类型渲染出来的内容都是其本身
      case 'number':
      case 'string':
        return document.createTextNode(app)
      case 'object':
        // 当 app 为 null 时，渲染出来的内容为空
        if (app === null) {
          return document.createTextNode('')
        }
        // 不该为 array
        if (Array.isArray(app)) {
          throw new Error('Not support array')
        }
    }

    // 此时， app 就是一个对象了
    switch (typeof app.type) {
      case 'string': {
        // if(app.type === 'TEXT_ELEMENT') {
        //   const dom = document.createTextNode('')
        //   dom.nodeValue = app.props.nodeValue
        //   return dom
        // }

        // 创建dom元素
        const dom = document.createElement(app.type)
        const { children, ...otherProps } = app.props
        Object.keys(otherProps).forEach(key => {
          // 填充dom元素的属性
          dom[key] = app.props[key]
        })

        // 创建子元素，将其挂载到 el 上
        children.forEach(child => {
          render(child, dom)
        })


        return dom
      }
      // 当为 function 时，表示该app 是个函数组件
      case 'function':
        // 传入 props 执行该 函数，得到 vdom 结构，并丢给渲染函数去创建实际的 dom 
        return render(app.type(app.props), document.createDocumentFragment())
    }
  })()




  // 把 el 挂载到目标元素上

  container.appendChild(el)

  // 返回 el， 将动态创建出来的el 丢给调用方。方便调用地使用
  return el
}


const createRoot = (container) => {
  return {
    render(App) {
      render(App, container)
    }
  }
}

const ReactDOM = {
  createRoot
}

export default ReactDOM