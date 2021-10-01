import createElement from '../util/createElement'
import css from '../util/css'

/**
 * Controlador do elemento HTML para a overlay (fundo)
 *
 * @param {Object} options
 * @returns {Object} Controle do elemento overlay
 */
export default function overlay (options) {

  const settings = {
    container: document.body,
    class: 'uig-overlay-container',
    onClick: () => {},
    ...options
  }

  // Criando o elemento e inserindo no container
  let element = createElement('div', {
    className: settings.class
  })
  settings.container.appendChild(element)

  /**
   * Ativa a overlay no container
   */
  function show () {
    css(element, { display: 'block' })
  }

  /**
   * Desativa a overlay do container
   */
  function hide () {
    css(element, { display: 'none' })
  }

  /**
   * destrói o componente
   */
  function destroy () {
    element.remove()
    element = null
  }

  /* Eventos (handlers) */
  /**
   * Manipula o evento click no elemento overlay e dispara o evento onClick do componente
   * @param {Object} e Evento
   */
  function onClick (e) {
    e.preventDefault()
    settings.onClick()
  }

  /* Eventos (listeners) */
  element.addEventListener('click', onClick, false)

  return {
    element,
    destroy,
    show,
    hide
  }
}
