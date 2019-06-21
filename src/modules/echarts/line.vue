<template>
    <div>
        <chart
            :chartId="'line'"
            :height="'300px'"
            :option="barOption"
            :title="'折线图'"
            :fullScreenStatus="false"
            @fullScreenOpenOrClose="fullScreenOpenOrClose"/>
        <!-- 全屏 -->
        <section class="full-srceen-box" v-show="fullScreenShow">
            <div class="chart-rorate"
                :style="{width:fullHeight,marginTop:topSpace + 'px',marginLeft:leftSpace+'px'}">
                <p class="chart-title">
                    {{ title }}
                    <img
                        @click="fullScreenOpenOrClose(false)"
                        class="screen-full-img"
                        :src="require('@/assets/img/icon_close.png')">
                </p>
            </div>
            <chart
                class="full-screen-echarts"
                :chartId="'fullScreenLine'"
                :height="fullHeight"
                :width="fullWidth"
                :option="barFullOption"
                :title="title"
                :fullScreenStatus="true"
                @fullScreenOpenOrClose="fullScreenOpenOrClose"/>
        </section>
    </div>
</template>

<script>
import chart from '@/components/chart.vue'
import deepClone from '@/common/functions/deepClone'
import { chartBaseOption } from '@/common/functions/baseData'
import { replaceStr } from '@/common/functions/baseFuntion'

export default {
  components: { chart },
  data () {
    return {
      title: '折线图',
      barOption: deepClone(chartBaseOption),
      barFullOption: deepClone(chartBaseOption),
      xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      yData: [11, 23, 23, 345, 0, 23, 45, 120, 12, 34, 56, 34],
      fullScreenShow: false
    }
  },
  computed: {
    fullWidth () {
      return window.innerWidth + 'px'
    },
    fullHeight () {
      return window.innerHeight + 'px'
    },
    topSpace () {
      return Math.round(Number(replaceStr(this.fullHeight, 'px', '')) / 2) - Math.round(57 / 2)
    },
    leftSpace () {
      return Number(replaceStr(this.fullWidth, 'px', '')) - Math.round(Number(replaceStr(this.fullHeight, 'px', '')) / 2) - Math.round(57 / 2)
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
      this.barOption.grid.right = 30
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
      this.fullScreenShow = status
      if (this.fullScreenShow) {
        this.drawFullScreenChart(this.xData, this.yData)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/echarts.scss';
</style>
