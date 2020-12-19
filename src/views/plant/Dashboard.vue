<template>
  <div>
    <a-row :gutter="30" v-if="false">
      <a-col :span="14">
        <DashSummary title="Daily Overview" :data="data" />
      </a-col>
      <a-col :span="10">
        <DashSummary title="Summary" :data="data1" />
      </a-col>
    </a-row>
    <h4>Plant management</h4>
    <div class="filter">
      State:
      <a-select
        default-value=""
        v-model="search.state"
        style="width: 200px"
        allow-clear
        @change="fetchPlants()"
      >
        <a-select-option value=""> All areas </a-select-option>
        <a-select-option value="SA"> SA-South Australia </a-select-option>
        <a-select-option value="WA">WA-West Australia</a-select-option>
        <a-select-option value="VIC"> VIC-Victoria </a-select-option>
      </a-select>
      Suburb:<a-input
        style="width: 100px"
        v-model="search.suburb"
        allow-clear
        @change="fetchPlants()"
      ></a-input>
      Postcode:<a-input
        style="width: 100px"
        v-model="search.postcode"
        allow-clear
        @change="fetchPlants()"
      ></a-input>
      Plant ID:<a-input
        style="width: 100px"
        v-model="search.plant_id"
        allow-clear
        @change="fetchPlants()"
      ></a-input>
      Plants status:
      <a-select
        default-value=""
        style="width: 120px"
        v-model="search.status"
        allow-clear
        @change="fetchPlants()"
      >
        <a-select-option value=""> All Plants </a-select-option>
        <a-select-option value="1"> Online </a-select-option>
        <a-select-option value="0"> Offline </a-select-option>
        <a-select-option value="2"> Unknown </a-select-option>
      </a-select>
      Inverter SN:<a-input
        style="width: 100px"
        v-model="search.inverter_sn"
        allow-clear
        @change="fetchPlants()"
      ></a-input>
      Inverter status:
      <a-select
        default-value=""
        style="width: 120px"
        v-model="search.inverter_state"
        allow-clear
        @change="fetchPlants()"
      >
        <a-select-option value=""> All Inverter </a-select-option>
        <a-select-option value="0"> Offline </a-select-option>
        <a-select-option value="1"> Online </a-select-option>
        <a-select-option value="2"> Standby </a-select-option>
        <a-select-option value="3"> Abnormal </a-select-option>
      </a-select>
      <template v-if="false">
        Status:<a-select
          style="width: 120px"
          v-model="search.state1"
          allow-clear
          @change="fetchPlants()"
        >
          <a-select-option value=""> All Batteries </a-select-option>
          <a-select-option value="sa"> Charging </a-select-option>
          <a-select-option value="wa" disabled> Discharging </a-select-option>
          <a-select-option value="vic"> Unclear </a-select-option>
        </a-select>
      </template>
      <a-button type="link" v-if="false">More filters</a-button>
      <a-button type="primary" icon="search" @click="fetchPlants()"
        >Search</a-button
      >
      <a-button
        type="danger"
        title="Sync from Growatt"
        :loading="loading"
        @click="syncDevice()"
        >Sync</a-button
      >
    </div>
    <a-table
      :data-source="plants"
      row-key="id"
      :pagination="false"
      :loading="loading"
      @change="handleTableChange"
    >
      <a-table-column data-index="plant_type" title="Plant type">
        <template slot-scope="text">{{ text | PT }}</template>
      </a-table-column>
      <a-table-column data-index="create_date" title="Installation date">
        <template slot-scope="text, record">{{ text | day }}</template>
      </a-table-column>
      <a-table-column data-index="status" title="Plant status">
        <template slot-scope="text">
          <a-tag
            style="margin-bottom: 10px"
            :color="text == 1 ? 'green' : text == 2 ? 'orange' : 'gray'"
            >{{ text | IS }}</a-tag
          >
        </template>
      </a-table-column>
      <a-table-column data-index="plant_id" title="Plant ID" />
      <a-table-column
        data-index="total_component_power"
        title="System size(kW)"
      />
      <a-table-column data-index="postcode" title="Postcode" />
      <a-table-column data-index="suburb" title="Suburb" />
      <a-table-column data-index="address" title="Address" />
      <a-table-column data-index="inverter_sn" title="Inverter SN">
        <template slot-scope="text, record">
          <div v-for="i in record.devices" :key="i.id">
            <a-tag
              style="margin-bottom: 10px"
              :color="i.state == 1 ? 'green' : i.state == 2 ? 'orange' : 'gray'"
              >{{ i.device_sn }}</a-tag
            >{{ i.type | DT }}
          </div>
        </template>
      </a-table-column>
      <a-table-column data-index="smart_meter" title="Smart meter">
        <template slot-scope="text, record">{{ text | has }}</template>
      </a-table-column>
      <a-table-column
        data-index="total_generation"
        title="Total generation(kW/h)"
      />
      <a-table-column data-index="action" title="Operations">
        <template slot-scope="text, record">
          <a-button
            type="link"
            @click="
              $router.push({
                name: 'plantDetail',
                params: { id: record.id },
              })
            "
            >Detail</a-button
          >
        </template>
      </a-table-column>
    </a-table>
    <a-pagination
      :total="page.total"
      :pageSizeOptions="['15', '30', '50', '70', '100']"
      :show-total="(total) => `Total ${total} plants`"
      @change="changePage"
      @showSizeChange="changePage"
      show-size-changer
      show-quick-jumper
    />
  </div>
</template>

<script>
import { day, DT, PT, has, IS ,time,allIS} from "@/util";
import DashSummary from "./DashSummary";
export default {
  filters: { day, DT, PT, has, IS,time },
  components: { DashSummary },
  data() {
    return {
      plants: [],
      page: { total: 0 },
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
    };
  },
  created() {
    this.fetchPlants({ limit: 15 });
  },
  methods: {
    syncDevice() {
      this.loading = true;
      this.$store
        .dispatch("remote/syncDevice")
        .then((res) => {
          this.loading = false;
          this.$message.success({ content: res.msg });
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
      if (this.search.inverter_state) {
        param.inverter_state = this.search.inverter_state;
      }
      if (this.search.inverter_sn) {
        param.inverter_sn = this.search.inverter_sn;
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
.filter {
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.filter > * {
  margin: 0 10px;
}
</style>