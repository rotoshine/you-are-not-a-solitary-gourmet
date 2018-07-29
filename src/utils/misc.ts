import { flow } from 'lodash'

export const go = (v: any, ...fns: any[]): any => flow(fns)(v)

export async function asyncSetState(callback: () => void) {
  return new Promise(callback)
}

export function stripScripts(html: string) {
  const $div = document.createElement('div')
  $div.innerHTML = html
  const $scripts = $div.getElementsByTagName('script')
  let i = $scripts.length
  if ($scripts && i > 0) {
    while (i > 0) {
      const $script = $scripts[i]
      i = i - 1
      if ($script && $script.parentNode !== null){
        $script.parentNode.removeChild($script)
      }
    }
  }

  return $div.innerHTML
}