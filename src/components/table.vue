<template>
    <section>
        <div class="header">
            <slot name="pageHeader" v-bind:info="title">
                默认头部
            </slot>
        </div>
        <div class="main">
            <slot name="main"></slot>
        </div>
        <div class="footer">
            <slot name="pageFooter">
                默认底部
            </slot>
        </div>
    </section>
</template>

<script>
export default {
  data () {
    return {
      title: '子组件表格头部'
    }
  }
}
</script>
<style lang="scss" scoped>
.header{
    color: #35abdd;
    text-align: center;
    padding: 10px;
}
.table{
    padding: 10px;
    border: 1px solid #c1baba;

    .table-item{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        border-bottom: 1px solid #c1baba;

        span {
            display: block;
            text-align: center;
            padding: 10px;
        }
    }
}
.footer{
    margin-top: 20px;
    text-align: center;
    padding: 10px;
    color: #a8b6bc;
}
</style>
