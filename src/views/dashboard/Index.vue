<template>
  <div class="data">
    <h3>Power Tracking</h3>
    <div class="toolbar">
      Day
      <a-date-picker :default-value="day" @change="onChange" />
    </div>
    <div style="margin:20px">
      <chart style="min-height:50vh;" :option="optionPower" />
    </div>
    <div style="margin:20px">
      <chart style="min-height:50vh;" :option="optionTotal" />
    </div>
    <div class="toolbar">
      Month
      <a-month-picker :default-value="month" @change="onChangeMonth" />
    </div>
    <div style="margin:20px">
      <chart style="min-height:50vh;" :option="optionMonth" />
    </div>
    <div style="margin:20px">
      <chart style="min-height:50vh;" :option="optionYear" />
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
      energy: [],
      day: new Date().toISOString().substring(0, 10),
      month: new Date().toISOString().substring(0, 7),
      energyMonth: [],
      energyYear: [],
    };
  },
  computed: {
    ds1() {
      return ["power"];
    },
    optionPower() {
      return {
        title: {
          text: "Real-time power tracking(w,updated by ever 15 minutes)",
        },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({ source: this.powers })),
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
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
          name: "Today power",
          datasetIndex: i,
          encode: {
            x: "dayhour",
            y: "power_today",
            tooltip: ["power_today"],
          },
          symbol: "circle",
          symbolSize: 10,
        })),
      };
    },
    optionTotal() {
      return {
        title: {
          text: "Daily generation tracking(kwh,updated by ever 15 minutes)",
        },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({ source: this.energy })),
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
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
          name: "Today total energy",
          datasetIndex: i,
          encode: {
            x: "today",
            y: "today_energy",
            tooltip: [ "today_energy"],
          },
          symbol: "circle",
          symbolSize: 10,
        })),
      };
    },
    optionMonth() {
      return {
        title: {
          text: "Monthly generation tracking (kwh,updated by ever month)",
        },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({ source: this.energyMonth })),
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
          name: "Day generation",
          datasetIndex: i,
          encode: {
            x: "today",
            y: "today_energy",
            tooltip: [ "today_energy"],
          },
          symbol: "circle",
          symbolSize: 10,
        })),
      };
    },
    optionYear() {
      return {
        title: { text: "Year generation tracking (kwh,updated by ever year)" },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({ source: this.energyYear })),
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
          name: "Month generation",
          datasetIndex: i,
          encode: {
            x: "today",
            y: "today_energy",
            tooltip: ["today_energy"],
          },
          symbol: "circle",
          symbolSize: 10,
        })),
      };
    },
  },
  created() {
    this.fetchPlant();
    this.fetchPlantMonth();
  },
  methods: {
    onChange(date, dateString) {
      this.day = dateString;
      this.fetchPlant();
      console.log("date:", date, dateString);
    },
    onChangeMonth(date, dateString) {
      this.month = dateString;
      this.fetchPlantMonth();
      console.log("date:", date, dateString);
    },
    fetchPlant(param = {}) {
      param.day = this.day;
      param.kind = "summary";
      this.$store.dispatch("remote/getPlantPowers", param).then((res) => {
        this.powers = res.powers;
        this.energy = res.energy;
      });
    },
    fetchPlantMonth(param = {}) {
      param.month = this.month;
      param.kind = "sumamry_month";
      this.$store.dispatch("remote/getPlantPowers", param).then((res) => {
        this.energyMonth = res.energy;
        this.energyYear = res.year;
      });
    },
  },
};
</script>

<style scoped>
.data {
  padding: 0 15px;
}
.data h3 {
  margin: 10px 0;
}
</style>