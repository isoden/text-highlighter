
/**
 * 全角文字を半角文字に変換する
 * @param  str 入力文字列
 * @return 半角に変換後の文字列
 */
export function toHalfWidth(str: string = ''): string {
  return str.replace(/[！-～]/g, match => String.fromCharCode(match.charCodeAt(0) - 0xFEE0));
}

/**
 * 半角文字を全角文字に変換する
 * @param  str 入力文字列
 * @return 全角に変換後の文字列
 */
export function toFullWidth(str: string = ''): string {
  return str.replace(/[!-~]/g, match => String.fromCharCode(match.charCodeAt(0) + 0xFEE0));
}

/**
 * 正規表現で特殊な意味を持つ記号をエスケープする
 * @param  str 入力文字列
 * @return エスケープ後の文字列
 */
export function escapeRegExp(str: string = ''): string {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

/**
 * 配列の最初の要素を返却する
 * @param  array 対象の配列
 * @return 最初の要素
 */
export function first<T>(array: T[]): T {
  return array == null ? void 0 : array[0];
}
