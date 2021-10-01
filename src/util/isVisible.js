/**
 * Verifica se um elemento está visível
 * via: https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
 *      https://github.com/jquery/jquery/blob/main/src/css/hiddenVisibleSelectors.js
 *
 * @param {Object} elem elemento HTML a ser verificado
 */
export default function isVisible (elem) {
  return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )
}
