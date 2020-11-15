<template>
  <div>
    <div class="box">
      <div class="box">
        Intructions: You can select area by State / by State / by Suburb / by
        PostCode or by Targeted asset list.
      </div>
      <div class="box">
        Select by:<a-radio-group
          v-model="search.type"
          :options="optionArea"
          button-style="solid"
          @change="toClearSearch"
        >
        </a-radio-group>
      </div>
      <div class="box" v-if="search.type == 'state'">
        State:<a-select
          v-model="search.state"
          :options="allState"
          style="width: 120px"
          allow-clear
          @change="onSearch"
        >
        </a-select>
      </div>
      <div class="box" v-if="search.type == 'suburb'">
        <a-input-search
          placeholder="input search text"
          size="large"
          v-model="search.suburb"
          @search="onSearch"
          allow-clear
          style="width: 350px"
        >
          <a-button slot="enterButton">
            <a-icon type="search" />Search
          </a-button>
        </a-input-search>
      </div>
      <div class="box" v-if="search.type == 'postcode'">
        <a-input-search
          placeholder="input search text"
          size="large"
          v-model="search.postcode"
          @search="onSearch"
          allow-clear
          style="width: 350px"
        >
          <a-button slot="enterButton">
            <a-icon type="search" />Search
          </a-button>
        </a-input-search>
      </div>
      <template v-if="search.type == 'asset'">
        <div class="box">
          <a-input-search
            placeholder="Enter Inverter SN (separator ',' like 182kurr,iuwkd908,kdkdf21)"
            size="large"
            allow-clear
            v-model="search.asset"
            @search="onSearchInverter"
            style="width: 550px"
          >
            <a-button slot="enterButton" type="primary">
              <a-icon type="search" />Search
            </a-button>
          </a-input-search>
          <a-button type="" @click="toUpload"
            >Upload <a-icon type="upload"
          /></a-button>
        </div>
        <div class="box">
          <a-tag
            v-for="(t, idx) in search.inverters"
            :key="t.id"
            closable
            color="blue"
            @close="remove(idx, t)"
            >{{ t.device_sn }}</a-tag
          >
        </div>
      </template>
    </div>
    <div class="box">
      <p>Plants:{{ plants.length }}</p>
      <p>
        Map Select: Select and add one or more Suburb you would like to check
        plants.
      </p>
      <div class="map"><Map :places="plants"></Map></div>
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
  props: { plants: Array },
  components: { Map },
  data() {
    return {
      optionArea: [
        { label: "State", value: "state" },
        { label: "Suburb", value: "suburb" },
        { label: "Postcode", value: "postcode" },
        { label: "Targeted assets", value: "asset" },
      ],
      areaType: "state",
      search: { inverters: [], type: "state" },
      allState: states.map((m) => ({ label: m, value: m })),
      inverters: [],
      // plants: [],
    };
  },
  created() {},
  methods: {
    toClearSearch() {
      this.search = { type: this.search.type };
    },
    onSearch() {
      const param = {};
      if (this.search.state) {
        param.state = this.search.state;
      }
      if (this.search.suburb) {
        param.suburb = this.search.suburb;
      }
      if (this.search.postcode) {
        param.postcode = this.search.postcode;
      }
      this.$emit("toFindPlants", param);
    },
    remove(idx, t) {
      console.log("remove inverter:", idx, t);
      this.inverters.splice(idx, 1);
    },
    onSearchInverter(val) {
      //test sn: NTCKA20001,DKE0A10041,XTD7A1904F,NTCIA19047
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
      if (!s.state && !s.suburb && !s.postcode && s.inverters.length < 1) {
        this.$message.error({ content: "请选择范围" });
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
</style>