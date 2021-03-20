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
import { atldTime } from "@/util";
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
    maxYear() {
      return atldTime(Math.max(...this.energyYear.map((m) => m.dayhour)));
    },
    maxMonth() {
      return atldTime(Math.max(...this.energyMonth.map((m) => m.dayhour)));
    },
    maxDayPower() {
      return atldTime(Math.max(...this.energy.map((m) => m.dayhour)));
    },
    maxDayEnergy() {
      return atldTime(Math.max(...this.energy.map((m) => m.dayhour)));
    },
    year() {
      return this.month.substring(0, 4);
    },
    today() {
      return this.day;
    },
    month1() {
      const ym = this.month.split("-");
      const last = new Date(ym[0], ym[1], 1);
      return [`${this.month}-01 00:00:00`, last.toISOString().substring(0, 10)];
    }, 
    optionPower() {
      return {
        title: {
          text: `Real-time power tracking(w,updated by ${this.maxDayPower})`,
        },
        dataset: [{ source: this.powers }],
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          // boundaryGap: false,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
          splitNumber: 24,
          min: `${this.day} 00:00:00`,
          max: `${this.day} 23:59:59`,
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: [
          {
            type: "line",
            name: "Today power",
            smooth: true,
            datasetIndex: 0,
            encode: {
              x: "today",
              y: "power_today",
              tooltip: ["power_today"],
            },
            symbol: "circle",
            symbolSize: 10,
          },
        ],
      };
    },
    optionTotal() {
      return {
        title: {
          text: `Daily generation tracking(kwh,updated by ${this.maxDayEnergy})`,
        },
        dataset: [{ source: this.energy }],
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
          splitNumber: 24,
          min: `${this.day} 00:00:00`,
          max: `${this.day} 23:59:59`,
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
          scale: true,
        },
        series: [
          {
            type: "bar",
            name: "Today total energy",
            smooth: true,
            datasetIndex: 0,
            encode: {
              x: "today",
              y: "today_energy",
              tooltip: ["today_energy"],
            },
            symbol: "circle",
            symbolSize: 10,
          },
        ],
      };
    },
    optionMonth() {
      return {
        title: {
          text: `Monthly generation tracking (kwh,updated by ${this.maxMonth})`,
        },
        dataset: [{ source: this.energyMonth }],
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          splitNumber: 31,
          // boundaryGap: false,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
          interval: 3600 * 24,
          min: this.month1[0],
          max: this.month1[1],
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: [
          {
            type: "line",
            name: "Day generation",
            smooth: true,
            datasetIndex: 0,
            encode: {
              x: "today",
              y: "today_energy",
              tooltip: ["today_energy"],
            },
            symbol: "circle",
            symbolSize: 10,
          },
        ],
      };
    },
    optionYear() {
      return {
        title: {
          text: `Year generation tracking (kwh,updated by ${this.maxYear})`,
        },
        dataset: [{ source: this.energyYear }],
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: [
          {
            type: "bar",
            name: "Month generation",
            datasetIndex: 0,
            smooth: true,
            encode: {
              x: "today",
              y: "today_energy",
              tooltip: ["today_energy"],
            },
            symbol: "circle",
            symbolSize: 10,
          },
        ],
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