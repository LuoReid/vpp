<template>
  <div id="oa-finish-nav">
    <router-link v-for="l in links" :key="l.name" :to="{ ...l }">{{
      l.text
    }}</router-link>
  </div>
</template>
<script>
export default {
  props: { links: Array }
};
</script>
<style  scoped>
#oa-finish-nav {
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding-bottom: 10px;
  height: 40px;
}
#oa-finish-nav a {
  margin-right: 12px;
  color: #7079a3;
  padding: 4px 8px 4px 0;
}
.router-link-exact-active,
.router-link-active {
  font-weight: 500;
  color: #404457;
  position: relative;
}
.router-link-exact-active::after,
.router-link-active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  content: "";
  display: block;
  width: 8px;
  height: 2px;
  border-bottom: 2px solid #33c0c5;
}
</style>