# text-highlighter

Highlight text in DOM.

<a href="https://www.npmjs.com/package/text-highlighter"><img src="https://camo.githubusercontent.com/2e606041a364bc76fa8892f54fec03ef98c608fd/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f736b6577736c696465722e7376673f7374796c653d666c61742d737175617265" alt="npm" data-canonical-src="https://img.shields.io/npm/v/text-highlighter.svg?style=flat-square" style="max-width:100%;"></a>

## Installation

```
$ npm install text-highlighter --save
```

## Usage

```html
<div id="container">
We 💓 TypeScript!
</div>

<script src="lib/text-highlighter.js"></script>
<script>
  var textHighlighter = new TextHighlighter(document.getElementById('container'));
  // apply highlight
  textHighlighter.highlight('typescript');

  // remove highlight
  textHighlighter.dehighlight();
</script>
```

## Thanks

- http://stackoverflow.com/questions/10416643/highlight-words-in-html-using-regex-javascript-almost-there
- http://jquery.nj-clucker.com/change-double-byte-to-half-width/

## License

MIT
