<template>
    <mt-popup
        v-model="$store.state.timeFilterShow"
        popup-transition="popup-fade"
        class="organization-popup"
        lockScroll="true"
        :closeOnClickModal="closeOnClickModal"
        position="top">
        <section class="organization-container">
            <ul
                v-if="custom"
                style="padding:15px 0 0 15px;"
                class="organization-ul">
                <li class="filter-title">
                    日期
                </li>
                <li
                    class="organization-item"
                    :class="{active:selectedItem.id == item.id}"
                    v-for="item in dateList"
                    @click="itemClick(item)"
                    :key="item.id">
                    <div
                        class="item">
                        {{item.name}}
                    </div>
                </li>
            </ul>
            <div
                v-if="customAuth && custom"
                @click="customDateClick"
                class="custom-btn-container">
                <span v-if="Object.keys(selectData).length === 0">自定义日期范围</span>
                <span v-else style="color:#4A8AFC;">{{selectData.id ? '自定义日期范围' :customDate}}</span>
            </div>
            <section
                v-if="!custom"
                class="date-container">
                <div class="filter-title">
                    自定义日期范围
                </div>
                <div class="date-content">
                    <div class="cel-row clearfix border-bottom-line">
                        <div
                            class="cel-col-6 float-left date-tab"
                            :class="{active:dateTab === 1,lineBottom:dateTab === 1}"
                            @click="dateTabClick(1)">日历</div>
                        <div
                            class="cel-col-6 float-left date-tab"
                            :class="{active:dateTab === 2,lineBottom:dateTab === 2}"
                            @click="dateTabClick(2)">周历</div>
                        <div
                            class="cel-col-6 float-left date-tab"
                            :class="{active:dateTab === 3,lineBottom:dateTab === 3}"
                            @click="dateTabClick(3)">月历</div>
                        <div
                            class="cel-col-6 float-left date-tab"
                            :class="{active:dateTab === 4,lineBottom:dateTab === 4}"
                            @click="dateTabClick(4)">季度</div>
                    </div>
                    <div class="cel-row clearfix">
                        <!-- 日/周日历 -->
                        <calendar
                            class="custom-container"
                            :class="{calendarActive:dateTab === 1 || dateTab === 2}"
                            v-if="dateTab === 1 || dateTab === 2"
                            :range="true"
                            :futureDayHide="nowTimeStamp"
                            :sundayStart="true"
                            :markDate="markDate"
                            :defaultDate="defaultDate"
                            @changeMonth="changeMonth"
                            @choseDay="choseDay">
                        </calendar>
                        <!-- 月日历 -->
                        <ul
                            v-if="dateTab === 3"
                            :class="{calendarActive:dateTab === 3}"
                            class="organization-ul custom-container">
                            <li>
                                <calendar-header
                                    :calendarType="'month'"
                                    :year="monthCalendar.year"
                                    @calendarSwitch="calendarSwitch"
                                    :showMonth="false"></calendar-header>
                            </li>
                            <li
                                class="organization-item"
                                :class="{active:monthSelected.id === item.id}"
                                v-for="(item,index) in monthOfYearList"
                                @click="monthClick(item)"
                                :key="item.id">
                                <div
                                    :class="{disable:item.disable}"
                                    :style="{'margin-right':(index%4 === 3 ? 0 :'15px')}"
                                    class="item">
                                {{item.name}}
                                </div>
                            </li>
                        </ul>
                        <!-- 季度 -->
                        <ul
                            v-if="dateTab === 4"
                            :class="{calendarActive:dateTab === 4}"
                            class="organization-ul custom-container">
                            <li>
                                <calendar-header
                                    :calendarType="'quarter'"
                                    :year="quarterCalendar.year"
                                    @calendarSwitch="calendarSwitch"
                                    :showMonth="false"></calendar-header>
                            </li>
                            <li
                                class="organization-item no-top"
                                :class="{active:quarterSelected.id === item.id}"
                                v-for="(item,index) in quarterOfYearList"
                                @click="quarterClick(item)"
                                :key="item.id">
                                <div
                                    :class="{disable:item.disable}"
                                    :style="{'margin-right':(index%4 === 3 ? 0 :'15px')}"
                                    class="item">
                                {{item.name}}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </section>
        <div
            v-if="!custom"
            class="organization-bottom">
            <div
                class="organization-bottom-left">
                <button
                    @click="reset()"
                    class="organization-bottom-btn btn-reset">重置</button>
            </div>
            <div class="organization-bottom-right">
                <button
                    @click="sure()"
                    :class="{btnDisabled:btnDisabled}"
                    class="organization-bottom-btn">确定</button>
            </div>
        </div>
     </mt-popup>
