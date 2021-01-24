<template>
  <div ref="mymap" class="mymap" />
</template>
<script>
import * as echarts from "echarts";
// import { BarChart } from "echarts/components";
// import { CanvasRenderer } from "echarts/renderers";
// echarts.use([BarChart, CanvasRenderer]);
import resize from "./ChartResize";
export default {
  mixins: [resize],
  props: {
    initOption: { type: Object },
    option: { type: Object },
    events: { type: Array },
    mapData: { type: Object, default: () => ({ name: "", province: [] }) },
    province: Array,
  },
  data() {
    return {
      mychart: null,
      optionDefault: {
        visualMap: {
          show: false,
          min: 800,
          max: 50000,
          text: ["High", "Low"],
          realtime: false,
          calculable: true,
          inRange: {
            color: ["lightskyblue", "yellow", "orangered"],
          },
        },
        series: [
          {
            type: "map",
            map: "china",
            label: { show: true },
            data: [
              { name: "江西", value: 20057.34 },
              { name: "湖南", value: 15477.48 },
              { name: "湖北", value: 31686.1 },
              { name: "四川", value: 6992.6 },
              { name: "重庆", value: 44045.49 },
              { name: "宁夏", value: 40689.64 },
              { name: "云南", value: 37659.78 },
              { name: "贵州", value: 45180.97 },
              { name: "广西", value: 55204.26 },
              { name: "广东", value: 21900.9 },
              { name: "福建", value: 4918.26 },
              { name: "浙江", value: 5881.84 },
              { name: "江苏", value: 4178.01 },
              { name: "上海", value: 2227.92 },
              { name: "山东", value: 2180.98 },
              { name: "河北", value: 9172.94 },
              { name: "北京", value: 3368 },
              { name: "天津", value: 806.98 },
            ],
          },
        ],
      },
    };
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
        // console.log("watch option:", this.mychart, newVal, oldVal);
        if (this.mychart && newVal) {
          this.mychart.setOption(newVal, true);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.mymap);
    // this.showEcharts();
    // this.registerMap(this.map);
    if (this.mychart) {
      const initOption = Object.assign(
        this.optionDefault,
        this.initOption,
        this.option
      );
      this.mychart.setOption(initOption);
      if (this.events) {
        this.events.forEach((e) => {
          // console.log("demo events:", e);
          if (e.query) {
            this.mychart.on(e.event, e.query, (params) => {
              // this.$emit(e.event || "click", params, e.query);
              // console.log("demo:", e, params);
              e.fn && e.fn(params, e);
            });
          } else {
            this.mychart.on(e.event, (params) => {
              e.fn && e.fn(params, e);
            });
          }
        });
      }
      this.mychart.on("finished", (e) => {
        const series = this.mychart.getOption().series[0];
        if (series && series.name === "projectDetail" && series.data) {
          const data = series.data;
          (data || []).forEach((ei) => {
            if (ei.highlight) {
              this.chartAction(this.mychart, "highlight", {
                seriesName: series.name,
                name: ei.name,
              });
            }
          });
        }
      });
      window.onresize = () => {
        if (this.mychart) {
          this.mychart.resize();
        }
      };
    }
  },
  beforeDestroy() {
    // window.onresize = null;
    if (this.mychart) {
      this.mychart.dispose();
      this.mychart = null;
    }
  },
  methods: {
    registerMap(mapname, data = []) {
      if (mapname && mapname != "china") {
        const pro = map.province || [];
        const features = china.features.filter(
          (f) => pro.includes(f.id) || pro.lenght == 0
        );
        const data = {
          UTF8Encoding: false,
          type: "FeatureCollection",
          features: features,
        };
        console.log("supplier data:", data);
        echarts.registerMap(map.name, data);
      }
      this.mychart = echarts.init(this.$refs.mymap);
    },
    showEcharts() {
      // const anhui = require("echarts/map/json/province/anhui.json");
      // console.log("map json:", anhui, china);
    },
    chartAction(instance, type, option) {
      instance.dispatchAction({ type: type, ...option });
    },
  },
};
</script>
<style  scoped>
.mymap {
  min-width: 375px;
  width: 100%;
  min-height: 200px;
  height: 100%;
}
</style>
