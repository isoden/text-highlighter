# text-highlighter

Highlight text in DOM.

[![npm](https://img.shields.io/npm/v/text-highlighter.svg?style=flat-square)](https://www.npmjs.com/package/text-highlighter)

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
