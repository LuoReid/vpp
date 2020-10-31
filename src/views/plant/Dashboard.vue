<template>
  <div>
    <a-row :gutter="30">
      <a-col :span="14">
        <DashSummary title="Daily Overview" :data="data" />
      </a-col>
      <a-col :span="10">
        <DashSummary title="Summary" :data="data1" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import DashSummary from "./DashSummary";
export default {
  components: { DashSummary },
  data() {
    return {
      data: [
        { text: "PV production", value: 359, unit: "MW" },
        { text: "Export to grid", value: 5.3, unit: "MW" },
        { text: "Import from grid", value: 139.3, unit: "MW" },
        { text: "Available Battery Capacity", value: 985, unit: "KW" }
      ],
      data1: [
        { text: "Gross genestion", value: 5.12, unit: "GWh" },
        { text: "Total component power", value: 27734, unit: "kWh" },
        { text: "Total revenue(estimated)", value: 273832.39, unit: "$" },]
    };
  }
};
</script>

<style>
</style>