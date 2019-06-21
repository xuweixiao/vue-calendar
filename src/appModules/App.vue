<template>
  <div class="app-body">
    <div>第二个页面</div>
    <router-link :to="{name:'printe'}">跳页面</router-link>
    <router-link :to="{name:'list'}">跳页面</router-link>
    <router-view/>
  </div>
</template>
