<template>
  <div class="report">
    <!-- <h3>Task Report</h3> -->
    <div class="toolbar">
      Filter
      <a-input v-model="search.postcode" style="width: 150px" placeholder="Postcode" allow-clear />
      <a-input v-model="search.id" style="width: 150px" placeholder="Task ID" allow-clear />
      <a-select default-value="" v-model="search.operate" placeholder="Command" style="width: 120px;" allow-clear @change="fetchReports()">
        <a-select-option value="on"> On </a-select-option>
        <a-select-option value="off">Off </a-select-option>
      </a-select>
      <a-button type="primary" @click="fetchReports()">Search</a-button>
    </div>
    <a-table :data-source="data" row-key="id" :pagination="false" :loading="loading" @change="pageChange">
      <a-table-column data-index="id" title="Task ID" />
      <a-table-column data-index="action" title="Command" />
      <a-table-column data-index="scope" title="Scope">
        <template slot-scope="text, record"> By {{ text }} </template>
      </a-table-column>
      <a-table-column data-index="status" title="Task status">
        <a-tag slot-scope="text, record">{{ text | remoteStatus }}</a-tag>
      </a-table-column>
      <a-table-column data-index="start_time" title="Start time">
        <template slot-scope="text">{{text|atldTime}}</template>
      </a-table-column>
      <a-table-column data-index="end_time" title="End time">
        <template slot-scope="text">{{text|atldTime}}</template>
      </a-table-column>
      <a-table-column data-index="created_at" title="Operate time">
        <template slot-scope="text">{{text*1000|atldTime}}</template>
      </a-table-column>
      <a-table-column data-index="action1" title="Action">
        <template slot-scope="text, record">
          <a-button type="link" @click="$router.push({name:'plantReportDetail',params:{id:record.id}})">Task report</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination :total="page.total" :pageSize.sync="page.per_page" :pageSizeOptions="['15','30','50','70','100']" :show-total="total => `Total ${total} reports`" @change="changePage" @showSizeChange="changePage" show-size-changer show-quick-jumper />
  </div>
</template>

<script>
import { RS, allRS, atldTime } from "@/util";
export default {
  filters: { remoteStatus: RS, atldTime },
  data() {
    return {
      data: [],
      page: { total: 0, per_page: 15 },
      search: {},
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
      // param = { ...param, ...this.search };
      if (!param.limit) {
        param.limit = 15;
      }
      if (this.search.postcode) {
        param.postcode = this.search.postcode;
      }
      if (this.search.id) {
        param.id = this.search.id;
      }
      if (this.search.operate) {
        param.action = this.search.operate;
      }
      this.$store.dispatch("remote/reports", param).then((res) => {
        this.page = res.page;
        this.data = res.data;
      });
    },
  },
};
</script>

<style scoped>
.report {
  padding: 0 15px;
}
</style>