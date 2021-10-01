/*!
 * UIGuide 1.0.0
 *
 * Copyright 2021 Rogério Castro.
 * Released under the MIT license
 */
import createOverlay from './core/overlay'
import createHighlightBox from './core/highlightBox'
import createPopover from './core/popover'
import isHTMLElement from './util/isHTMLElement'
import elementPosition from './util/elementPosition'
import getWindowSize from './util/getWindowSize'
import isVisible from './util/isVisible'
import isFixed from './util/isFixed'
import _scrollTo from './util/scrollTo'
import './styles/uiguide.scss'

/**
 * Inicializa a biblioteca
 * @param {Object} options Configurações gerais
 * @returns {Object}
 */
export default function UIGuide(options) {

  // Configurações gerais
  const settings = {
    container: document.body,
    margin: 10, // margem a ser adicionada à highlightBox
    current: null, // Passo atual e seu índice: { step, stepIndex }
    steps: [],
    previousText: 'Anterior',
    nextText: 'Próximo',
    doneText: 'Encerrar',
    showIcons: true,
    showProgress: true,
    popoverClass: null,
    onStart: () => {},
    onStep: () => {},
    onStop: () => {},
    ...options
  }

  // Verificando o container
  if (settings.container && typeof settings.container === 'object' && settings.container !== null && !isHTMLElement(settings.container)) {
    throw new Error('O objeto fornecido como container não é um elemento HTML.')
  } else if (settings.container && typeof settings.container === 'string') {
    settings.container = document.querySelector(settings.container)
    if (!settings.container) {
      throw new Error('Não há nenhum elemento para container com o seletor fornecido.')
    }
  }

  /**
   * Armazena os passos que serão utilizados
   * Alguns passos podem ser descartados por não estarem visíveis no momento
   * Modelo de um step:
   * {
   *   target: '',       // (String) ID do elemento alvo
   *   title: '',        // (String) Título a ser exibido no popover (aceita HTML)
   *   content: '',      // (String) Conteúdo a ser exibido no popover (aceita HTML)
   *   position: '',     // (String) Posição do popover: top, bottom, right ou left
   *   area: {           // (Object) Pode ser informado quando não há um elemento alvo
   *     top: 0,         // (Number) Posição X em relação ao topo do documento (em pixels)
   *     left: 0,        // (Number) Posição Y em relação à borda esquerda do documento (em pixels)
   *     width: 0,       // (Number) Largura da área (em pixels)
   *     height: 0       // (Number) Altura da área (em pixels)
   *   },
   * }
   */
  let steps = []

  // Elementos HTML ou seus controles
  const elements = {
    overlay: createOverlay({
      container: settings.container,
      onClick: stop
    }),
    highlightBox: createHighlightBox({
      container: settings.container,
      margin: settings.margin,
      onTransitionEnd: onHighlightBoxTransitionEnd
    }),
    popover: null,
    current: null
  }

  // Popover
  // Iniciando separado, pois precisa do highlightBox já iniciado
  elements.popover = createPopover({
    container: settings.container,
    target: elements.highlightBox.element,
    previousText: settings.previousText,
    nextText: settings.nextText,
    doneText: settings.doneText,
    showIcons: settings.showIcons,
    showProgress: settings.showProgress,
    extraClass: settings.popoverClass,
    onSelect: onPopoverSelect,
    onPrevious: onPopoverPrevious,
    onNext: onPopoverNext,
    onClose: stop
  })

  /**
   * Exibe um passo pelo seu índice em 'steps'
   * @param {Number} stepIndex Índice do passo a ser exibido
   */
  function loadStep (stepIndex) {
    const step = steps[stepIndex]
    const winSize = getWindowSize()
    let fixed = true
    let noTarget = true
    let isArea = false
    let currentRect = {
      top: winSize.height / 2,
      left: winSize.width / 2,
      width: 1,
      height: 1
    }
    settings.current = { step, stepIndex }

    // Tornando transparente durante o reposicionamento
    elements.popover.element.style.opacity = 0

    // Verificando se há elemento alvo ou não
    if (step.target) {
      // Pegando o elemento alvo que será destacado e seus dados
      elements.current = document.getElementById(step.target)
      _scrollTo(elements.current)
      fixed = isFixed(elements.current)
      currentRect = elements.current.getBoundingClientRect()
      noTarget = false
    } else {
      // Verificando se foi informada uma área ao invés do elemento alvo
      if (step.area) {
        fixed = false
        noTarget = false
        isArea = true
        currentRect = {
          top: step.area.top,
          left: step.area.left,
          width: step.area.width,
          height: step.area.height
        }
        // 'height' é informado para viabilizar a centralização da área
        _scrollTo({ top: step.area.top, left: step.area.left, height: step.area.height })
      }
      elements.current = null
    }

    // Posição do elemento alvo
    // elementPosition(el) fornece a posição em relação ao documento
    // getBoundingClientRect() fornece a posição em relação à tela
    // offsetWidth e offsetHeight fornecem posições relativas
    const coords = fixed || isArea ? { top: currentRect.top, left: currentRect.left } : elementPosition(elements.current)
    const { top, left } = coords
    const { width, height } = currentRect

    // Plota, redimensiona e posiciona a highlightBox
    // Ao término das transformações dispara um evento que atualiza o popover
    elements.highlightBox.show({ top, left, width, height, fixed, noTarget })

    // Ativando o popover, embora ainda esteja transparente
    const { title, content, position } = step
    elements.popover.show({
      title,
      content,
      position,
      index: stepIndex,
      id: step.id,
      length: steps.length,
      boxWidth: width + settings.margin,
      noTarget,
      fixed,
      winSize,
    })

    settings.onStep(step, step.id)
  }

  /**
   * Inicia a exibição dos passos
   * @param {Number} startAt Índice do passo. Indica em qual passo a exibição vai iniciar. Default: 0
   */
  function start (startAt = 0) {
    // Não faz nada se a apresentação já estiver sendo exibida
    // ou o índice informado for maior ou igual ao número de passos
    if (settings.current || startAt >= settings.steps.length) {
      return
    }
    if (!settings.steps.length) {
      throw new Error('Passos não definidos (steps).')
    }
    // Verificando se os elementos estão visíveis
    settings.steps.forEach((step, i) => {
      if (step.target) {
        const el = document.getElementById(step.target)
        if (el && isVisible(el)) {
          steps.push({ ...step, id: i })
        }
      } else {
        steps.push({ ...step, id: i })
      }
    })
    // Iniciando os elementos base
    elements.overlay.show()
    elements.current = null
    // Exibindo o passo inicial
    // Se o passo inicial escolhido não estiver visível pula para o próximo
    let stepIndex = -1
    while (stepIndex === -1) {
      stepIndex = steps.findIndex(s => s.id === startAt)
      if (stepIndex === -1) {
        startAt++
      }
      if (startAt >= settings.steps.length) {
        break
      }
    }
    if (stepIndex === -1) {
      return
    }
    settings.onStart(steps[stepIndex], steps[stepIndex].id)
    loadStep(stepIndex)
  }

  /**
   * Vota ao passo anterior, caso a apresentação esteja ativa
   */
  function previous () {
    if (!settings.current) {
      return
    }
    if (settings.current.stepIndex > 0) {
      loadStep(settings.current.stepIndex - 1)
    }
  }

  /**
   * Pula para o próximo passo, caso a apresentação esteja ativa
   */
  function next () {
    if (!settings.current) {
      return
    }
    if (settings.current.stepIndex < (steps.length - 1)) {
      loadStep(settings.current.stepIndex + 1)
    }
  }

  /**
   * Pula para um determinado passo (indicado pelo índice), caso a apresentação esteja ativa
   * @param {Number} stepIndex Índice do passo a ser exibido
   */
  function goToStep (stepIndex) {
    // Não faz nada se a apresentação não estiver ativa
    // ou o índice informado for maior ou igual ao número de passos
    if (!settings.current || stepIndex >= settings.steps.length) {
      return
    }
    let index = -1
    // Se o passo escolhido não estiver visível pula para o próximo
    while (index === -1) {
      index = steps.findIndex(s => s.id === stepIndex)
      if (index === -1) {
        stepIndex++
      }
      if (stepIndex >= settings.steps.length) {
        break
      }
    }
    if (settings.current.stepIndex === index || index === -1) {
      return
    }
    loadStep(index)
  }

  /**
   * Interrompe a apresentação
   */
  function stop () {
    // desativando os elementos
    if (settings.current) {
      const { step } = settings.current
      settings.onStop(step, step.id)
      settings.current = null // resetando
    }
    steps = []
    elements.current = null
    elements.popover.hide()
    elements.highlightBox.hide()
    elements.overlay.hide()
  }

  /**
   * destrói todos os elementos
   */
  function destroy () {
    for (const element in elements) {
      if (elements[element]?.destroy) {
        elements[element].destroy()
        elements[element] = null
      } else {
        elements[element] = null
      }
    }
  }

  /* Eventos (handlers)*/
  /**
   * Manipula o evento onTransitionEnd do componente highlightBox
   * Utilizado para atualizar a posição do popover e exibi-lo quando alguma
   * das transformações em highlightBox termina (caso a apresentação esteja ativa)
   * @param {Object} e Evento
   */
  function onHighlightBoxTransitionEnd () {
    if (settings.current) {
      elements.popover.popper.update()
      elements.popover.element.style.opacity = 1
    }
  }

  /**
   * Manipula o evento onSelect do componente popover
   * @param {Number} stepIndex Índice do passo
   */
  function onPopoverSelect (stepIndex) {
    const step = steps[stepIndex]
    if (step) {
      loadStep(stepIndex)
    }
  }

  /**
   * Manipula o evento onPrevious do componente popover
   * @param {Number} stepIndex Índice do passo
   */
  function onPopoverPrevious (stepIndex) {
    const step = steps[stepIndex]
    if (step) {
      loadStep(stepIndex)
    }
  }

  /**
   * Manipula o evento onNext do componente popover
   * @param {Number} stepIndex Índice do passo
   */
  function onPopoverNext (stepIndex) {
    const step = steps[stepIndex]
    if (step) {
      loadStep(stepIndex)
    }
  }

  return {
    steps,
    elements,
    settings,
    destroy,
    start,
    previous,
    next,
    goToStep,
    stop
  }
}
