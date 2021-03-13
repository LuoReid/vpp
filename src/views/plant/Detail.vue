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
      <chart style="min-height:50vh;" :option="optionPower" />
    </div>
    <div>
      <chart style="min-height:50vh;" :option="optionEnergy" />
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
    };
  },
  computed: {
    todays() {
      const d = [];
      const today = new Date().toISOString().substring(0, 10);
      for (let i = 0; i < 24; i++) {
        const h = `${i}`.padStart(2, "0");
        d.push(`${today} ${h}:00:00`);
      }
      return d;
    },
    anchor() {
      const today = new Date().toISOString().substring(0, 10);
      let tom = new Date();
      tom.setDate(tom.getDate() + 1);
      const tm1 = tom.toISOString().substring(0, 10);
      return [
        { name: `${today} 00:00:00`, value: [`${today} 00:00:00`, 0] },
        { name: `${tm1} 00:00:00`, value: [`${tm1} 00:00:00`, 0] },
      ];
    },
    ds1() {
      return [...new Set((this.plant.devices || []).map((m) => m.device_sn))];
    },
    optionPower() {
      return {
        title: { text: "Today Power Tracking" },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({
          source: this.powers.filter((f) => f.device_sn == m),
        })),
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          splitNumber: 24,
          boundaryGap: false,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
          // interval:1000*3600,
          // data: this.todays,
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: this.ds1.map((m, i) => ({
          type: "line",
          smooth: true,
          name: m,
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
    optionEnergy() {
      return {
        title: { text: "Today generation tracking" },
        // color: ["#516FAD", "#29AFAF"],
        dataset: [{ source: this.energy }],
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "time",
          splitNumber: 13,
          // boundaryGap: true,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { interval: 0 },
          // data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
        },
        yAxis: {
          type: "value",
          axisTick: { show: false },
          axisLine: { show: false },
          saplitLine: { lineStyle: { color: "#E6E6E6" } },
        },
        series: this.ds1.map((m, i) => ({
          type: "bar",
          name: m,
          datasetIndex: i,
          encode: {
            x: "dayhour",
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
  },
  methods: {
    fetchPlant(param = {}) {
      this.$store.dispatch("remote/getPlant", this.id).then((res) => {
        this.plant = res.plant;
        this.powers = res.plant.powers;
        this.energy = res.plant.energy;
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