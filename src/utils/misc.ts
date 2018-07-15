import { flow } from 'lodash'

export const go = (v: any, ...fns: any[]): any => flow(fns)(v)

export async function asyncSetState(callback: () => void) {
  return new Promise(callback)
}
