/**
 * @method 替换字符串中某些字符
 * @param str 操作字符串
 * @param replaceStr 被替换的字符
 * @param targetStr 替代的字符
 * @returns 返回替换好的字符
 * 替换
 */
export const replaceStr = function (str, replaceStr, targetStr) {
  return str.replace(replaceStr, targetStr)
}
