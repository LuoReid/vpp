<template>
  <div class="dashboard">
    <a-row :gutter="30" v-if="false">
      <a-col :span="14">
        <DashSummary title="Daily Overview" :data="data" />
      </a-col>
      <a-col :span="10">
        <DashSummary title="Summary" :data="data1" />
      </a-col>
    </a-row>
    <h4 v-if="false">Plant management</h4>
    <span class="upload">
      <a-button type="danger" title="Sync from Growatt" :loading="loading" @click="syncDevice()">Sync</a-button>
      <a-popover trigger="hover">
        <template slot="content">
          Plase use the standard template to add plants
          <a href="/AddPlantTemplate.csv" download="AddPlantTemplate.csv">Add plant template file</a>
        </template>
        <a-upload :action="plantAdd" :loading="loading" :headers="header" :data="plant" :showUploadList="false" @change="handleChange">
          <a-button :loading="loading" type="">Upload
            <a-icon type="upload" />
          </a-button>
        </a-upload>
      </a-popover>
    </span>
    <div class="filter">
      <a-select default-value="" v-model="search.state" placeholder="State" style="width: 120px;" allow-clear @change="fetchPlants()">
        <a-select-option value=""> All areas </a-select-option>
        <a-select-option value="SA"> SA-South Australia </a-select-option>
        <a-select-option value="WA">WA-West Australia</a-select-option>
        <a-select-option value="VIC"> VIC-Victoria </a-select-option>
      </a-select>
      <a-input style="width: 100px" placeholder="Suburb" v-model="search.suburb" allow-clear @pressEnter="fetchPlants()"></a-input>
      <a-input style="width: 100px" placeholder="Postcode" v-model="search.postcode" allow-clear @pressEnter="fetchPlants()"></a-input>
      <a-input style="width: 100px" placeholder="Plant ID" v-model="search.plant_id" allow-clear @pressEnter="fetchPlants()"></a-input>
      <a-select default-value="" placeholder="Plant type" style="width: 100px;" v-model="search.plant_type" allow-clear @change="fetchPlants()">
        <a-select-option value=""> All </a-select-option>
        <a-select-option value="S"> Solar only </a-select-option>
        <a-select-option value="SB"> Solar+Battery </a-select-option>
      </a-select>
      <a-input style="width: 100px" placeholder="Inverter SN" v-model="search.inverter_sn" allow-clear @pressEnter="fetchPlants()"></a-input>
      <a-select default-value="" placeholder="Inverter status" style="width: 100px;" v-model="search.inverter_state" allow-clear @change="fetchPlants()">
        <a-select-option value=""> All Inverter </a-select-option>
        <a-select-option value="0"> Offline </a-select-option>
        <a-select-option value="1"> Online </a-select-option>
        <a-select-option value="2"> Standby </a-select-option>
        <a-select-option value="3"> Abnormal </a-select-option>
      </a-select>
      <a-input style="width: 120px" placeholder="Job-number" v-model="search.job_number" allow-clear @pressEnter="fetchPlants()"></a-input>
      <template>
        <a-select style="width: 100px" placeholder="Retailer" v-model="search.retailer" allow-clear @change="fetchPlants()">
          <a-select-option value=""> All Retailer </a-select-option>
          <a-select-option v-for="r in retailers" :value="r" :key="r"> {{r}} </a-select-option>
        </a-select>
      </template>
      <a-button type="link" v-if="false">More filters</a-button>
      <a-button type="primary" icon="search" @click="fetchPlants()">Search</a-button>

    </div>
    <a-table :data-source="plants" row-key="id" :pagination="false" :loading="loading" @change="handleTableChange">
      <a-table-column data-index="plant_type" title="Plant type">
        <template slot-scope="text">{{ text | PT }}</template>
      </a-table-column>
      <a-table-column data-index="create_date" title="Installation date">
        <template slot-scope="text, record">{{ text | day }}</template>
      </a-table-column>
      <a-table-column data-index="plant_id" title="Plant ID" />
      <a-table-column data-index="total_component_power" title="System size(kW)" />
      <a-table-column data-index="postcode" title="Postcode" />
      <a-table-column data-index="suburb" title="Suburb" />
      <a-table-column data-index="address" title="Address" v-if="false" />
      <a-table-column data-index="inverter_sn" title="Inverter SN">
        <template slot-scope="text, record">
          <div v-for="i in record.devices" :key="i.id" style="min-width:150px;">
            <a-tag style="margin-bottom: 10px" :color="i.state | ISColor">{{
              i.device_sn
            }}</a-tag>{{ i.type | DT }}
          </div>
        </template>
      </a-table-column>
      <a-table-column data-index="smart_meter" title="Smart meter">
        <template slot-scope="text, record">{{ text | has }}</template>
      </a-table-column>
      <a-table-column data-index="battery" title="Battery">
        <template slot-scope="text, record">{{ text | has }}</template>
      </a-table-column>
      <a-table-column data-index="total_energy" title="Total generation(kWh)" />
      <a-table-column data-index="job_number" title="Job-number" />
      <a-table-column data-index="retailer" title="Retailer" />
      <a-table-column data-index="action" title="Operations">
        <template slot-scope="text, record">
          <router-link target="_blank" :to="{
                name: 'plantDetail',
                params: { id: record.id },
              }">Profile</router-link>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination :total="page.total" :pageSize.sync="page.per_page" :pageSizeOptions="['15', '30', '50', '70', '100']" :show-total="(total) => `Total ${total} plants`" @change="changePage" @showSizeChange="changePage" show-size-changer show-quick-jumper />
  </div>
