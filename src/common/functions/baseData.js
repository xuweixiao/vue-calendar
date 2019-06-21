const chartBaseOption = {
  color: ['#3c90f7', '#55bfc0', '#5ebe67', '#f4cd49', '#e05667', '#7c4bd8'],
  title: {
    text: '',
    x: 'center',
    textStyle: {
      color: '#485465',
      fontSize: 15
    },
    subtextStyle: {
      color: '#666'
    }
  },
  grid: {
    left: '0',
    top: 30,
    right: '20',
    bottom: '3%'
  },
  xAxis: {
    data: [],
    axisLabel: {
      color: '#485465'
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#999',
        width: 1
      }
    },
    axisTick: { // 刻度线
      show: true,
      alignWithLabel: true,
      lineStyle: {
        color: '#999',
        width: 1
      }
    }
  },
  tooltip: {
    formatter: '{b} : {c} ',
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true
  },
  toolbox: {
    show: false
  },
  legend: {},
  yAxis: {
    type: 'value',
    data: [],
    axisLabel: {
      color: '#485465'
    },
    nameTextStyle: {
      color: '#333'
    },
    splitLine: {
      lineStyle: {
        // 使用深浅的间隔色
        color: ['#ddd'],
        type: 'dashed'
      }
    }
  },
  series: []
}

export {
  chartBaseOption
}
