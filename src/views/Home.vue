<template>
    <div class="home" :style="{height:scHeight+'px'}">
        <page-progress
            :mainBody="'body'"
            :isClass="true"
            :id="'pdf'"
            :scrollElement="'home'"></page-progress>
        <search-condition
            ref="searchControl"
            :echartsName="'筛选框'"
            @timeSure="timeSure"
            :timeData="timeFilterData">
        </search-condition>
        <div class="body">
            <h3>{{this.timeFilterData.customDateStr}}</h3>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import searchCondition from '@/components/searchCondition.vue'
import pageProgress from '@/components/pageProgress.vue'

export default {
  name: 'home',
  components: {
    searchCondition,
    pageProgress
  },
  data () {
    return {
      timeFilterData: {}
    }
  },
  computed: {
    scHeight () {
      return window.innerHeight
    }
  },
  methods: {
    timeSure (obj) {
      this.timeFilterData = obj
    }
  }
}
</script>
