<template>
    <div>
        <chart
            :chartId="'line'"
            :height="'300px'"
            :fullOption="barFullOption"
            :option="barOption"
            :title="title"
            :fullScreenStatus="fullScreenStatus"
            @fullScreenOpenOrClose="fullScreenOpenOrClose"/>
    </div>
</template>

<script>
import chart from '@/components/chart'
import deepClone from '@/common/functions/deepClone'
import { chartBaseOption } from '@/common/functions/baseData'

export default {
  components: { chart },
  data () {
    return {
      title: '折线图',
      barOption: deepClone(chartBaseOption),
      barFullOption: deepClone(chartBaseOption),
      xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      yData: [11, 23, 23, 345, 0, 23, 45, 120, 12, 34, 56, 34],
      fullScreenStatus: false
    }
  },
  mounted () {
    this.drawChart(this.xData, this.yData)
  },
  methods: {
    drawChart (xData, yData) {
      this.barOption.color = ['#57a2f8']
      this.barOption.xAxis.data = xData
      this.barOption.legend.show = false
      this.barOption.series.length = 0
      this.barOption.grid.left = 50
      this.barOption.grid.top = 10
      this.barOption.grid.bottom = 100
      this.barOption.grid.right = 20
      this.barOption.series.push({
        name: 'money',
        type: 'bar',
        barCategoryGap: '25%',
        data: yData })
    },
    drawFullScreenChart (xData, yData) {
      this.barFullOption.color = ['#57a2f8']
      this.barFullOption.legend.show = false
      this.barFullOption.series.length = 0
      //   布局上下左右间隔
      this.barFullOption.grid.top = 50
      this.barFullOption.grid.right = 80
      this.barFullOption.grid.left = 50
      this.barFullOption.grid.bottom = 30
      //   提示旋转
      this.barFullOption.tooltip.extraCssText = 'transform: rotate(90deg)'
      this.barFullOption.xAxis = {
        type: 'value',
        position: 'top',
        nameRotate: -90,
        axisLabel: {
          rotate: 90
        },
        scale: true,
        data: [],
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
      }
      this.barFullOption.yAxis = {
        type: 'category',
        inverse: true,
        axisLabel: {
          rotate: -90,
          margin: 15
        },
        data: []
      }
      this.barFullOption.yAxis.data = xData
      this.barFullOption.series.push({
        name: 'money',
        type: 'bar',
        barCategoryGap: '25%',
        data: yData
      })
    },
    fullScreenOpenOrClose (status) {
      this.fullScreenStatus = status
      if (status) {
        this.drawFullScreenChart(this.xData, this.yData)
      }
    }
  }
}
</script>
