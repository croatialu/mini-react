export default class TaskExecutor {
  constructor() {
    this.taskQueue = []
    this.taskId = 0
    this.idleCallbackId = 0
    this.finishedCallback = []
    this.init()
    console.log('init')
  }

  addEventListener(eventName, callback){
    if(eventName === 'finished'){
      return this.finishedCallback.push(callback)
    }
  }

  removeEventListener(eventName, params){
    if(eventName === 'finished'){
      switch(typeof params ){
        case 'function':
          return this.finishedCallback = this.finishedCallback.filter(cb => cb !== params)
        case 'number':
          return this.finishedCallback.splice(params, 1)
        default:
          return this.finishedCallback = []
      }
    }
  }


  add(task) {
    this.taskQueue.push({
      task,
    })
  }


  destroy(){
    this.taskQueue = []
    this.taskId = 0
    this.finishedCallback = []
    window.cancelIdleCallback(this.idleCallbackId)
  }

  init(){
    this.idleCallbackId = window.requestIdleCallback((deadline) => this.loop(deadline))    
  }

  loop(deadline){
    let hasTime = true;

    while(hasTime && this.taskQueue.length){
      const task = this.taskQueue.shift()
      task.task()

      if(!this.taskQueue.length){
        this.finishedCallback.forEach(cb => cb())
      }
      hasTime = deadline.timeRemaining() > 2
    }

    this.idleCallbackId = window.requestIdleCallback((deadline) => this.loop(deadline))
  }
}