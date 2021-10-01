import getPropValue from './getPropValue'

/**
 * Verifica se a posição de um elemento (ou seus pais) é fixa ou não
 * via: https://github.com/usablica/intro.js
 *
 * @param {Object} element
 * @returns Boolean
 */
export default function isFixed (element) {
  const p = element.parentNode

  if (!p || p.nodeName === 'HTML') {
    return false
  }

  if (getPropValue(element, 'position') === 'fixed') {
    return true
  }

  return isFixed(p)
}
