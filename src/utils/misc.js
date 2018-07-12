import { flow } from 'lodash'

export const go = (v, ...fns) => flow(...fns)(v)

export async function asyncSetState(callback) {
  return new Promise(callback)
}