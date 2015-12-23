
import {
  toFullWidth,
  toHalfWidth,
  escapeRegExp,
  first
} from './util';

const nativeForEach = Array.prototype.forEach;

export = class TextHighlighter {
  public rxSearchWords: RegExp;

  constructor(public el: HTMLElement) {}

  /**
   * ホワイトスペース文字をパイプ記号で置き換える
   * @param  str 入力文字列
   * @return 置き換え後の文字列
   */
  protected static _replaceWhitespaceWithPipe(str: string = ''): string {
    return str.trim().replace(/\s+/g, '|');
  }

  /**
   * 全角・半角にマッチするように変換したテキストを返却する
   * @param  str 入力文字列
   * @return 変換後の文字列
   */
  protected static _getFullWidthAndHalfWidth(str: string = ''): string {
    return str.split('').map(v => {

      // 全角⇔半角に変換可能な場合は全角半角両方にマッチするようにする (例: a => (?:a|ａ))
      return /[！-～!-~]/.test(v)
        ? `(?:${escapeRegExp(toHalfWidth(v))}|${escapeRegExp(toFullWidth(v))})`
        : escapeRegExp(v);
    }).join('');
  }

  /**
   * ハイライト要素を作成する
   * @param  attrs ハイライト要素の属性
   * @return ハイライト要素
   */
  protected static _createMarker(attrs: {}): HTMLElement {
    const node = document.createElement('mark');

    Object.keys(attrs).forEach(key => node[key] = attrs[key]);

    return node;
  }

  /**
   * el要素内のテキストから検索ワードと一致するテキストを探す
   * @param searchWord 検索ワード
   */
  public highlight(searchWord: string = ''): void {
    this.rxSearchWords = this._getRxSearchWords(searchWord);

    this.dehighlight();

    if (!searchWord) return;

    this._findRecursive(this.el);
  }


  /**
   * ハイライト表示をやめる
   */
  public dehighlight() {
    nativeForEach.call(this.el.querySelectorAll('mark'), (node: Element) => {
      node.parentNode.replaceChild(node.firstChild, node);
    });
    this.el.normalize();
  }

  /**
   * 検索用の正規表現オブジェクトを返却する
   * @param  searchWord 検索テキスト
   * @param  flag       正規表現のフラグ
   * @return パースした正規表現オブジェクト
   */
  protected _getRxSearchWords(searchWord: string = '', flag: string = 'gi'): RegExp {
    return new RegExp(TextHighlighter._replaceWhitespaceWithPipe(TextHighlighter._getFullWidthAndHalfWidth(searchWord)), flag);
  }

  /**
   * 要素内から検索ワードを再帰的に検索する
   * @param node 検索する要素
   */
  protected _findRecursive(node: HTMLElement|Text) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text         = (<Text>node).data;
      let matchedIndex = text.search(this.rxSearchWords);
      let words        = text.slice(matchedIndex).match(this.rxSearchWords);
      let word         = first(words);
      let wordLength   = (word || '').length;

      if (matchedIndex > -1) {
        let rest     = document.createTextNode(text.substr(matchedIndex + wordLength));
        let markNode = TextHighlighter._createMarker({className: 'highlight'});

        (<Text>node).data = text.substr(0, matchedIndex);
        markNode.appendChild(document.createTextNode(text.substr(matchedIndex, wordLength)));
        node.parentNode.insertBefore(rest, node.nextSibling);
        node.parentNode.insertBefore(markNode, node.nextSibling);
        this._findRecursive(rest);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      nativeForEach.call(node.childNodes, this._findRecursive.bind(this));
    }
  }
}
