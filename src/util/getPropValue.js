/**
 * Retorna a propriedade CSS de um elemento na página
 * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
 * via: https://github.com/usablica/intro.js
 *
 * @param {Object} element
 * @param {String} propName
 * @returns string com valor da propriedade
 */
export default function getPropValue (element, propName) {
  let propValue = ''
  if (element.currentStyle) {
    // IE
    propValue = element.currentStyle[propName]
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    // Outros
    propValue = document.defaultView
      .getComputedStyle(element, null)
      .getPropertyValue(propName)
  }

  // Evitar exceção no IE
  if (propValue && propValue.toLowerCase) {
    return propValue.toLowerCase()
  } else {
    return propValue
  }
}
