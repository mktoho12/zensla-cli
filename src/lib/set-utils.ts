/**
 * 2つのセットが等しいかどうかを確認します。
 *
 * @param a 比較する最初のセット。
 * @param b 比較する2番目のセット。
 * @returns セットが等しい場合はtrue、それ以外の場合はfalse。
 */
export const areSetsEqual = <T>(a: Set<T>, b: Set<T>): boolean => {
  // どちらかがnullまたはundefinedの場合は、単純に比較します。
  if (a == null || b == null) return a === b

  // サイズが異なる場合は、セットは等しくありません。
  if (a.size !== b.size) return false

  // セットの要素を比較
  return Array.from(a).every(b.has.bind(b))
}
