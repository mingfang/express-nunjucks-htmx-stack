const nunjucks = require('nunjucks')

function MarkdownTag(env, renderer = initMarked().parse) {
  this.tags = ['markdown']

  this.parse = function (parser, nodes, lexer) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(tok.value)

    if (args.children.length > 0) {
      return new nodes.CallExtension(this, 'fileTag', args)
    } else {
      const body = parser.parseUntilBlocks('endmarkdown')
      const tagStart = new nodes.NodeList(0, 0, [new nodes.Output(0, 0, [new nodes.TemplateData(0, 0, (tok.colno - 1))])])
      parser.advanceAfterBlockEnd()
      return new nodes.CallExtension(this, 'blockTag', args, [body, tagStart])
    }
  }

  this.fileTag = function (environment, file) {
    return new nunjucks.runtime.SafeString(renderer(env.render(file, environment.ctx)))
  }

  this.blockTag = function (environment, body, tagStart) {
    let text = body()
    const tagStartValue = tagStart()
    
    if (tagStartValue > 0) {
      text = text.split(/\r?\n/)
      text = text.map(function (line) {
        const startSpaces = line.match(/^[\s]+/)
        if (startSpaces && startSpaces[0].length >= tagStartValue) {
          return line.slice(tagStartValue)
        } else if (startSpaces) {
          return line.slice(startSpaces[0].length)
        } else {
          return line
        }
      })
      text = text.join('\n')
    }

    return new nunjucks.runtime.SafeString(renderer(text))
  }
}

/*
Defaults to using Marked and Highlight.js
*/
function initMarked() {
  const marked = require('marked')
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
      const hljs = require('highlight.js')
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, {language}).value
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
  })
  return marked
}

/*
Usage: env.addExtension('markdown', require('markdown-tag')(env, renderer=marked.parse))
*/
module.exports = (env, renderer) => new MarkdownTag(env, renderer)
