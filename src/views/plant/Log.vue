<template>
  <div class="report">
    <h3>Task Report</h3>
    <div class="toolbar">
      Filter:<a-select
        default-value=""
        style="width: 120px"
        v-model="search.param"
        allow-clear
        placeholder="call type"
        @change="fetchReports()"
      >
        <a-select-option value="0"> query inveter </a-select-option>
        <a-select-option value="1"> set inverter </a-select-option>
        <!-- <a-select-option value="0"> Offline </a-select-option>
        <a-select-option value="2"> Unknown </a-select-option> -->
      </a-select>
      <a-input
        v-model="search.kind"
        style="width: 150px"
        placeholder="Postcode"
        allow-clear
      /><a-button type="primary" @click="fetchReports()">Search</a-button>
    </div>
    <div>
      <a-table
        :data-source="data"
        row-key="id"
        :pagination="false"
        :loading="loading"
        @change="pageChange"
      >
        <a-table-column data-index="id" title="Log ID" />
        <a-table-column data-index="kind" title="Kind" />
        <a-table-column data-index="param" title="Param" v-if="false">
          <template slot-scope="text, record"> {{ text }} </template>
        </a-table-column>
        <a-table-column data-index="result" title="Result">
        </a-table-column>
        <a-table-column data-index="call_time" title="Call time" width="250px">
          <template slot-scope="text">{{ text | time }}</template>
        </a-table-column>
        <a-table-column data-index="updated_at" title="Update time" width="250px">
          <template slot-scope="text">{{ (text * 1000) | time }}</template>
        </a-table-column>
      </a-table>
      <a-pagination
        :total="page.total"
        :pageSizeOptions="['15', '30', '50', '70', '100']"
        :show-total="(total) => `Total ${total} reports`"
        @change="changePage"
        @showSizeChange="changePage"
        show-size-changer
        show-quick-jumper
      />
    </div>
  </div>
</template>

<script>
import { RS, allRS, time } from "@/util";
export default {
  filters: { remoteStatus: RS, time },
  data() {
    return {
      data: [],
      page: { total: 0, pageSize: 15 },
      search: {param:'1'},
      loading: false,
    };
  },
  created() {
    // console.log('rs:',allRS,RS)
    this.fetchReports({ limit: 15 });
  },
  methods: {
    changePage(page, pageSize) {
      console.log("chage page:", page, pageSize);
      this.fetchReports({ limit: pageSize || 15, page: page || 1 });
    },
    pageChange(pageination, filters, sorter) {
      const page = { page: pageination.current, limit: pageination, pageSize };
      this.fetchReports(page);
    },
    fetchReports(param = {}) {
      param = { ...param, ...this.search };
      if (!param.limit) {
        param.limit = 15;
      }
      this.loading = true;
      this.$store.dispatch("remote/syncLogs", param).then((res) => {
        this.loading = false;
        this.page = res.page;
        this.data = res.data;
      });
    },
  },
};
</script>

<style scoped>
.report {
  width: 100%;
}
</style>