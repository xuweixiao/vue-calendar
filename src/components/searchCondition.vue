<template>
    <section class="search-section">
        <section class="search-container">
            <div
                @click="timeFilterHeadClick()"
                :class="{active:tabIndex === 1}"
                class="search-container-organization">
                <div class="title" v-if="timeShow">日期</div>
                <div class="title" v-else>{{timeFilterData.name}}</div>
                <svg
                    :class="{rotateImg:tabIndex === 1}"
                    viewBox="0 0 1024 1024" version="1.1" width="13" height="13">
                    <path d="M517.688889 796.444444c-45.511111 0-85.333333-17.066667-119.466667-51.2L73.955556 381.155556c-22.755556-22.755556-17.066667-56.888889 5.688888-79.644445 22.755556-22.755556 56.888889-17.066667 79.644445 5.688889l329.955555 364.088889c5.688889 5.688889 17.066667 11.377778 28.444445 11.377778s22.755556-5.688889 34.133333-17.066667l312.888889-364.088889c22.755556-22.755556 56.888889-28.444444 79.644445-5.688889 22.755556 22.755556 28.444444 56.888889 5.688888 79.644445L637.155556 739.555556c-28.444444 39.822222-68.266667 56.888889-119.466667 56.888888 5.688889 0 0 0 0 0z" p-id="1410"></path>
                </svg>
            </div>
        </section>
        <time-filter
            @timeSure="timeSure"
            @customSure="customSure"
            :dateList="dateList"
            :selectData="timeFilterData"
            :closeOnClickModal="true"></time-filter>
    </section>
</template>

<script>
import timeFilter from '@/components/timeFilter.vue'
import { formatDateTime, timeFilterData, getTimeStamp, getCurentDateInfo, quarter, getTotalDaysOfMonth, getCurentWeek, getLastWeek } from '@/common/functions/timeFilter.js'

