<template>
  <div>
    <div class="box">
      <div class="box">
        Intructions: You can select area by State / by State / by Suburb / by
        PostCode or by Targeted asset list.
      </div>
      <div class="box">
        Select by:<a-radio-group
          v-model="areaType"
          :options="optionArea"
          button-style="solid"
        >
        </a-radio-group>
      </div>
      <div class="box" v-if="areaType == 'state'">
        State:<a-select
          v-model="search.state"
          :options="allState"
          style="width: 120px"
        >
        </a-select>
      </div>
      <div class="box" v-if="areaType == 'suburb'">
        <a-input-search
          placeholder="input search text"
          size="large"
          @search="onSearch"
          style="width:350px;"
        >
          <a-button slot="enterButton">
            <a-icon type="search" />Search
          </a-button>
        </a-input-search>
      </div>
      <div class="box" v-if="areaType == 'postcode'">
        <a-input-search
          placeholder="input search text"
          size="large"
          @search="onSearch"
          style="width:350px;"
        >
          <a-button slot="enterButton">
            <a-icon type="search" />Search
          </a-button>
        </a-input-search>
      </div>
      <div class="box" v-if="areaType == 'asset'">
        <a-input-search
          placeholder="Enter Inverter SN (separator ',' like 182kurr,iuwkd908,kdkdf21)"
          size="large"
          @search="onSearch"
          style="width:350px;"
        >
          <a-button slot="enterButton">
            <a-icon type="search" />Search
          </a-button>
        </a-input-search> <a-button @click="toUpload">Upload <a-icon type="upload" /></a-button>
      </div>
    </div>
    <div class="box">
      <p>
        Map Select: Select and add one or more Suburb you would like to check
        plants.
      </p>
      <div class="map">need to do</div>
    </div>
    <div class="box">
      <a-button type="primary" @click="$emit('next',{type:'check'})"
        >Save and Check <a-icon type="right-circle"
      /></a-button>
    </div>
  </div>
</template>

<script>
import { states } from "@/util";
export default {
  data() {
    return {
      optionArea: [
        { label: "State", value: "state" },
        { label: "Suburb", value: "suburb" },
        { label: "Postcode", value: "postcode" },
        { label: "Targeted assets", value: "asset" }
      ],
      areaType: "state",
      search: {},
      allState: states.map(m => ({ label: m, value: m })),

    };
  },
  created() {},
  methods: {
    onSearch() {},
    toUpload(){
      //todo upload Inverter SN
    }
  }
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