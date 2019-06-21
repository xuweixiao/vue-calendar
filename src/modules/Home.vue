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
            <!-- 1.时间筛选器 -->
            <h3>{{this.timeFilterData.customDateStr}}</h3>
            <!-- 2.插槽使用 -->
            <section>
                <my-table>
                    <template #pageHeader="propsData">
                        ----插槽定制头部----
                        <div>{{propsData.info}}</div>
                    </template>
                    <template #main>
                        <ul class="table">
                          <li
                              class="table-item"
                              v-for="(item,index) of peopleArr"
                              :key="index +'peo'">
                              <span>{{item.name}}</span>
                              <span>{{item.age}}</span>
                          </li>
                        </ul>
                    </template>
                </my-table>
            </section>
            <!-- 3. 横屏 -->
              <div>dd</div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import searchCondition from '@/components/searchCondition.vue'
import pageProgress from '@/components/pageProgress.vue'
import myTable from '@/components/table.vue'
// import deepClone from '@/common/functions/deepClone.js'

export default {
  name: 'Home',
  components: {
    myTable,
    searchCondition,
    pageProgress
  },
  data () {
    return {
      obj: {
        name: 'xudanfeng'
      },
      timeFilterData: {},
      peopleArr: [
        { name: '徐开心', age: 13 },
        { name: '大韩', age: 6 },
        { name: '民国', age: 6 },
        { name: '万岁', age: 6 }
      ],
      pa: ''
    }
  },
  computed: {
    scHeight () {
      return window.innerHeight
    }
  },
  mounted () {},
  methods: {
    timeSure (obj) {
      this.timeFilterData = obj
    }
  }
}
</script>
