// export type Resolve<T> = (value: T | PromiseLike<T>) => void
// export type Reject = (reason?: any) => void

export function createPromise() {
  let resolve = () => { }
  let reject = () => { }
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return { resolve, reject, promise }
}
