const setCatchData = function (name, type, value) {
  let catchName = name + type
  window.sessionStorage.setItem(catchName, JSON.stringify(value))
}

const getCatchData = function (name, type) {
  let catchName = name + type
  let ret = []
  if (window.sessionStorage.getItem(catchName) !== null) {
    ret = JSON.parse(window.sessionStorage.getItem(catchName))
  }
  return ret
}

const getCatchDataObject = function (name, type) {
  let catchName = name + type
  let ret = {
    dataSource: '',
    showTrueData: false,
    datas: [],
    updateTime: null
  }
  if (window.sessionStorage.getItem(catchName) !== null) {
    ret = JSON.parse(window.sessionStorage.getItem(catchName))
  }
  return ret
}

const setCatchDataLocation = function (name, value) {
  window.localStorage.setItem(name, JSON.stringify(value))
}

const getCatchDataLocation = function (name) {
  let ret = null
  if (window.localStorage.getItem(name) !== null) {
    ret = JSON.parse(window.localStorage.getItem(name))
  }
  return ret
}

const clearCatchDataLocation = function () {
  window.localStorage.clear()
}

const clearCatchData = function () {
  window.sessionStorage.clear()
}

const removeCatchData = function (key) {
  window.sessionStorage.removeItem(key)
}

export {
  setCatchData,
  getCatchData,
  setCatchDataLocation,
  getCatchDataLocation,
  clearCatchDataLocation,
  clearCatchData,
  removeCatchData,
  getCatchDataObject
}
