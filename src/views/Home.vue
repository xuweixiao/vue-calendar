<template>
    <div class="home">
     <search-condition
        ref="searchControl"
        :echartsName="'筛选框'"
        @timeSure="timeSure"
        :timeData="timeFilterData">
     </search-condition>
     <div>
       <h1>{{this.timeFilterData.customDateStr}}</h1>
     </div>
    </div>
</template>

<script>
// @ is an alias to /src
import searchCondition from '@/components/searchCondition.vue'

export default {
  name: 'home',
  components: {
    searchCondition
  },
  data () {
    return {
      timeFilterData: {}
    }
  },
  methods: {
    timeSure (obj) {
      this.timeFilterData = obj
    }
  }
}
</script>
