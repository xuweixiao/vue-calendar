<template>
    <div class="calendar-container">
        <img
            @click="change('left')"
            class="icon-calendar-left" src="@/assets/img/icon_left.png">
        <div class="calendar-title">
            {{year}}年<span v-if="showMonth">{{month}}月</span>
        </div>
        <img
            @click="change('right')"
            class="icon-calendar-right" src="@/assets/img/icon_left.png">
    </div>
</template>
<script>
import { getCurentDateInfo } from '@/common/functions/timeFilter.js'

export default {
  name: 'calendarHeader',
  props: {
    showMonth: {
      type: Boolean,
      required: true
    },
    calendarType: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number
    }
  },
  data: function () {
    return {
      // year: null,
      // month: null,
      curYear: null,
      curMonth: null,
      curDate: null
    }
  },
  mounted () {
    this.curDate = getCurentDateInfo()
    this.curYear = Number(this.curDate.year)
    this.curMonth = Number(this.curDate.month)
  },
  methods: {
    change (type) {
      this.$emit('calendarSwitch', this.calendarType, type)
    }
  }
}
</script>

<style lang="scss">
    @mixin icon-calendar{
        width: 18px;
        height: 18px;
        padding: 5px;
    }
    .icon-calendar-left{
        @include icon-calendar
    }
    .icon-calendar-right{
        @include icon-calendar;
        transform:rotate(180deg)
    }
    .calendar-container{
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 10px;
        margin-bottom: 10px;
    }
    .calendar-title{
        color: #666;
        font-size: 16px;
        width: 88px;
        text-align: center;
    }
</style>
