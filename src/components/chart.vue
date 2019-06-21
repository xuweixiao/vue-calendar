<template>
  <div :style="{display:'inline-block',width:'100%'}">
    <p class="chart-title" v-if="!fullScreenStatus">
      {{ title }}
      <img
        @click="fullScreenOpenOrClose"
        class="screen-full-img"
        :src="fullScreenStatus ?require('@/assets/img/icon_close.png'): require('@/assets/img/icon_screen_full.png')">
    </p>
    <div :id="chartId" :style="{height: height,width:width}"/>
  </div>
</template>

<script>
// 引入图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/component/graphic')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/grid')
require('echarts/lib/component/axis')
require('echarts/lib/component/markPoint')
require('echarts/lib/component/markLine')

export default {
  props: {
    title: {
      type: String,
      default () {
        return '招生趋势'
      }
    },
    chartId: {
      type: String,
      default () {
        return 'bar'
      }
    },
    width: {
      type: String,
      default () {
        return '100%'
      }
    },
    height: {
      type: String,
      default () {
        return '200px'
      }
    },
    option: {
      type: Object
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    enabledClick: {
      type: Boolean,
      default () {
        return false
      }
    },
    fullScreenStatus: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      bar: null,
      empty: false
    }
  },
  watch: {
    option: {
      handler () {
        this.option.series.length === 0 ? this.empty = true : (this.option.series[0].data.length === 0 ? this.empty = true : this.empty = false)
        if (this.empty) {
          this.bar.clear()
        } else {
          this.drawBar()
        }
      },
      deep: true
    },
    height () {
      if (document.getElementById(this.barId) !== null) {
        this.drawBar()
      }
    },
    width () {
      if (document.getElementById(this.barId) !== null) {
        this.drawBar()
      }
    }
  },
  mounted () {
    this.bar = this.$echarts.init(document.getElementById(this.chartId))
    if (this.enabledClick) {
      this.bar.getZr().on('click', (params) => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (this.bar.containPixel('grid', pointInPixel)) {
          const pointInGrid = this.bar.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
          const xIndex = pointInGrid[[0]]
          const op = this.bar.getOption()
          const xValue = op.xAxis[0].data[xIndex]
          this.$emit('onDetail', xValue)
        }
      })
    }
    this.bar.on('legendselectchanged', params => {
      const legendObj = params.selected
      let selectedNum = 0
      for (const key in legendObj) {
        if (legendObj.hasOwnProperty(key)) {
          const element = legendObj[key]
          if (element) {
            selectedNum += 1
          }
        }
      }
      if (selectedNum === 0) {
        legendObj[params.name] = true
        this.option.legend.selected = legendObj
        this.bar.setOption(this.option)
      }
    })
  },
  beforeDestroy () {
    if (this.bar !== null && this.bar !== '' && !(typeof this.bar === 'undefined')) {
      this.bar.clear()
    }
  },
  methods: {
    clearEchart () {
      this.bar.clear()
    },
    drawBar () {
      console.log('change')
      if (this.bar !== null && this.bar !== '' && !(typeof this.bar === 'undefined')) {
        this.bar.resize()
        this.bar.setOption(this.option)
      }
    },
    fullScreenOpenOrClose () {
      if (this.fullScreenStatus) {
        this.$emit('fullScreenOpenOrClose', false)
      } else {
        this.$emit('fullScreenOpenOrClose', true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/echarts.scss'
</style>