</template>

<script>
import mtPopup from 'mint-ui/lib/popup/index.js'
import 'mint-ui/lib/popup/style.css'
import { formatDateTime, weekList, monthList, quarterList, getCurentDateInfo, quarter, getTimeStamp, getTotalDaysOfMonth, getSomeOneWeek } from '@/common/functions/timeFilter.js'
import Calendar from '@/components/calendar/index.js'
import calendarHeader from '@/components/calendarHeader.vue'
import { getCatchData, setCatchData, removeCatchData } from '@/common/functions/catch'

export default {
  components: { mtPopup, Calendar, calendarHeader },
  props: {
    closeOnClickModal: {
      type: Boolean,
      required: true
    },
    selectData: {
      type: Object,
      required: false
    },
    dateList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      monthOfYearList: monthList,
      quarterOfYearList: quarterList,
      weekOfMonthList: weekList,
      defaultDate: new Date(),
      selectedItem: {},
      loading: false,
      showBack: false,
      dateTab: 1,
      custom: false, // 自定义日期控制
      customAuth: false, // 自定义日期控制
      monthSelected: {},
      weekSelected: {},
      quarterSelected: {},
      curDate: null,
      weekCalendar: {
        year: 0,
        month: 0
      },
      monthCalendar: {
        year: 0
      },
      quarterCalendar: {
        year: 0
      },
      customDate: '', // 自定义日期
      nowTimeStamp: '0', // 当前时间时间戳
      markDate: [],
      btnDisabled: true,
      nowTime: 0
    }
  },
  computed: {
    showStatus () {
      return this.$store.state.timeFilterShow
    }
  },
  watch: {
    showStatus () {
      if (this.showStatus) {
        this.selectedItem = this.selectData
        this.initCalendar()
      }
    },
    dateList () {
      this.custom = true
    }
  },
  destroyed () {
    removeCatchData('CUSTOM_TIME1')
  },
  methods: {
    /**
         * 自定义日历显示隐藏
         */
    customDateClick () {
      this.custom = false
    },
    /**
         * 重置
         */
    reset () {
      this.markDate = []
      this.selectedItem = {}
      this.monthSelected = {}
      this.quarterSelected = {}
      this.btnDisabled = true
    },
    /**
         * 改变月
         */
    changeMonth (obj) {
      this.markDate = []
      this.btnDisabled = true
    },
    /**
         * 日历点击
         */
    choseDay (obj, curCalendar) {
      this.defaultDate = curCalendar
      if (this.dateTab === 2) {
        this.btnDisabled = false
        this.markDate = []
        let c = getSomeOneWeek(obj)
        for (let i = 0; i < 7; i++) {
          let stamp = i * 24 * 60 * 60 * 1000
          let start = new Date(c.startDate + stamp)
          let year = start.getFullYear()
          let month = start.getMonth() + 1
          let max = start.getDate()
          this.markDate.push(`${year}/${month}/${max}`)
        }
      } else if (this.dateTab === 1) {
        /**
                 * 第一步判断markDate个数，
                 * 如果是两个就清空数组
                 * 如果为空，就push
                 * 如果有一个，就push数组，并计算两个日期之间日期的push到markDate
                 */
        if (this.markDate.length >= 2) {
          this.btnDisabled = true
          this.markDate = []
        } else if (this.markDate.length === 1) {
          this.btnDisabled = false
          this.markDate.push(obj)
          let array1 = this.markDate[0].split('/')
          let array2 = obj.split('/')
          array1.forEach((x, index) => {
            array1[index] = Number(x)
          })
          array2.forEach((x, index) => {
            array2[index] = Number(x)
          })
          let max = Number(array1[2] > array2[2] ? array1[2] : array2[2])
          let min = Number(array1[2] > array2[2] ? array2[2] : array1[2])
          for (let i = min + 1; i < max; i++) {
            this.markDate.push(`${array1[0]}/${array2[1]}/${i}`)
          }
        }
        if (this.markDate.length === 0) {
          this.btnDisabled = true
          this.markDate.push(obj)
        }
      }
    },
    /**
         * 自定义日期确定
         */
    sure () {
      switch (this.dateTab) {
        case 1:
          if (this.markDate.length >= 2) {
            let array1 = this.markDate[0].split('/')
            let array2 = this.markDate[1].split('/')
            let startDate
            let endDate
            if (Number(array2[2]) > Number(array1[2])) {
              startDate = getTimeStamp(array1[0], array1[1], array1[2], false)
              endDate = getTimeStamp(array2[0], array2[1], array2[2], true)
            } else {
              endDate = getTimeStamp(array1[0], array1[1], array1[2], true)
              startDate = getTimeStamp(array2[0], array2[1], array2[2], false)
            }
            let obj = { startTime: startDate, endTime: endDate }
            this.customDate = `${formatDateTime(startDate, 'yyyy-MM-dd')} ~ ${formatDateTime(endDate, 'yyyy-MM-dd')}`
            obj.customDateStr = this.customDate
            this.$emit('customSure', obj)
          }
          break
        case 2:// 周确定
          if (this.markDate.length === 7) {
            let array1 = this.markDate[0].split('/')
            let array2 = this.markDate[6].split('/')
            let startDate = getTimeStamp(array1[0], array1[1], array1[2], false)
            let endDate = getTimeStamp(array2[0], array2[1], array2[2], true)
            let obj = { startTime: startDate, endTime: endDate }
            this.customDate = `${formatDateTime(startDate, 'yyyy-MM-dd')} ~ ${formatDateTime(endDate, 'yyyy-MM-dd')}`
            obj.customDateStr = this.customDate
            this.$emit('customSure', obj)
          } else {
            window.Toast('请选择好日期在确定')
          }
          break
        case 3:// 月
        {
          if (typeof (this.monthSelected.id) !== 'undefined') {
            let startDate = getTimeStamp(this.monthCalendar.year, this.monthSelected.id, 1, false)
            let endDate = getTimeStamp(this.monthCalendar.year, this.monthSelected.id, getTotalDaysOfMonth(this.monthCalendar.year, this.monthSelected.id), true)
            let obj = { startTime: startDate, endTime: endDate }
            this.customDate = `${formatDateTime(startDate, 'yyyy-MM-dd')} ~ ${formatDateTime(endDate, 'yyyy-MM-dd')}`
            obj.customDateStr = this.customDate
            this.$emit('customSure', obj)
          }
          break
        }
        case 4: { // 季度
          if (typeof (this.quarterSelected.id) !== 'undefined') {
            let quarterInfo = quarter[this.quarterSelected.id]
            let startDate = getTimeStamp(this.quarterCalendar.year, quarterInfo.startM, quarterInfo.startD, false)
            let endDate = getTimeStamp(this.quarterCalendar.year, quarterInfo.endM, quarterInfo.endD, true)
            let obj = { startTime: startDate, endTime: endDate }
            this.customDate = `${formatDateTime(startDate, 'yyyy-MM-dd')} ~ ${formatDateTime(endDate, 'yyyy-MM-dd')}`
            obj.customDateStr = this.customDate
            this.$emit('customSure', obj)
          }
          break
        }
      }
      if (!this.showStatus) {
        let params = {
          markDate: this.markDate,
          selectedItem: this.selectedItem,
          monthSelected: this.monthSelected,
          quarterSelected: this.quarterSelected,
          btnDisabled: this.btnDisabled,
          dateTab: this.dateTab
        }
        setCatchData('CUSTOM_TIME', 1, params)
      }
    },
    /**
         * 初始化日历
         */
    initCalendar () {
      this.custom = true
      this.customAuth = true
      this.curDate = getCurentDateInfo()
      this.nowTime = getTimeStamp(this.curDate.year, this.curDate.month, this.curDate.day, false)
      this.nowTimeStamp = ((this.nowTime / 1000).toFixed(0)).toString()
      this.curDate.year = Number(this.curDate.year)
      this.curDate.month = Number(this.curDate.month)
      this.curDate.day = Number(this.curDate.day)
      let params = getCatchData('CUSTOM_TIME', 1)
      if (params.length === 0) {
        this.monthCalendar.year = this.curDate.year
        this.quarterCalendar.year = this.curDate.year
        this.defaultDate = new Date()
      }
      this.markDate = typeof (params.markDate) === 'undefined' ? [] : params.markDate
      this.monthSelected = typeof (params.monthSelected) === 'undefined' ? {} : params.monthSelected
      this.quarterSelected = typeof (params.quarterSelected) === 'undefined' ? {} : params.quarterSelected
      this.btnDisabled = typeof (params.btnDisabled) === 'undefined' ? {} : params.btnDisabled
      this.dateTab = typeof (params.dateTab) === 'undefined' ? 1 : params.dateTab
      this.futureTimeOperation()
    },
    /**
         * @param obj 选中季度对象
         */
    quarterClick (obj) {
      if (!obj.disable) {
        this.quarterSelected = obj
        this.btnDisabled = false
      }
    },
    /**
         * @param obj 选中月对象
         */
    monthClick (obj) {
      if (!obj.disable) {
        this.monthSelected = obj
        this.btnDisabled = false
      }
    },
    /**
         * @param obj 选中周对象
         */
    weekClick (obj) {
      this.weekSelected = obj
      this.btnDisabled = false
    },
    /**
         * 日期点击
         */
    itemClick (obj) {
      removeCatchData('CUSTOM_TIME1')
      this.reset()
      this.$emit('timeSure', obj)
    },
    /**
         * 自定义日历tab点击
         */
    dateTabClick (type) {
      if (type !== this.dateTab) {
        this.dateTab = type
        this.markDate = []
        this.monthSelected = {}
        this.quarterSelected = {}
        this.btnDisabled = true
      }
    },
    calendarSwitch (type, direction) {
      if (type === 'month') {
        this.switch(direction, this.monthCalendar, false)
      } else if (type === 'quarter') {
        this.switch(direction, this.quarterCalendar, false)
      }
    },
    /**
         * @param type 日历切换方向
         * @param date 当前日历数据
         * @param showMonth 是否带月
         */
    switch (type, date, showMonth) {
      if (showMonth) {
        if (type === 'left') {
          // 月减，注意可能跨年
          date.year = date.month === 1 ? date.year - 1 : date.year
          date.month = date.month === 1 ? 12 : date.month - 1
        } else if (type === 'right') {
          // 月加，注意可能跨年
          if (this.curDate.year >= date.year && date.month <= this.curDate.month) {
            // 顺序重要性
            if (this.curDate.year === date.year && date.month === this.curDate.month) {
              return
            }
            date.year = date.month === 12 ? date.year + 1 : date.year
            date.month = date.month === 12 ? 1 : date.month + 1
          }
        }
      } else {
        if (type === 'left') {
          // 月减，注意可能跨年
          date.year = date.year > 2018 ? date.year - 1 : date.year
          this.reset()
          this.futureTimeOperation()
        } else if (type === 'right') {
          // 月加，注意可能跨年
          if (this.curDate.year > date.year) {
            // 顺序重要性
            date.year = date.year + 1
          }
          this.reset()
          this.futureTimeOperation()
        }
      }
    },
    /**
         * 控制未来时间不可点击
         */
    futureTimeOperation () {
      // 月历
      this.monthOfYearList.forEach(element => {
        if (this.curDate.year === this.monthCalendar.year) {
          element.disable = !(element.id <= this.curDate.month)
        } else {
          element.disable = false
        }
      })
      // 季度日历
      if (this.curDate.year === this.quarterCalendar.year) {
        this.quarterOfYearList.forEach(element => {
          element.disable = true
        })
        if (this.curDate.month >= quarter.oneQuarter.startM) {
          this.quarterOfYearList[0].disable = false
        }
        if (this.curDate.month >= quarter.twoQuarter.startM) {
          this.quarterOfYearList[1].disable = false
        }
        if (this.curDate.month >= quarter.threeQuarter.startM) {
          this.quarterOfYearList[2].disable = false
        }
        if (this.curDate.month >= quarter.fourQuarter.startM) {
          this.quarterOfYearList[3].disable = false
        }
      } else {
        this.quarterOfYearList.forEach(element => {
          element.disable = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/animation.scss';
    $text-normal:#485465;
    $text-selected:#53A8E2;
    $bg-selected:#DDEEF9;
    $bg-normal:#F9F9F9;
    $bg-top-change:#F6F6F6;

    .mint-popup-top {
        top: 48px;
        z-index:10000000 !important;
    }

    .btnDisabled{
        background-color: #ccc !important;
    }
    .organization-popup{
        width:100%;
        max-height: 410px;
        min-height:230px;
        padding-bottom: 50px;
        box-sizing: border-box;
        overflow: hidden;
        animation: moveAnimation .5s linear 0s alternate;
    }
    .organization{

        &-container{
            background-color: #fff;
            height: 100%;
            box-sizing: border-box;
            position: relative;
            width:100%;
            overflow-y: auto;

            .filter-title{
                padding-left: 15px;
                color: $text-normal;
                font-size: 16px;
                padding-bottom: 15px;
                background-color: #fff;
            }
        }

        &-ul{
            padding: 15px;
            padding-bottom: 0;
            overflow-y: auto;
            position: relative;
            -webkit-overflow-scrolling: touch;
            .active{
                .item{
                    border: 1px solid $text-selected;
                    background-color: $bg-selected;
                    color: $text-selected;
                }
            }
        }

        &-item{
            float: left;
            width: 25%;
            margin-bottom: 20px;

            .item{
                padding: 8px 10px;
                background-color: $bg-normal;
                border-radius: 4px;
                font-size: 12px;
                text-align: center;
                color: $text-normal;
                box-sizing: border-box;
                margin-right: 15px;
                overflow: hidden;
                white-space: nowrap;
                border: 1px solid $bg-normal
            }

            .disable{
                background-color: #eee;
                color: #c7c4c4;
            }
        }

        &-bottom{
            display: flex;
            align-items:center;
            flex-direction:row;
            padding: 0 15px;
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: #f8f8f8;
            border-top: 1px solid #f2f2f2;
            width: 100%;
            box-sizing: border-box;

             &-left{
                width: 90px;
                height: 50px;
                line-height: 50px;
                color: #999;
                font-size: 12px;
             }

            &-right{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
            }

             &-btn{
                color: #fff;
                border-radius: 4px;
                background-color: #4A88FB;
                border: none;
                padding: 5px 20px;
            }

            .btn-reset{
                background-color: #fff;
                color: #538EFC;
                border: 1px solid #4A88FB;
                box-sizing: border-box;
            }
        }
    }
    .date-container{
        padding-top:15px;
        height: 100%;
        box-sizing: border-box;
        background-color:#fff;

        .date-content{
            padding: 0 15px;

            .date-tab{
                text-align:center;
                line-height:40px;
                box-sizing: border-box;
                background-color: #fff;
            }
            .lineBottom{
                border-bottom: 2px solid #4A88FB;
            }
        }
    }
    .custom-container{
        padding: 0;
        margin-left: 200%;
        height: 270px;
        transition:all .5s;
    }
    .calendarActive{
        margin-left: 0;
        transition:all .5s;
    }
    .no-top{
        margin-top: 0;
    }
    .border-bottom-line{
        border-bottom: 1px solid #f2f2f2;
        background-color: #f9f9f9;
    }
    .custom-btn-container{
        text-align: center;
        padding: 7px 10px;
        background-color: $bg-top-change;
        border-radius: 4px;
        margin-left: 20px;
        margin-right: 20px;
        font-size: 12px;
        color:$text-normal;
    }
</style>

<style lang="scss">
$color-text-default:#9097A1;
$color-text-selected:#4C5869;
$color-text-last:#C8CBD0;
$color-text-light:#4A88FB;
$border-line-color:#8a8a8a;
$bg-top-change:#fff;

.wh_top_changge{
    margin:10px 0;
    justify-content: center;
}
.wh_top_changge li{
     background-color:$bg-top-change !important;
     height: 30px !important;
     width:40px;
     flex:none !important;
}
.wh_top_changge .wh_content_li{
     background-color:$bg-top-change !important;
     width:110px;
     font-size:16px !important;
}
@mixin jiantou{
    width:6px !important;
    height:6px !important;
}
.wh_jiantou1{
    @include jiantou;
    border-top:1px solid $border-line-color !important;
    border-left:1px solid $border-line-color !important;
}
.wh_jiantou2{
    @include jiantou;
    border-top:1px solid $border-line-color !important;
    border-right:1px solid $border-line-color !important;
    justify-content:flex-start !important;
}
.wh_top_changge li{
    color:#485465 !important;
}
.wh_top_tag{
    color:#A3A9B2 !important;
    height: 30px !important;
    width: 30px !important;
    margin-bottom: 10px !important;
}
.wh_content_item > .wh_isMark{
    border:1px solid $color-text-light;
    background-color:$bg-top-change !important;
    color:$color-text-light !important
}
.wh_content_item .wh_chose_day{
    background-color:$bg-top-change !important;
}
.wh_content_item .wh_isToday{
    background-color:$bg-top-change !important;
}
.wh_content{
    padding:0 !important;
    justify-content: center;

    .wh_content_item{
        height: auto !important;
    }
}
.wh_item_date{
    color:$color-text-default !important;
    width:20px !important;
    height:20px !important;
    line-height:20px !important;
    font-size:12px !important;
    margin-bottom:10px !important;
    box-sizing:border-box;
}
.wh_content_all{
    background-color:$bg-top-change !important;
    font-size:10px !important;
    padding-bottom:0 !important;
}
@mixin calendar-item{
    background-color: $bg-top-change !important;
    color:$color-text-last !important;
}
.wh_content_item .wh_want_dayhide{
    @include calendar-item;
}
.wh_content_item .wh_other_dayhide{
    @include calendar-item;
}
</style>