</template>

<script>
import { day, DT, PT, has, IS, time, allIS, ISColor } from "@/util";
import DashSummary from "./DashSummary";
import { mapGetters } from "vuex";
export default {
  filters: { day, DT, PT, has, IS, time, ISColor },
  components: { DashSummary },
  data() {
    return {
      plants: [],
      page: { total: 0, per_page: 15 },
      loading: false,
      search: {},
      data: [
        { text: "PV production", value: 359, unit: "MW" },
        { text: "Export to grid", value: 5.3, unit: "MW" },
        { text: "Import from grid", value: 139.3, unit: "MW" },
        { text: "Available Battery Capacity", value: 985, unit: "KW" },
      ],
      data1: [
        { text: "Gross genestion", value: 5.12, unit: "GWh" },
        { text: "Total component power", value: 27734, unit: "kWh" },
        { text: "Total revenue(estimated)", value: 273832.39, unit: "$" },
      ],
      plantAdd: `${process.env.VUE_APP_BASE_URL}/web/plants`,
      header: { Authorization: localStorage.getItem("token") },
      plant: {},
    };
  },
  computed: {
    ...mapGetters("remote", ["retailers"]),
  },
  created() {
    this.$store.dispatch("remote/getPlantRetailers");
    this.fetchPlants({ limit: 15 });
    console.log("rea:", this.retailers);
  },
  methods: {
    handleChange({ file, event }) {
      const res = file && file.response;
      if (res && res.code == 200) {
        // console.log("log change:", res, file, event);
        this.$message.success(res.msg);
        this.loading = false;
      } else {
        this.loading = true;
      }
    },
    syncDevice() {
      this.loading = true;
      this.$store
        .dispatch("remote/syncDevice")
        .then((res) => {
          this.loading = false;
          this.$message.success(res.msg);
          console.log("res:", res);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    changePage(page, pageSize) {
      console.log("chage page:", page, pageSize);
      this.fetchPlants({ limit: pageSize || 15, page: page || 1 });
    },
    handleTableChange(pagination, filters, sorter) {
      // console.log('change:',pagination,filters,sorter);
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
      if (!param.limit) {
        param.limit = 15;
      }
      if (this.search.state) {
        param.state = this.search.state;
      }
      if (this.search.plant_type) {
        param.plant_type = this.search.plant_type;
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
      if (this.search.inverter_state) {
        param.inverter_state = this.search.inverter_state;
      }
      if (this.search.inverter_sn) {
        param.inverter_sn = this.search.inverter_sn;
      }
      if (this.search.job_number) {
        param.job_number = this.search.job_number;
      }
      if (this.search.retailer) {
        param.retailer = this.search.retailer;
      }
      this.$store.dispatch("remote/plants", param).then((res) => {
        this.loading = false;
        this.plants = res.data;
        this.page = res.page;
      });
    },
  },
};
</script>

<style scoped>
.dashboard {
  position: relative;
  padding: 0 15px;
}
.upload{
  position: absolute;
  z-index: 1;
  top: -50px;
  right: 0;
}
.filter {
  margin: 10px 0;
  /* padding: 0 10px; */
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-wrap: wrap;
}
.filter > * {
  margin: 0 10px 10px 0;
}
</style>