export default {
  components: {
    timeFilter
  },
  props: {
    timeData: {
      type: Object
    },
    echartsName: {
      type: String
    }
  },
  data () {
    return {
      timeFilterData: {},
      curentDate: null,
      tabIndex: -1,
      dateList: [],
      timeShow: true
    }
  },
  computed: {
    timeFilterShow () {
      return this.$store.state.timeFilterShow
    }
  },
  watch: {// 弹框点击遮罩层关闭，文字和图片处理
    timeFilterShow () {
      this.initTab()
    }
  },
  mounted () {
    this.timeFilterData = this.timeData
    this.curentDate = getCurentDateInfo()
    this.dateList = timeFilterData
  },
  destroyed () {
    this.$store.commit('SET_TIME_FILTER', false)
  },
  methods: {
    timeFilterHeadClick () {
      this.$store.commit('SET_TIME_FILTER', !this.$store.state.timeFilterShow)
    },
    initTab () {
      this.timeFilterData = this.timeData
      if (this.timeFilterShow) {
        this.tabIndex = 1
      } else {
        this.tabIndex = -1
      }
    },
    /* eslint-disable */
    /**
     * 时间筛选框确定
     */
    timeSure(obj) {
        this.$store.commit('SET_TIME_FILTER', false)
        this.timeFilterData = obj
        let startDate = null
        let endDate = null
        let n = null
        var eventCode = ''
        var eventName = ''
        switch (Number(obj.id)) {
            case 12:// 本年
                eventCode = 'DT-21013-CLICK'
                eventName = '本年'
                startDate = getTimeStamp(this.curentDate.year, 1, 1, false)
                endDate = getTimeStamp(this.curentDate.year, 12, 31, true)
                break
            case 10:// 本季度
                eventCode = 'DT-21011-CLICK'
                eventName = '本季度'
                for (let item in quarter) {
                    if (this.curentDate.month >= quarter[item].startM && this.curentDate.month <= quarter[item].endM) {
                        startDate = getTimeStamp(this.curentDate.year, quarter[item].startM, quarter[item].startD, false)
                        endDate = getTimeStamp(this.curentDate.year, quarter[item].endM, quarter[item].endD, true)
                        break
                    }
                }
                break
            case 11:// 上季度  存在跨年季度之分
                eventCode = 'DT-21012-CLICK'
                eventName = '上季度'
                {
                    let quarterIndex = null
                    for (let item in quarter) {
                        if (this.curentDate.month >= quarter[item].startM && this.curentDate.month <= quarter[item].endM) {
                            quarterIndex = item
                            break
                        }
                    }
                    if (quarter[quarterIndex].startM === 1) { // 跨年季度
                        startDate = getTimeStamp(this.curentDate.year - 1, quarter.fourQuarter.startM, 1, false)
                        endDate = getTimeStamp(this.curentDate.year - 1, quarter.fourQuarter.endM, quarter.fourQuarter.endD, true)
                    } else {
                        startDate = getTimeStamp(this.curentDate.year, quarter[quarterIndex].startM - 3, 1, false)
                        endDate = getTimeStamp(this.curentDate.year, quarter[quarterIndex].endM - 3, getTotalDaysOfMonth(this.curentDate.year, quarter[quarterIndex].endM - 3), true)
                    }
                }
                break
            case 3: // 今日
                eventCode = 'DT-21004-CLICK'
                eventName = '今日'
                startDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, false)
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, true)
                break
            case 4: // 昨天 判断跨月，跨年情况
                eventCode = 'DT-21005-CLICK'
                eventName = '昨天'
                if (this.curentDate.day === 1) { // 跨月
                    if (this.curentDate.month === 1) { // 跨年跨月
                        startDate = getTimeStamp(this.curentDate.year - 1, 12, 31, false)
                        endDate = getTimeStamp(this.curentDate.year - 1, 12, 31, true)
                    } else { // 跨月不跨年 求某月最后一天日期
                        let day = getTotalDaysOfMonth(this.curentDate.year, this.curentDate.month - 1)
                        startDate = getTimeStamp(this.curentDate.year, this.curentDate.month - 1, day, false)
                        endDate = getTimeStamp(this.curentDate.year, this.curentDate.month - 1, day, true)
                    }
                } else { // 不跨月不跨年
                    startDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day - 1, false)
                    endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day - 1, true)
                }
                break
            case 7:// 本月
                eventCode = 'DT-21008-CLICK'
                eventName = '本月'
                startDate = getTimeStamp(this.curentDate.year, this.curentDate.month, 1, false)
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, getTotalDaysOfMonth(this.curentDate.year, this.curentDate.month), true)
                break
            case 19:// 本月
                eventCode = 'DT-21020-CLICK'
                eventName = '本月下月'
                startDate = getTimeStamp(this.curentDate.year, this.curentDate.month, 1, false)
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month+1, getTotalDaysOfMonth(this.curentDate.year, this.curentDate.month+1), true)
                break    
            case 8:// 上月
                eventCode = 'DT-21009-CLICK'
                eventName = '上月'
                if (this.curentDate.month === 1) { // 跨年
                    startDate = getTimeStamp(this.curentDate.year - 1, 12, 1, false)
                    endDate = getTimeStamp(this.curentDate.year - 1, 12, 31, true)
                } else {
                    startDate = getTimeStamp(this.curentDate.year, this.curentDate.month - 1, 1, false)
                    endDate = getTimeStamp(this.curentDate.year, this.curentDate.month - 1, getTotalDaysOfMonth(this.curentDate.year, this.curentDate.month - 1), true)
                }
                break
            case 9: // 上上月
                eventCode = 'DT-21010-CLICK'
                eventName = '上上月'
                if (this.curentDate.month <= 2) { // 跨年
                    if (this.curentDate.month === 2) {
                        startDate = getTimeStamp(this.curentDate.year - 1, 12, 1, false)
                        endDate = getTimeStamp(this.curentDate.year - 1, 12, 31, true)
                    } else {
                        startDate = getTimeStamp(this.curentDate.year - 1, 11, 1, false)
                        endDate = getTimeStamp(this.curentDate.year - 1, 11, 30, true)
                    }
                } else {
                    startDate = getTimeStamp(this.curentDate.year, this.curentDate.month - 2, 1, false)
                    endDate = getTimeStamp(this.curentDate.year, this.curentDate.month - 2, getTotalDaysOfMonth(this.curentDate.year, this.curentDate.month - 2), true)
                }
                break
            case 1: // 近7天
                eventCode = 'DT-21002-CLICK'
                eventName = '近7天'
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, true)
                startDate = endDate - 7 * 24 * 60 * 60 * 1000 + 1
                break
            case 2: // 近30天
                eventCode = 'DT-21003-CLICK'
                eventName = '近30天'
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, true)
                startDate = endDate - 30 * 24 * 60 * 60 * 1000 + 1
                break
            case 17: // 近60天
                eventCode = 'DT-21018-CLICK'
                eventName = '近60天'
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, true)
                startDate = endDate - 60 * 24 * 60 * 60 * 1000 + 1
                break
            case 18: // 近180天
                eventCode = 'DT-21019-CLICK'
                eventName = '近180天'
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, true)
                startDate = endDate - 180 * 24 * 60 * 60 * 1000 + 1
                break
            case 5: // 本周
                eventCode = 'DT-21006-CLICK'
                eventName = '本周'
                let ret = getCurentWeek()
                startDate = ret.startDate
                endDate = ret.endDate
                break
            case 6: // 上周
                eventCode = 'DT-21007-CLICK'
                eventName = '上周'
                let ret2 = getLastWeek(7)
                startDate = ret2.startDate
                endDate = ret2.endDate
                break
            case 14: //本月来
                eventCode = 'DT-21015-CLICK'
                eventName = '本月来'
                startDate = getTimeStamp(this.curentDate.year, this.curentDate.month, 1, false)
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month,this.curentDate.day, true)
                break
            case 15: //本季来
                eventCode = 'DT-21016-CLICK'
                eventName = '本季来'
                for (let item in quarter) {
                    if (this.curentDate.month >= quarter[item].startM && this.curentDate.month <= quarter[item].endM) {
                        startDate = getTimeStamp(this.curentDate.year, quarter[item].startM, quarter[item].startD, false)
                        endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, true)
                        break
                    }
                }
                break
            case 16: // 本年来
                eventCode = 'DT-21017-CLICK'
                eventName = '本年来'
                startDate = getTimeStamp(this.curentDate.year, 1, 1, false)
                endDate = getTimeStamp(this.curentDate.year, this.curentDate.month, this.curentDate.day, true)
                break
        }
        const data = { startTime:startDate, endTime:endDate, name:obj.name, id:obj.id, customDateStr:`${formatDateTime(startDate, 'yyyy-MM-dd')} ~ ${formatDateTime(endDate, 'yyyy-MM-dd')}`}
        this.$emit('timeSure',data)
    },
    /* eslint-enable */
    /**
    * 自定义日期回调
    */
    customSure (obj) {
      this.$store.commit('SET_TIME_FILTER', false)
      this.$emit('timeSure', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
    .search-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content:space-around;
        border-bottom: 10px solid #f6f7fb;
        color: #666;
        background-color: #fff;
        margin-bottom: 0;

        &-organization {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0;
        }

        svg {
            fill: #666;
            margin-left: 5px;
        }

        .active {
            color: #4A8AFC;
            svg {
                fill: #4A8AFC;
            }
        }

        .rotateImg {
            transform: rotate(180deg);
        }

        .title {
            max-width: 80px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
</style>
<style lang="scss">
    .v-modal {
        top: 48px;
        overflow-y: hidden;
        touch-action: none;
    }
</style>
