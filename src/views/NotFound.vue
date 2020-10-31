<template>
  <div class="box">
    敌舰丢失(404)
    <router-link :to="{ name: 'home' }">回到基地</router-link>
  </div>
</template>
<style scoped>
.box {
  min-height: 70vh;
  font-weight: 500;
  font-size: x-large;
  line-height: 70vh;
  text-align: center;
}
</style>