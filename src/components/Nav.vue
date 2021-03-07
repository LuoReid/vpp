<template>
  <div class="oa-finish-nav">
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
.oa-finish-nav {
  width: 100%;
  display: inline-flex;
  align-items: center;
  /* padding-bottom: 10px; */
  height: 40px;
  /* border: 1px dashed orange; */
  background:#f0f2f5 ;
}
.oa-finish-nav a {
  margin-right: 12px;
  color: #000;
  font-weight: bold;
  padding: 8px 16px;
  background:  #fff;
  border-radius: 6px 6px 0 0;
}
.oa-finish-nav .router-link-exact-active,
.oa-finish-nav .router-link-active {
  font-weight: bold;
  color: #fff;
  background: #1890ff;
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