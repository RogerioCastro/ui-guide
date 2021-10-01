import createElement from '../util/createElement'
import elementPosition from '../util/elementPosition'
import getRandom from '../util/getRandom'
import css from '../util/css'

/**
 * Controlador do elemento HTML para a highlightBox (caixa que destaca o elemento alvo)
 *
 * @param {Object} options
 * @returns {Object} Controle do elemento highlightBox
 */
export default function highlightBox (options) {

  const settings = {
    container: document.body,
    margin: 10,
    class: 'uig-highlight-box',
    onTransitionEnd: () => {},
    ...options
  }

  // Criando o elemento e inserindo no container
  let element = createElement('div', {
    className: settings.class
  })
  settings.container.appendChild(element)

  // Pegando a posição inicial do elemento highlightBox
  const coords = elementPosition(element)

  /**
   * Exibe a highlightBox ou apenas aplica as transformações.
   *
   * @param {Object} params
   * @param {Number} params.top Posição Y do elemento alvo
   * @param {Number} params.left Posição X do elemento alvo
   * @param {Number} params.width Largura do elemento alvo
   * @param {Number} params.height Altura do elemento alvo
   * @param {Boolean} params.fixed Indica se o elemento alvo ou um de seus pais é fixo
   * @param {Boolean} params.noTarget Indica se não há o elemento alvo
   */
  function show ({ top, left, width, height, fixed, noTarget }) {

    // Calculando as posição e tamanho com a aplicação da margem
    const y = top - settings.margin / 2
    const x = left - settings.margin / 2
    const w = width + settings.margin
    const h = height + settings.margin

    /**
     * Aplicando as tranformações
     * No caso de passo sem elemento alvo o valor de width está sendo gerado
     * randomicamente para evitar a falta do evento 'transitionend' quando o passo
     * anterior também for sem elemento alvo (que não gera nenhuma transformação)
     */
    css(element, {
      position: fixed ? 'fixed' : 'absolute',
      opacity: 1,
      width: noTarget ? `${getRandom(0, 1)}px` : `${w}px`,
      height: noTarget ? '0px' : `${h}px`,
      'border-width': noTarget ? '0px' : '1px',
      transform: `translate(${(x - coords.left)}px, ${(y - coords.top)}px)`
    })
  }

  /**
   * Ocultando a highlightBox
   */
  function hide () {
    css(element, {
      opacity: 0,
      width: '0px',
      height: '0px',
      transform: 'scale(0)'
    })
  }

  /**
   * destrói o componente
   */
  function destroy () {
    element.removeEventListener('transitionend', settings.onTransitionEnd, false)
    element.remove()
    element = null
  }

  /* EVENTOS (listeners) */
  // Aplicando o listener que monitora o fim das transições da highlightBox
  // e dispara o evento 'onTransitionEnd' do componente
  // Transições mais comuns: transform, width, height e opacity
  // via: https://stackoverflow.com/questions/8814631/how-do-i-detect-a-transition-end-without-a-javascript-library
  element.addEventListener('transitionend', settings.onTransitionEnd, false)

  return {
    element,
    destroy,
    show,
    hide
  }
}
