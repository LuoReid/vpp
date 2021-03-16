<template>
  <div class="alet">
    <!-- <h4>Alert inverters</h4> -->
    <div class="filter">
      <a-select default-value="" placeholder="State" v-model="search.state" style="width: 120px" allow-clear @change="fetchPlants()">
        <a-select-option value=""> All states </a-select-option>
        <a-select-option value="0"> Offline </a-select-option>
        <a-select-option value="1">Online</a-select-option>
        <a-select-option value="2"> Standby </a-select-option>
        <a-select-option value="3"> Abnormal </a-select-option>
      </a-select>
      <a-input style="width: 100px" placeholder="PlantId" v-model="search.plant_id" allow-clear @change="fetchPlants()"></a-input>
      <a-input style="width: 120px" placeholder="Job-number" v-model="search.job_number" allow-clear @pressEnter="fetchPlants()"></a-input>
      <a-select style="width: 100px" placeholder="Retailer" v-model="search.retailer" allow-clear @change="fetchPlants()">
        <a-select-option value=""> All Retailer </a-select-option>
        <a-select-option v-for="r in retailers" :value="r" :key="r"> {{r}} </a-select-option>
      </a-select>
      <a-button type="link" v-if="false">More filters</a-button>
      <a-button type="primary" icon="search" @click="fetchPlants()">Search</a-button>
      <a-button @click="exportInverters()">Export</a-button>
    </div>
    <a-table :data-source="plants" row-key="id" :pagination="false" :loading="loading" @change="handleTableChange">
      <a-table-column data-index="plant.job_number" title="Job-number" />
      <a-table-column data-index="plant_id" title="Plant ID" />
      <a-table-column data-index="state" title="Device SN">
        <template slot-scope="text, record">
          <a-tag :color="text|ISColor">{{ record.device_sn }}</a-tag>
        </template>
      </a-table-column>
      <a-table-column data-index="type" title="Type">
        <template slot-scope="text">{{text|DT}}</template>
      </a-table-column>
      <a-table-column data-index="manufacturer" title="Manufacturer" />
      <a-table-column data-index="plant.create_date" title="Installation date">
        <template slot-scope="text, record">{{ text | day }}</template>
      </a-table-column>
      <a-table-column data-index="last_update_time" title="Last upate time"> <template slot-scope="text">{{text|atldTime1}}</template>
      </a-table-column>
      <a-table-column data-index="plant.retailer" title="Retailer" />
    </a-table>
    <a-pagination :total="page.total" :pageSize.sync="page.per_page" :pageSizeOptions="['15','30','50','70','100']" :show-total="total => `Total ${total} inverters`" @change="changePage" @showSizeChange="changePage" show-size-changer show-quick-jumper />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { time, DT, ISColor, day, downloadExcel, atldTime1 } from "@/util";
export default {
  filters: { time, DT, ISColor, day, atldTime1 },
  data() {
    return {
      plants: [],
      page: { total: 0, per_page: 15 },
      loading: false,
      search: {},
    };
  },
  created() {
    this.fetchPlants({ limit: 15 });
    this.$store.dispatch("remote/getPlantRetailers");
  },
  computed: {
    ...mapGetters("remote", ["retailers"]),
  },
  methods: {
    exportInverters(param = {}) {
      param.kind = "export";
      this.loading = true;
      this.$store.dispatch("remote/inverterAlert", param).then((res) => {
        this.loading = false;
        const temp = {
          job_number: "Job-number",
          plant_id: "Plant ID",
          device_sn: "Device SN",
          type: "Type",
          manufacturer: "Manufacturer",
          create_date: "Installation date",
          last_update_time: "Last upate time",
          retailer: "Retailer",
        };
        const data = res.data.map((m) => ({
          ...m,
          job_number: m.plant.job_number,
          create_date: day(m.plant.create_date),
          retailer: m.plant.retailer,
          type: DT(m.type),
        }));
        const title = `GoSolarVPP-AlertInverters`;
        downloadExcel({ temp, title, data });
      });
    },
    changePage(page, pageSize) {
      console.log("chage page:", page, pageSize);
      this.fetchPlants({ limit: pageSize || 15, page: page || 1 });
    },
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
      param.kind = "alert";
      this.loading = true;
      if (!param.limit) {
        param.limit = 15;
      }
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
      if (this.search.job_number) {
        param.job_number = this.search.job_number;
      }
      if (this.search.retailer) {
        param.retailer = this.search.retailer;
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
.alet {
  padding: 0 15px;
}
.filter {
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.filter > * {
  margin: 0 10px 10px 0;
}
</style>