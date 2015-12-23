var TextHighlighter = require('../');
var chai            = require('chai');
var jsdom           = require('mocha-jsdom');

describe('text-highlighter', () => {
  var container;
  var textHighlighter;

  jsdom();

  before(() => {
    container       = document.createElement('div');
    textHighlighter = new TextHighlighter(container);
  });

  describe('TextHighlighter.prototype.highlightメソッド', () => {
    it('ハイライトされる', () => {
      container.innerHTML = `JavaScript`;
      textHighlighter.highlight('JavaScript');
      chai.expect(container.innerHTML).to.equal(`<mark class="highlight">JavaScript</mark>`);
    });

    it('検索ワードにスペースを含めると復数ワードハイライトされる', () => {
      container.innerHTML = `JavaScript TypeScript`;
      textHighlighter.highlight('Java Type');
      chai.expect(container.innerHTML).to.equal(`<mark class="highlight">Java</mark>Script <mark class="highlight">Type</mark>Script`);
    });

    it('大文字・小文字の区別なくハイライトする', () => {
      container.innerHTML = 'JavaScript javascript JAVASCRIPT';
      textHighlighter.highlight('javascript');
      chai.expect(container.innerHTML).to.equal(`<mark class="highlight">JavaScript</mark> <mark class="highlight">javascript</mark> <mark class="highlight">JAVASCRIPT</mark>`);
    });

    it('全角・半角英数記号の区別なくハイライトする', () => {
      container.innerHTML = 'JavaScript ＪａｖａＳｃｒｉｐｔ';
      textHighlighter.highlight('javascript');
      chai.expect(container.innerHTML).to.equal(`<mark class="highlight">JavaScript</mark> <mark class="highlight">ＪａｖａＳｃｒｉｐｔ</mark>`);
    });

    it('エンコードしてある文字には反応しない', () => {
      container.innerHTML = '&lt;span&gt;foo&lt;/span&gt;';
      textHighlighter.highlight('lt foo');
      chai.expect(container.innerHTML).to.equal(`&lt;span&gt;<mark class="highlight">foo</mark>&lt;/span&gt;`);
    });
  });
});
