/**
 * 时间戳格式化
 */
const formatDateTime = function (value = '', format = 'yyyy/MM/dd hh:mm:ss') {
  let date = ''
  if (value) {
    let reg = new RegExp('[-|.]', 'g')
    date = new Date(typeof value === 'string' ? value.replace(reg, '/') : value)
  } else {
    date = new Date()
  }
  let formats = format
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(formats)) {
    formats = formats.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(formats)) {
      formats = formats.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((o[k].toString()).length)))
    }
  }
  return formats
}
/**
 * 获取某个日期时间戳
 */
const getTimeStamp = function (year, month, day, nightStatus) {
  let d = day <= 9 ? '0' + day : day
  let m = month <= 9 ? '0' + (month - 1) : (month - 1)
  let ret = new Date(String(year), m, d).getTime()
  if (nightStatus) {
    ret = ret + 24 * 1000 * 60 * 60 - 1
  }
  return ret
}
/**
 * 获取当天日期信息
 */
const getCurentDateInfo = function () {
  let date = new Date()
  let ret = { year: 0, month: 1, day: 31 }
  ret.year = date.getFullYear()
  ret.month = date.getMonth() + 1
  ret.day = date.getDate()
  return ret
}
/**
 * 获取某月共多少天数或者某月最后一天日期
 */
const getTotalDaysOfMonth = function (year, month) {
  let m = month <= 9 ? '0' + month : month
  let ret = new Date(String(year), m, 0).getDate()
  return ret
}
/**
 * 获取本周信息
 */
const getCurentWeek = function () {
  let date = new Date()
  let num = date.getDay()
  let left = num === 0 ? 6 : num - 1
  date.setDate(date.getDate() - left)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  let startWeek = date.getTime()
  date.setDate(date.getDate() + 6)
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  date.setMilliseconds(999)
  let endWeek = date.getTime()
  return { startDate: startWeek, endDate: endWeek }
}

/**
 * 获取某周信息
 */
const getSomeOneWeek = function (datestr, sundayStart = true) {
  let date = new Date(datestr)
  let num = date.getDay()
  let startWeek
  let endWeek
  let left
  if (sundayStart) {
    left = num
  } else {
    left = num === 0 ? 6 : num - 1
  }
  date.setDate(date.getDate() - left)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  startWeek = date.getTime()
  date.setDate(date.getDate() + 6)
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  date.setMilliseconds(999)
  endWeek = date.getTime()
  return { startDate: startWeek, endDate: endWeek }
}

/**
 * 获取上周信息
 */
const getLastWeek = function (num) {
  let ret = getCurentWeek()
  let formula = num * 1000 * 60 * 60 * 24
  ret.startDate = ret.startDate - formula
  ret.endDate = ret.endDate - formula
  return ret
}
/**
 * 获取当前年，当前月，当前天信息
 */

const quarter = { // 季度
  oneQuarter: {
    startM: 1,
    startD: 1,
    endM: 3,
    endD: 31
  },
  twoQuarter: {
    startM: 4,
    startD: 1,
    endM: 6,
    endD: 30
  },
  threeQuarter: {
    startM: 7,
    startD: 1,
    endM: 9,
    endD: 30
  },
  fourQuarter: {
    startM: 10,
    startD: 1,
    endM: 12,
    endD: 31
  }
}

const timeFilterData = [
  { id: 1, name: '近7天' },
  { id: 2, name: '近30天' },
  { id: 3, name: '今天' },
  { id: 4, name: '昨天' },
  { id: 5, name: '本周' },
  { id: 6, name: '上周' },
  { id: 7, name: '本月' },
  { id: 8, name: '上月' },
  { id: 9, name: '上上月' },
  { id: 10, name: '本季' },
  { id: 11, name: '上季' },
  { id: 12, name: '本年' },
  { id: 14, name: '本月来' },
  { id: 15, name: '本季来' },
  { id: 16, name: '本年来' },
  { id: 17, name: '近60天' },
  { id: 18, name: '近180天' },
  { id: 19, name: '本月下月' }
]

const weekList = [
  { id: 1, name: '第一周' },
  { id: 2, name: '第二周' },
  { id: 3, name: '第三周' },
  { id: 4, name: '第四周' }
]

const quarterList = [
  { id: 'oneQuarter', name: '一季度', disable: false },
  { id: 'twoQuarter', name: '二季度', disable: false },
  { id: 'threeQuarter', name: '三季度', disable: false },
  { id: 'fourQuarter', name: '四季度', disable: false }
]

const monthList = [
  { id: 1, name: '一月', disable: false },
  { id: 2, name: '二月', disable: false },
  { id: 3, name: '三月', disable: false },
  { id: 4, name: '四月', disable: false },
  { id: 5, name: '五月', disable: false },
  { id: 6, name: '六月', disable: false },
  { id: 7, name: '七月', disable: false },
  { id: 8, name: '八月', disable: false },
  { id: 9, name: '九月', disable: false },
  { id: 10, name: '十月', disable: false },
  { id: 11, name: '十一月', disable: false },
  { id: 12, name: '十二月', disable: false }
]

export { getTimeStamp, getCurentDateInfo, quarter, timeFilterData, getTotalDaysOfMonth, getCurentWeek, getLastWeek, weekList, monthList, quarterList, getSomeOneWeek, formatDateTime }
