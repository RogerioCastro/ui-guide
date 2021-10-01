import isHTMLElement from './isHTMLElement'
import getWindowSize from './getWindowSize'
import elementPosition from './elementPosition'

/**
 * Rola o documento até um elemento ou posição (e centraliza)
 *
 * @param {Object} target Posição { top, left, height } ou Elemento HTML alvo
 */
export default function _scrollTo (target) {
  if (isHTMLElement(target)) {
    if (target.scrollIntoView) {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    } else {
      let winSize = getWindowSize()
      let coords = elementPosition(target)
      let currentRect = target.getBoundingClientRect()
      window.scrollTo({
        top: coords.top - ((winSize.height - currentRect.height) / 2),
        left: coords.left,
        behavior: 'smooth'
      })
    }
  } else if ('top' in target && 'left' in target) {
    let winSize = getWindowSize()
    let top = typeof target.height !== 'undefined' ? target.top - ((winSize.height - target.height) / 2) : target.top
    window.scrollTo({
      top,
      left: target.left,
      behavior: 'smooth'
    })
  }
}
