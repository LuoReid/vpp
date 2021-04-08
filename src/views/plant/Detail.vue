<template>
  <div class="detail">
    <h3>{{plant.job_number}} Plant profile</h3>
    <a-descriptions title="Basic information" :column="2" bordered>
      <a-descriptions-item label="Job-number">
        {{ plant.job_number }}</a-descriptions-item>
      <a-descriptions-item label="Installation date">
        {{ plant.create_date | day }}</a-descriptions-item>
      <a-descriptions-item label="Plant type">
        {{ plant.plant_type| PT}}</a-descriptions-item>
      <a-descriptions-item label="NMI">
        {{ plant.nmi }}</a-descriptions-item>
      <a-descriptions-item label="Smart Meter">
        {{ plant.smart_meter|has }}</a-descriptions-item>
      <a-descriptions-item label="Battery">
        {{ plant.battery|has }}</a-descriptions-item>
      <a-descriptions-item label="Plant id">
        {{ plant.plant_id }}</a-descriptions-item>
      <a-descriptions-item label="System size">
        {{ plant.total_component_power }}kW</a-descriptions-item>
      <a-descriptions-item label="Installer">
        {{ plant.installer }}</a-descriptions-item>
      <a-descriptions-item label="Retailer">
        {{ plant.retailer }}</a-descriptions-item>
      <a-descriptions-item label="Suburb">
        {{ plant.suburb }}</a-descriptions-item>
      <a-descriptions-item label="Postcode">
        {{ plant.postcode }}</a-descriptions-item>
      <a-descriptions-item label="Address">
        {{ plant.address }}</a-descriptions-item>
      <a-descriptions-item label="Total Generation(kwh)">
        {{ plant.total_energy }} (Updated by {{plant.updated_at*1000|atldTime}})</a-descriptions-item>
    </a-descriptions>
    <h4>Devices</h4>
    <a-table :data-source="plant.devices" row-key="id" :pagination="false">
      <a-table-column data-index="device_sn" title="Inverter SN" />
      <a-table-column data-index="state" title="Inverter type">
        <template slot-scope="text, record">
          <a-tag :color="text == 1 ? 'green' : text == 2 ? 'orange' : 'gray'">{{ record.type|DT }}</a-tag>
        </template>
      </a-table-column>
      <a-table-column data-index="type" v-if="false" title="Type">
        <template slot-scope="text">{{text|DT}}</template>
      </a-table-column>
      <a-table-column data-index="datalogger_sn" title="Datalogger SN" />
      <a-table-column data-index="manufacturer" title="Manufacturer" />
      <a-table-column data-index="last_update_time" title="Last upate time">
        <template slot-scope="text">{{text|atldTime1}}</template>
      </a-table-column>
      <a-table-column data-index="smart_meter" title="Smart meter">
        <template slot-scope="text, record">{{ text | has }}</template>
      </a-table-column>
      <a-table-column data-index="battery" title="Battery">
        <template slot-scope="text, record">{{ text | has }}</template>
      </a-table-column>
    </a-table>
    <h4>Power Tracking</h4>
    <div>
      <div class="toolbar">
        Day
        <a-date-picker :default-value="day" @change="onChange" />
      </div>
      <div style="margin:20px">
        <chart style="min-height:50vh;max-width:100%;" :option="optionPower" />
      </div>
      <div style="margin:20px">
        <chart style="min-height:50vh;max-width:100%;" :option="optionEnergy" />
      </div>
      <div class="toolbar">
        Month
        <a-month-picker :default-value="month" @change="onChangeMonth" />
      </div>
      <div style="margin:20px">
        <chart style="min-height:50vh;max-width:100%;" :option="optionMonth" />
      </div>
      <div style="margin:20px">
        <chart style="min-height:50vh;max-width:100%;" :option="optionYear" />
      </div>
    </div>
  </div>
</template>

<script>
import { day, DT, PT, has, IS, atldTime, atldTime1 } from "@/util";
import Chart from "../../components/Chart.vue";

export default {
  components: { Chart },
  filters: { day, DT, PT, has, IS, atldTime, atldTime1 },
  props: { id: [String, Number] },
  data() {
    return {
      plant: {},
      powers: [],
      devices: [],
      energy: [],
      ds: [
        {
          name: "今日",
          type: 0,
          color: "#516FAD",
          shadowColor: "rgba(23, 100, 232, 0.24)",
        },
        {
          name: "累计",
          type: 1,
          color: "#29AFAF",
          shadowColor: "rgba(41, 175, 175, 0.29)",
        },
      ],
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
        dataset: this.devices.map((m) => ({
          source: this.powers.filter((f) => f.device_sn == m.device_sn),
        })),
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          // boundaryGap: false,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
          splitNumber: 18,
          min: `${this.day} 04:00:00`,
          max: `${this.day} 22:00:00`,
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: this.devices.map((m, i) => ({
          type: "line",
          name: `Today power(${m.device_sn})`,
          smooth: true,
          datasetIndex: i,
          encode: {
            x: "today",
            y: "power_today",
            tooltip: ["power_today"],
          },
          symbol: "circle",
          symbolSize: 10,
        })),
      };
    },
    optionEnergy() {
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
          splitNumber: 18,
          min: `${this.day} 04:00:00`,
          max: `${this.day} 22:00:00`,
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
              y: "energy_today",
              tooltip: ["energy_today"],
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
              y: "monthly_energy",
              tooltip: ["monthly_energy"],
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
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
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
              y: "yearly_energy",
              tooltip: ["yearly_energy"],
            },
            symbol: "circle",
            symbolSize: 10,
          },
        ],
      };
    },
  },
  created() {
    this.fetchPlant().then(() => {
      this.fetchPlantDay();
      this.fetchPlantMonth();
    });
  },
  methods: {
    fetchPlantDay(param = {}) {
      param.day = this.day;
      param.kind = "summary";
      param.plant_id = this.plant.plant_id;
      this.$store.dispatch("remote/getPlantPowers", param).then((res) => {
        this.powers = res.powers;
        this.energy = res.energy;
      });
    },
    fetchPlantMonth(param = {}) {
      param.month = this.month;
      param.kind = "sumamry_month";
      param.plant_id = this.plant.plant_id;
      this.$store.dispatch("remote/getPlantPowers", param).then((res) => {
        this.energyMonth = res.energy;
        this.energyYear = res.year.map((m) => ({ ...m, today: m.today + "" }));
      });
    },
    onChange(date, dateString) {
      this.day = dateString;
      this.fetchPlantDay();
      console.log("date:", date, dateString);
    },
    onChangeMonth(date, dateString) {
      this.month = dateString;
      this.fetchPlantMonth();
      console.log("date:", date, dateString);
    },
    fetchPlant(param = {}) {
      return this.$store.dispatch("remote/getPlant", this.id).then((res) => {
        this.plant = res.plant;
        // this.powers = res.plant.powers;
        // this.energy = res.plant.energy;
        this.devices = res.plant.devices;
        return;
      });
    },
  },
};
</script>

<style scoped>
.detail {
  padding: 0 15px;
}
.detail h4,
.detail h3 {
  text-align: center;
  margin-top: 20px;
}
</style>