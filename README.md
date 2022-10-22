# UIGuide

Biblioteca para guiar o usuário pela interface de uma aplicação web (site). Pode ser utilizada como mecanismo de ajuda ou apresentação de elementos da interface.

[https://rogeriocastro.github.io/ui-guide/](https://rogeriocastro.github.io/ui-guide/)

<p align="center"><img src="https://raw.githubusercontent.com/RogerioCastro/ui-guide/main/dist/assets/images/example.png"></p>

Inspirada nas bibliotecas [Intro.js](https://introjs.com/) e [Driver.js](https://github.com/kamranahmedse/driver.js).

Veja uma **demonstração** no diretório [`/dist`](/dist).

## Instalação

Baixe o arquivo de produção da biblioteca que está localizado no diretório [`/dist`](/dist) e acrescente-o à `HEAD` da página. 

```html
<head>
  ...
  <script src="ui-guide.min.js"></script>
  ...
</head>
```

## Utilização

Ao final do corpo da página insira o script de configuração. O início da apresentação pode ser disparado pelo clique em algum elemento ou via código, com a função `instance.start()`.

```html
<body>
  <div id='elemento-01'>
    Elemento 01
  </div>
  <div id='elemento-02'>
    Elemento 02
  </div>
  <div>
    <a onclick="uiguide.start()" title="">Iniciar</a>
  </div>
  <script>
    const uiguide = UIGuide({
      steps: [
        {
          target: 'elemento-01',
          title: 'Título elemento 01',
          content: '<div>Descrição do elemento 01...</div>',
          position: 'top'
        },
        {
          target: 'elemento-02',
          title: 'Título elemento 02',
          content: '<div>Descrição do elemento 02...</div>',
          position: 'right'
        }
      ]
    });
  </script>
</body>
```

## API

```javascript
const uiguide = UIGuide(options);
```

`options` é um objeto que, além da propriedade `steps` (Array com os passos a serem exibidos), pode conter outras propriedades de configuração e manipulação de eventos da biblioteca.

### Estrutura do objeto de cada passo

```javascript
step = {
  target: '',    // (String) ID do elemento alvo
  title: '',     // (String) Título a ser exibido no popover (aceita HTML)
  content: '',   // (String) Conteúdo a ser exibido no popover (aceita HTML)
  position: '',  // (String) Posição do popover: top, bottom, right ou left
  area: {        // (Object) Pode ser informado quando não há um elemento alvo
    top: 0,      // (Number) Posição X em relação ao topo do documento (em pixels)
    left: 0,     // (Number) Posição Y em relação à borda esquerda do documento (em pixels)
    width: 0,    // (Number) Largura da área (em pixels)
    height: 0    // (Number) Altura da área (em pixels)
  }
};
```

A chamada da função `UIGuide(options)` retorna um objeto que pode ser utilizado para gerenciar algumas características da instância.

### Propriedades do objeto retornado (instância)

| Propriedade | Tipo | Descrição |
| ----------- | ---- | --------- |
| `steps` | `array` | *Array* com os passos que estão sendo utilizados para apresentação. Alguns passos podem ser descartados no momento da execução da função `instance.start()` por não estarem visíveis na página no momento. Essa *array* conterá apenas os passos visíveis no momento. |
| `elements` | `object` | Objeto com os principais elementos utilizados pela biblioteca (elementos HTML ou controles desses elementos). O modelo do objeto é: `{ overlay, highlightBox, popover, current }`. `overlay` é o controle do elemento de fundo. `highlightBox` é o controle do elemento da caixa de destaque de elementos alvos. `popover` é o controle do elemento que exibe a caixa de informações, com título, conteúdo, barra de progresso e botões de navegação (*tooltip*). `current` é o elemento HTML que está sendo exibido, seu valor é `null` quando a biblioteca está parada. |
| `settings` | `object` | Configurações gerais da instância. |
| `destroy` | `function` | Função que destrói e remove os elementos criados pela instância. |
| `start` | `function` | Função que inicia a apresentação dos passos: `instance.start(stepIndex)`. `stepIndex` é uma argumento opcional e informa o índice do passo a partir do qual a apresentação iniciará (índice na *array* `steps`). Valor padrão: `0`. |
| `previous` | `function` | Função que apresenta o passo anterior, quando a apresentação está ativa. |
| `next` | `function` | Função que apresenta o próximo passo, quando a apresentação está ativa. |
| `goToStep` | `function` | Função que pula para passo do índice informado, quando a apresentação está ativa. Seu formato é `instance.goToStep(stepIndex)`, onde `stepIndex` é o índice do passo a ser exibido (índice na *array* `steps`). |
| `stop` | `function` | Função que para a apresentação, quando esta está ativa. |

### Propriedades do objeto `options`

| Propriedade | Descrição |
| ----------- | --------- |
| `steps` | *Array* com os objetos dos passos a serem exibidos/apresentados. Cada passo é um objeto da *array*, no formato `{ target, area, title, content, position }`. `target` deve ser o ID do elemento alvo e pode ser omitido quando a intenção é exibir apenas uma caixa de informações (*tooltip*) centralizada, ideal para apresentação inicial. `area` é um objeto que pode simular um alvo, quando não há um elemento HTML para alvo (`target`); o formato de `area` é `{ top, left, width, height }`. `title` é o título a ser exibido na *tooltip* (pode ser HTML). `content` é o conteúdo a ser exibido na *tooltip* (pode ser HTML). `position` é a posição da *tooltip* em relação ao elemento alvo: `top`, `bottom`, `right` ou `left`. |
| `container` | Elemento HTML onde a apresentação será executada e os elementos da biblioteca serão inseridos. Valor padrão: `document.body`. |
| `margin` | Margem, em pixels, a ser aplicada na caixa de destaque do elemento alvo. Valor padrão: `10`. |
| `previousText` | Texto do botão de navegação para o passo anterior, exibido no rodapé da *tooltip*. Valor padrão: `'Anterior'`. |
| `nextText` | Texto do botão de navegação para o próximo passo, exibido no rodapé da *tooltip*. Valor padrão: `'Próximo'`. |
| `doneText` | Texto do botão de encerramento da apresentação, exibido no rodapé da *tooltip* no último passo. Valor padrão: `'Encerrar'`. |
| `showIcons` | Habilita ou desabilita a exibição de ícones nos botões de navegação. Valor padrão: `true`. |
| `showProgress` | Habilita ou desabilita a exibição da barra de progresso dos passos na *tooltip*. Valor padrão: `true`. |
| `popoverClass` | Classe CSS extra a ser aplicada a todas *tooltips*. Valor padrão: `null`. |
| `onStart` | Função executada quando a apresentação é iniciada. Formato: `callback(step, stepIndex)`. |
| `onStep` | Função executada quando um passo é exibido. Formato: `callback(step, stepIndex)`. |
| `onStop` | Função executada quando a apresentação é encerrada ou parada. Formato: `callback(step, stepIndex)`. |

### Estrutura das *tooltips* para customização

Quando uma classe for informada na opção `popoverClass`, esta será adicionada ao elemento raiz das *tooltips*, junto com a classe padrão `uig-popover` (no exemplo abaixo a classe informado é `custom-class`):

```html
<div class="uig-popover custom-class" data-step-index="0">
  <div class="uig-popover-header">
    <div class="uig-popover-title" />
    <a class="uig-popover-close" />
  </div>
  <div class="uig-popover-content" />
  <div class="uig-popover-progress">
    <ul>
      <li><a class="active" /></li>
      <li><a /></li>
    </ul>
  </div>
  <div class="uig-popover-actions" />
    <button class="uig-popover-button" />
    <button class="uig-popover-button" />
  </div>
  <div class="uig-popover-arrow" /> <!-- Não modificar -->
</div>
```

> O atributo `data-step-index` pode ser utilizado, em CSS, para customizar o estilo da *tooltip* ou elementos de passos específicos. Exemplo:
`.custom-class[data-step-index='0'] { background-color: #FFF; }`

## Desenvolvimento

Essa biblioteca foi desenvolvida utilizando [webpack](https://webpack.js.org/) para o empacotamento.

```bash
# Dependências
$ npm install

# Servidor de desenvolvimento (localhost:9000)
# Roda o 'index.html' do diretório '/dist'
$ npm start

# Build de produção
$ npm run build
```

> O comando `npm run build` irá gerar os arquivos `ui-guide.min.js`, `ui-guide.min.js.map` e `ui-guide.min.js.LICENSE.txt` no diretório [`/dist`](/dist).

## Créditos

[Popper.js](https://popper.js.org/) - Biblioteca de posicionamento de *tooltips* e *popovers*.

[Free CSS](https://www.free-css.com/) - A página utilizada no exemplo é uma das templates gratuitas disponíveis no site.

## License

MIT &copy; Rogério Castro
