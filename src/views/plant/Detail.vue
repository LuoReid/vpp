<template>
  <div class="detail">
    <h3>Plant Detail</h3>
    <a-descriptions title="Basic information" :column="2" bordered>
      <a-descriptions-item label="Plant type">
        {{ plant.plant_type| PT}}</a-descriptions-item> 
      <a-descriptions-item label="Installation date">
        {{ plant.create_date | day }}</a-descriptions-item>
      <a-descriptions-item label="Plant Id">
        {{ plant.plant_id }}</a-descriptions-item>
      <a-descriptions-item label="System size">
        {{ plant.total_component_power }}kW</a-descriptions-item>
      <a-descriptions-item label="Postcode">
        {{ plant.postcode }}</a-descriptions-item>
      <a-descriptions-item label="Suburb">
        {{ plant.suburb }}</a-descriptions-item>
      <a-descriptions-item label="Address">
        {{ plant.address }}</a-descriptions-item>
      <a-descriptions-item label="NMI">
        {{ plant.nmi }}</a-descriptions-item>
      <a-descriptions-item label="Installer">
        {{ plant.installer }}</a-descriptions-item>
      <a-descriptions-item label="Retailer">
        {{ plant.retailer }}</a-descriptions-item>
      <a-descriptions-item label="Job-number">
        {{ plant.job_number }}</a-descriptions-item>
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
import { day, DT, PT, has, IS } from "@/util";
import Chart from "../../components/Chart.vue";
export default {
  components: { Chart },
  filters: { day, DT, PT, has, IS },
  props: { id: [String, Number] },
  data() {
    return {
      plant: {},
      powers: [],
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
    ds1() {
      return [...new Set(this.powers.map((m) => m.device_sn))];
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
          name: m,
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
    optionEnergy() {
      return {
        title: { text: "Today generation tracking", },
        color: ["#516FAD", "#29AFAF"],
        dataset: this.ds1.map((m) => ({
          source: this.genergy.filter((f) => f.device_sn == m),
        })),
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
          name: m,
          datasetIndex: i,
          encode: {
            x: "day",
            y: "energy_today",
            tooltip: ["day", "energy_today"],
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
        this.energy = res.plant.energy
      });
    },
  },
};
</script>

<style scoped>
.detail h4 {
  margin-top: 20px;
}
</style>