<template>
  <div>
    <h4>{{ title }}</h4>
    <div class="box">
      <div v-for="d in data" :key="d.text" class="box-item">
        <div>{{ d.value }}{{ d.unit }}</div>
        <div>{{ d.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { title: String, data: Array }
};
</script>

<style scoped>
.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}
</style>