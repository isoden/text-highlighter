

/**
 * 配列の最初の要素を返却する
 * @param  array 対象の配列
 * @return 最初の要素
 */
function first<T>(array: T[]): T {
  return array == null ? void 0 : array[0];
}

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
   * 正規表現で特殊な意味を持つ記号をエスケープする
   * @param  str 入力文字列
   * @return エスケープ後の文字列
   */
  protected static _escapeRegExp(str: string = ''): string {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  /**
   * _getFullWidthAndHalfWidth
   */
  protected static _getFullWidthAndHalfWidth(str: string = ''): string {
    return str.split('').map(v => {

      // 全角⇔半角に変換可能な場合は全角半角両方にマッチするようにする (例: a => (?:a|ａ))
      return /[！-～!-~]/.test(v)
        ? `(?:${TextHighlighter._escapeRegExp(TextHighlighter._toHalfWidth(v))}|${TextHighlighter._escapeRegExp(TextHighlighter._toFullWidth(v))})`
        : TextHighlighter._escapeRegExp(v);
    }).join('');
  }

  /**
   * 全角文字を半角文字に変換する
   * @param  str 入力文字列
   * @return 半角に変換後の文字列
   */
  protected static _toHalfWidth(str: string = ''): string {
    return str.replace(/[！-～]/g, match => String.fromCharCode(match.charCodeAt(0) - 0xFEE0));
  }

  /**
   * 半角文字を全角文字に変換する
   * @param  str 入力文字列
   * @return 全角に変換後の文字列
   */
  protected static _toFullWidth(str: string = ''): string {
    return str.replace(/[!-~]/g, match => String.fromCharCode(match.charCodeAt(0) + 0xFEE0));
  }

  /**
   * ハイライト要素を作成する
   * @param  attrs ハイライト要素の属性
   * @return ハイライト要素
   */
  protected static _createMarker(attrs: {}): HTMLElement {
    var node = document.createElement('mark');

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
    Array.prototype.forEach.call(this.el.querySelectorAll('mark'), (node: Element) => {
      node.parentNode.replaceChild(node.firstChild, node);
    });
    this.el.normalize();
  }

  /**
   * 検索用の正規表現オブジェクトを返却する
   * @param  searchWord 検索テキスト
   * @param  正規表現のフラグ
   * @return パースした正規表現オブジェクト
   */
  protected _getRxSearchWords(searchWord: string = '', flag: string = 'gi'): RegExp {
    return new RegExp(TextHighlighter._replaceWhitespaceWithPipe(TextHighlighter._getFullWidthAndHalfWidth(searchWord)), flag);
  }

  /**
   * 要素内から検索ワードを再帰的に検索する
   * @param node
   */
  protected _findRecursive(node: HTMLElement|Text) {
    if (node.nodeType === Node.TEXT_NODE) {
      var text         = (<Text>node).data;
      var matchedIndex = text.search(this.rxSearchWords);
      var words        = text.slice(matchedIndex).match(this.rxSearchWords);
      var word         = first(words);
      var wordLength   = (word || '').length;

      if (matchedIndex > -1) {
        var rest     = document.createTextNode(text.substr(matchedIndex + wordLength));
        var markNode = TextHighlighter._createMarker({className: 'highlight'});

        (<Text>node).data = text.substr(0, matchedIndex);
        markNode.appendChild(document.createTextNode(text.substr(matchedIndex, wordLength)));
        node.parentNode.insertBefore(rest, node.nextSibling);
        node.parentNode.insertBefore(markNode, node.nextSibling);
        this._findRecursive(rest);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.prototype.forEach.call(node.childNodes, this._findRecursive.bind(this));
    }
  }

}
