<template>
  <div class="data">
    <div style="margin:20px">
      <chart style="min-height:50vh;" :option="optionPower" />
    </div>
    <div style="margin:20px">
      <chart style="min-height:50vh;" :option="optionTotal" />
    </div>
  </div>
</template>

<script>
import Chart from "../../components/Chart.vue";
export default {
  components: { Chart },
  data() {
    return {
      powers: [],
    };
  },
  computed: {
    ds1() {
      return ["power"];
    },
    optionPower() {
      return {
        title: { text: "Today power" },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({ source: this.powers })),
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          splitNumber: 13,
          // boundaryGap: false,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: this.ds1.map((m, i) => ({
          type: "line",
          name: 'Today power',
          datasetIndex: i,
          encode: {
            x: "day",
            y: "power_today",
            tooltip: ["day", "power_today"],
          },
          symbol: "circle",
          symbolSize: 10,
        })),
      };
    },
    optionTotal() {
      return {
        title: { text: "Total power" },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({ source: this.powers })),
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          splitNumber: 13,
          // boundaryGap: false,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: this.ds1.map((m, i) => ({
          type: "bar",
          name: 'Today total power',
          datasetIndex: i,
          encode: {
            x: "day",
            y: "power_total",
            tooltip: ["day", "power_total"],
          },
          symbol: "circle",
          symbolSize: 10,
        })),
      };
    },
  },
  created() {
    this.fetchPlant();
  },
  methods: {
    fetchPlant(param = {}) {
      this.$store.dispatch("remote/getPlantPowers").then((res) => {
        this.powers = res.powers;
      });
    },
  },
};
</script>

<style>
</style>