<template>
  <div>
    <div class="box">
      <div class="box">
        Intructions: You can select area by State and by Suburb / by PostCode /
        by NMI or by Inverter SN.
      </div>
      <div class="box">
        Select by State:<a-select
          v-model="search.state"
          :options="allState"
          style="width: 120px"
          allow-clear
          @change="onSearch"
        >
        </a-select>
        <a-select
          v-model="search.key"
          :options="optionArea"
          style="width: 120px"
          allow-clear
        >
        </a-select>
        <a-input-search
          :placeholder="`input ${
            (optionArea.find((f) => f.value == search.key)||{}).label
          }(separated by ,)`"
          v-model="search.value"
          :disabled="search.key==''"
          @search="onSearch"
          allow-clear
          style="width: 450px"
        >
          <a-button slot="enterButton" type="primary">
            <a-icon type="search" />Search
          </a-button>
        </a-input-search>
        <a-popover trigger="hover">
          <template slot="content">
            Plase use the standard template to search plants
            <a
              href="/static/QueryPlantsTemplate.csv"
              download="QueryPlantsTemplate.csv"
              >Search template file</a
            >
          </template>
          <a-upload
            :action="findPlants"
            :headers="header"
            :data="search"
            :showUploadList="false"
            :disabled="search.key==''"
            @change="handleChange"
          >
            <a-button type="" @click="toUpload" 
              >Upload <a-icon type="upload"
            /></a-button>
          </a-upload>
        </a-popover>
      </div>
      <div class="box" v-if="false">
        <a-tag
          v-for="(t, idx) in plants"
          :key="t.id"
          closable
          color="blue"
          @close="remove(idx, t)"
          >{{ t.id }}</a-tag
        >
      </div>
    </div>
    <div class="box">
      <p>
        Search results: Total {{ all }} Inverters,{{
          onlineCnt
        }}-online,{{ offlineCnt }}-offline,{{ abnormalCnt }}-abnormal,{{ standbyCnt }}-standby
      </p>
      <p v-if="false">
        Map Select: Select and add one or more Suburb you would like to check
        plants.
      </p>
      <div class="map"><Map :places="plants" class="map-view"></Map></div>
    </div>
    <div class="box">
      <a-button type="primary" @click="saveAndCheck"
        >Save and Check <a-icon type="right-circle"
      /></a-button>
    </div>
  </div>
</template>

<script>
import { states } from "@/util";
import Map from "./Map";
export default {
  props: { plants: Array,default:[] },
  components: { Map },
  data() {
    return {
      optionArea: [
        { label: "All", value: "" },
        { label: "Suburb", value: "suburb" },
        { label: "Postcode", value: "postcode" },
        { label: "NMI", value: "nmi" },
        { label: "Inverter SN", value: "invertersn" },
      ],
      areaType: "postcode",
      search: { state: "SA", key: "postcode", kind: "get_plants" },
      findPlants: `${process.env.VUE_APP_BASE_URL}/web/plants_query`,
      header: { Authorization: localStorage.getItem("token") },
      allState: states.map((m) => ({ label: m, value: m })),
      inverters: [],
      // plants: [],
    };
  },
  computed: {
    all() {
      return this.plants.length;
    },
    onlineCnt() {
      return this.plants.filter((f) => f.state == 1).length;
    },
    offlineCnt() {
      return this.plants.filter((f) => f.state == 0).length;
    },
    abnormalCnt() {
      return this.plants.filter((f) => f.state == 3).length;
    },
    standbyCnt(){ return  this.plants.filter(f => f.state == 2).length; } 
  },
  created() {
    this.onSearch();
  },
  methods: {
    handleChange({ file, event }) {
      console.log("log change:", file, event);
      if (file.status == "done" && file.response && file.response.code == 200) {
        this.$emit("setPlants", file.response.data.map(m => ({...m,latitude: m.latitude - 0, longitude: m.longitude - 0})));
      }
    },
    onSearch() {
      this.$emit("toFindPlants", { ...this.search });
    },
    remove(idx, t) {
      console.log("remove inverter:", idx, t);
      this.inverters.splice(idx, 1);
    },
    onSearchInverter(val) {
      //test sn: NTCKA20001,DKE0A10041,XTD7A1904F,NTCIA19047
      //test suburb: Truro,Modbury,Glenelg South
      //test postcode: 5045,5074,5049
      //test nmi: 20010127568,20013482537,20011475353
      //test inverter: CHAE9143E2,JZD29390B6,NTCB91707F
      console.log("search:", val);
      this.$store
        .dispatch("remote/inverters", { kind: "inverter_sn", inverter_sn: val })
        .then((res) => {
          this.search.inverters = res.data;
        });
    },
    valid() {
      const s = this.search;
      console.log("valid:", s);
      if (!s.state || (!s.value && this.plants.length < 1)) {
        this.$message.error({ content: "Please choose area" });
        return false;
      }
      return true;
    },
    saveAndCheck() {
      if (this.valid()) {
        this.$emit("next", { step: 1, obj: this.search });
      }
    },
    toUpload() {
      //todo upload Inverter SN
    },
  },
};
</script>

<style scoped>
.box {
  margin: 15px 0;
}
.map {
  border: 1px dashed orange;
  min-height: 50vh;
}
.map-view {
  height: 80vh;
}
</style>