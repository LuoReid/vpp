<template>
  <div class="map">
    <h4>Plant map</h4>
    <div class="box">
      Select by State:<a-select
        v-model="search.state"
        :options="allState"
        style="width: 120px"
        allow-clear
        @change="getPlants"
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
          optionArea.find((f) => f.value == search.key).label
        }(separated by ,)`"
        v-model="search.value"
        @search="getPlants()"
        allow-clear
        style="width: 450px"
      >
        <a-button slot="enterButton" type="primary">
          <a-icon type="search" />Search
        </a-button>
      </a-input-search>
    </div>
    <div class="box" style="margin-top:20px;">
      <p>
        Search results: Total {{ all }} Inverters,{{ onlineCnt }}-online,{{
          offlineCnt
        }}-offline,{{ abnormalCnt }}-abnormal
      </p>
      <p v-if="false">
        Map Select: Select and add one or more Suburb you would like to check
        plants.
      </p>
      <div><Map :places="plants" class="map-view"></Map></div>
    </div>
  </div>
</template>

<script>
import Map from "./Map";
import { states } from "@/util";
export default {
  components: { Map },
  data() {
    return {
      optionArea: [
        { label: "Suburb", value: "suburb" },
        { label: "Postcode", value: "postcode" },
        { label: "NMI", value: "nmi" },
        { label: "Inverter SN", value: "invertersn" },
      ],
      plants: [],
      allState: states.map((m) => ({ label: m, value: m })),
      search: { state: "SA", key: "postcode", kind: "get_plants" },
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
      return this.plants.filter((f) => f.state == 0).length;;
    },
    abnormalCnt() {
      return this.plants.filter((f) => f.state == 2).length;;
    },
  },
  created() {
    this.getPlants();
  },
  methods: {
    getPlants(param = {}) {
      param = { ...this.search,kind:'map' };
      console.log("param:", param);
      this.$store.dispatch("remote/inverters", param).then((res) => {
        this.plants = res.data.map((m) => {
          const { latitude, longitude } = m;
          return { ...m, latitude: latitude - 0, longitude: longitude - 0 };
        });
      });
    },
  },
};
</script>

<style scoped>
.map-view {
  height: 80vh;
}
</style>