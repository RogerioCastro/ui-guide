import { createPopper } from '@popperjs/core'
import createElement from '../util/createElement'
import clearElement from '../util/clearElement'
import css from '../util/css'

/**
 * Controlodar do elemento HTML popover (tooltip interativa)
 * Utilizando Popper positioning engine (https://popper.js.org/)
 *
 * @param {Object} options
 * @returns {Object} Controle do elemento popover
 */
export default function popover (options) {

  const settings = {
    container: document.body,
    class: 'uig-popover',
    extraClass: null,
    target: null,
    previousText: 'Anterior',
    nextText: 'Próximo',
    doneText: 'Encerrar',
    showIcons: true,
    showProgress: true,
    offset: [0, 8],
    onClose: () => {},
    onSelect: () => {},
    onPrevious: () => {},
    onNext: () => {},
    ...options
  }

  // Incluindo ícones nos labels
  if (settings.showIcons) {
    settings.previousText = '❮ ' + settings.previousText
    settings.nextText = settings.nextText + ' ❯'
    settings.doneText = settings.doneText + ' ✓'
  }

  // Criando os elementos necessários
  let element = createElement('div', {
    className: settings.class + (settings.extraClass ? ` ${settings.extraClass}` : '')
  })
  let headerElement = createElement('div', { className: 'uig-popover-header' })
  let titleElement = createElement('div', { className: 'uig-popover-title' })
  let contentElement = createElement('div', { className: 'uig-popover-content' })
  let progressElement = createElement('div', { className: 'uig-popover-progress' })
  let progressListElement = createElement('ul')
  let actionsElement = createElement('div', { className: 'uig-popover-actions' })
  let btnCloseElement = createElement('a', {
    className: 'uig-popover-close',
    innerHTML: '&#128473;'
  })
  let btnPreviousElement = createElement('button', {
    className: 'uig-popover-button',
    textContent: settings.previousText
  })
  let btnNextElement = createElement('button', {
    className: 'uig-popover-button',
    textContent: settings.nextText
  })
  let arrowElement = createElement('div', {
    className: 'uig-popover-arrow',
    'data-popper-arrow': ''
  })

  // Inserindo os elementos em seus containers
  // Header
  headerElement.appendChild(titleElement)
  headerElement.appendChild(btnCloseElement)
  element.appendChild(headerElement)
  // Content
  element.appendChild(contentElement)
  // Progress
  progressElement.appendChild(progressListElement)
  element.appendChild(progressElement)
  // Actions (buttons)
  actionsElement.appendChild(btnPreviousElement)
  actionsElement.appendChild(btnNextElement)
  element.appendChild(actionsElement)
  // Popper Arrow
  element.appendChild(arrowElement)

  // Inserindo o popover no container
  settings.container.appendChild(element)

  // Iniciando o popover
  const popper = createPopper(settings.target, element, {
    modifiers: [
      // Offset necessária para a utilização da 'arrow'
      {
        name: 'offset',
        options: {
          offset: settings.offset,
        },
      },
    ],
  })

  /**
   * Limpa o elemento do título e insere novo conteúdo
   * @param {String} title Texto ou HTML para o título
   */
  function setTitle (title) {
    clearElement(titleElement)
    title && (titleElement.innerHTML = title)
  }

  /**
   * Limpa o elemento do conteúdo e insere novo conteúdo
   * @param {String} title Texto ou HTML para o conteúdo
   */
  function setContent (content) {
    clearElement(contentElement)
    contentElement.innerHTML = content
  }

  /**
   * Limpa o elemento da barra de progresso e preenche com novos dados (bullets)
   * @param {Number} index Índice do passo atual
   * @param {Number} length Total de passos na instância atual
   */
  function showProgress (index, length) {
    // Limpando a lista de progresso
    clearElement(progressListElement)
    // Imprimindo cada bullet
    for (let step = 0; step < length; step++) {
      let li = createElement('li')
      let bullet = createElement('a', {
        innerHTML: '&nbsp;',
        'data-step': step
      })
      // Destacando o bullet do passo atual e aplicando eventos
      if (step === index) {
        bullet.className = 'active'
      } else {
        bullet.addEventListener('click', onStepBulletClick, false)
      }
      li.appendChild(bullet)
      progressListElement.appendChild(li)
      li = null
      bullet = null
    }
    // Exibindo a barra de progresso
    css(progressElement, { display: 'block' })
  }

  /**
   * Exibe o popover
   * @param {Object} params
   * @param {String} params.title Título do popover (pode ser HTML)
   * @param {String} params.content Conteúdo do popover (pode ser HTML)
   * @param {String} params.position Posição do popover: top, bottom, right ou left. Default: bottom
   * @param {Number} params.index Índice do passo atual
   * @param {Number} params.id Índice original do passo atual
   * @param {Number} params.length Total de passos na instância atual
   * @param {Number} params.boxWidth Largura da highlightBox para verificar dimensão somada com o popover
   * @param {Boolean} params.noTarget Indica se não há o elemento alvo
   * @param {Boolean} params.fixed Indica se o elemento alvo é fixo
   * @param {Object} params.winSize Dimensões da janela
   */
  function show ({ title, content, position, index, id, length, boxWidth, noTarget, fixed, winSize }) {
    setTitle(title)
    setContent(content)
    element.setAttribute('data-step-index', id) // Para fins de customização desta popover específica (CSS)
    css(arrowElement, { opacity: noTarget ? 0 : 1 })
    // Verificando a necessidade de botões e barra de progresso
    if (length === 1) {
      css(actionsElement, { display: 'none' })
      css(progressElement, { display: 'none' })
    } else {
      css(actionsElement, { display: 'flex' })
      // Formatando os botões de acordo com o passo atual
      btnPreviousElement.setAttribute('data-step', index - 1)
      if (index === 0) {
        btnPreviousElement.setAttribute('disabled', '')
      } else {
        btnPreviousElement.removeAttribute('disabled')
      }
      if (length === (index + 1)) {
        btnNextElement.textContent = settings.doneText
        btnNextElement.setAttribute('data-step', -1)
      } else {
        btnNextElement.textContent = settings.nextText
        btnNextElement.setAttribute('data-step', index + 1)
      }
      settings.showProgress && showProgress(index, length)
    }
    // Exibindo
    element.setAttribute('data-show', '')
    // Verificando as dimensões para reposicionar o popover caso não caiba na tela
    // na posição left ou right
    if (position
      && (position === 'left' || position === 'right')
      && ((boxWidth + element.offsetWidth) > winSize.width)) {
      position = 'top'
    }
    // Habilitando os eventos da instância (performance)
    // via: https://popper.js.org/docs/v2/tutorial/#performance
    popper.setOptions((popperOptions) => ({
      ...popperOptions,
      strategy: fixed ? 'fixed' : 'absolute',
      placement: position && !noTarget ? position : 'bottom',
      modifiers: [
        ...popperOptions.modifiers,
        {
          name: 'offset',
          options: {
            offset: ({ popper }) => {
              // Centralizando o popover quando não há elemento alvo
              if (noTarget) {
                return [0, -(popper.height / 2)]
              } else {
                return settings.offset
              }
            },
          },
        },
        { name: 'eventListeners', enabled: true }
      ]
    }))
    // Atualizando a instância
    popper.update()
  }

  /**
   * Oculta o popover
   */
  function hide () {
    // Ocultando
    element.removeAttribute('data-show')
    element.removeAttribute('data-step-index')
    // Desabilitando os eventos da instância (performance)
    // via: https://popper.js.org/docs/v2/tutorial/#performance
    popper.setOptions((popperOptions) => ({
      ...popperOptions,
      modifiers: [
        ...popperOptions.modifiers,
        { name: 'eventListeners', enabled: false }
      ]
    }))
    // Limpando o conteúdo da popover e resetando botões de ações
    clearElement(titleElement)
    clearElement(contentElement)
    btnPreviousElement.removeAttribute('data-step')
    btnNextElement.removeAttribute('data-step')
    btnNextElement.textContent = settings.nextText
  }

  /**
   * destrói o componente
   */
  function destroy () {
    popper.destroy()
    btnCloseElement = null
    btnPreviousElement = null
    btnNextElement = null
    clearElement(element)
    element.remove()
    element = null
  }

  /* Eventos (handlers) */
  /**
   * Manipula o evento click no elemento btnCloseElement
   * e dispara o evento onClose do componente
   * @param {Object} e Evento
   */
  function onCloseClick (e) {
    e.preventDefault()
    settings.onClose()
  }

  /**
   * Manipula o evento click nos bullets elemento progressListElement
   * e dispara o evento onSelect do componente, fornecendo o índice do passo como argumento
   * @param {Object} e Evento
   */
  function onStepBulletClick (e) {
    e.preventDefault()
    const stepIndex = parseInt(e.target.dataset.step)
    typeof stepIndex !== 'undefined' && settings.onSelect(stepIndex)
  }

  /**
   * Manipula o evento click no elemento btnPreviousElement
   * e dispara o evento onPrevious do componente, fornecendo o índice do passo como argumento
   * @param {Object} e Evento
   */
  function onPreviousClick (e) {
    e.preventDefault()
    const stepIndex = parseInt(e.target.dataset.step)
    typeof stepIndex !== 'undefined' && stepIndex !== -1 && settings.onPrevious(stepIndex)
  }

  /**
   * Manipula o evento click no elemento btnNextElement
   * e dispara o evento onNext do componente, fornecendo o índice do passo como argumento
   * @param {Object} e Evento
   */
  function onNextClick (e) {
    e.preventDefault()
    const stepIndex = parseInt(e.target.dataset.step)
    if (typeof stepIndex !== 'undefined' && stepIndex === -1) {
      settings.onClose()
    } else {
      typeof stepIndex !== 'undefined' && settings.onNext(stepIndex)
    }
  }

  /* Eventos (listeners) */
  btnCloseElement.addEventListener('click', onCloseClick, false)
  btnPreviousElement.addEventListener('click', onPreviousClick, false)
  btnNextElement.addEventListener('click', onNextClick, false)

  return {
    popper,
    element,
    destroy,
    show,
    hide
  }
}
