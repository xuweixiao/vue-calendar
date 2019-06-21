/**
 * 验证输入金额，0<= val < 100000000, 正确返回null, 错误返回string
 */
export default function (val) {
  if (Number.isNaN(Number(val))) {
    return '请输入有效金额'
  } else if (!/(^[1-9][0-9]{0,7}(\.\d{0,2})?$)|(^0(\.\d{1,2})?$)/.test(val)) {
    return '请输入正确的金额，最多保留两位小数'
  }
  return null
}
