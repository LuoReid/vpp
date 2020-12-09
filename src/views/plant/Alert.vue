<template>
  <div class="alet">
    <h4>Alert inverters</h4>
    <div class="filter">
      Filter Satate:
      <a-select
        default-value=""
        v-model="search.state"
        style="width: 120px"
        allow-clear
        @change="fetchPlants()"
      >
        <a-select-option value=""> All states </a-select-option>
        <a-select-option value="0"> Offline </a-select-option>
        <a-select-option value="1">Online</a-select-option>
        <a-select-option value="2"> Abnormaly </a-select-option>
      </a-select>
      PlantId:<a-input
        style="width: 100px"
        v-model="search.plant_id"
        allow-clear
        @change="fetchPlants()"
      ></a-input>
      <a-button type="link" v-if="false">More filters</a-button>
      <a-button type="primary" icon="search" @click="fetchPlants()"
        >Search</a-button
      >
    </div>
    <a-table
      :data-source="plants"
      row-key="id"
      :pagination="page"
      :loading="loading"
      @change="handleTableChange"
    >
      <a-table-column data-index="plant_id" title="Plant ID" />
      <a-table-column data-index="state" title="Device SN">
        <template slot-scope="text, record">
          <a-tag 
            :color="text == 1 ? 'green' : text == 2 ? 'orange' : 'gray'"
            >{{ record.device_sn }}</a-tag
          >
        </template>
      </a-table-column>
      <a-table-column data-index="type" title="Type" >
        <template slot-scope="text">{{text|DT}}</template>
      </a-table-column>
      <a-table-column data-index="manufacturer" title="Manufacturer" />
      <a-table-column data-index="last_update_time" title="Last upate time">
      </a-table-column>
    </a-table>
  </div>
</template>

<script>
import { time,DT } from "@/util";
export default {
  filters: { time ,DT},
  data() {
    return {
      plants: [],
      page: {},
      loading: false,
      search: {},
    };
  },
  created() {
    this.fetchPlants();
  },

  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log("change:", pagination, filters, sorter);
      const pager = { page: pagination.current, limit: pagination.pageSize };
      // pager.current = pagination.current;
      this.pagination = pager;
      this.fetchPlants(pager);
      // this.fetch({
      //   results: pagination.pageSize,
      //   page: pagination.current,
      //   sortField: sorter.field,
      //   sortOrder: sorter.order,
      //   ...filters,
      // });
    },
    fetchPlants(param = {}) {
      param.kind = "page";
      this.loading = true;
      if (this.search.state) {
        param.state = this.search.state;
      }
      if (this.search.status) {
        param.status = this.search.status;
      }
      if (this.search.suburb) {
        param.suburb = this.search.suburb;
      }
      if (this.search.postcode) {
        param.postcode = this.search.postcode;
      }
      if (this.search.plant_id) {
        param.plant_id = this.search.plant_id;
      }
      this.$store.dispatch("remote/inverterAlert", param).then((res) => {
        this.loading = false;
        this.plants = res.data;
        this.page = res.page;
      });
    },
  },
};
</script>

<style scoped>
.filter{
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.filter > *{
  margin: 0 10px;
}
</style>