<template>
  <div class="report">
    <h3>Task Report</h3>
    <div class="toolbar">
      Filter
      <a-input
        v-model="search.postcode"
        style="width: 150px"
        placeholder="Postcode"
        allow-clear
      /><a-button type="primary" @click="fetchReports()">Search</a-button>
    </div>
    <a-table
      :data-source="data"
      row-key="id"
      :pagination="page"
      :loading="loading"
      @change="pageChange"
    >
      <a-table-column data-index="id" title="Task ID" />
      <a-table-column data-index="action" title="Operation" />
      <a-table-column data-index="scope" title="Scope">
        <template slot-scope="text, record"> By {{ text }} </template>
      </a-table-column>
      <a-table-column data-index="status" title="Current status">
        <a-tag slot-scope="text, record">{{ text | remoteStatus }}</a-tag>
      </a-table-column>
      <a-table-column data-index="start_time" title="Start time" />
      <a-table-column data-index="end_time" title="End time" />
      <a-table-column data-index="action1" title="Action">
        <template slot-scope="text, record">
          <a-button type="link">Task report</a-button>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>

<script>
import { RS,allRS } from "@/util";
export default {
  filters: { remoteStatus: RS },
  data() {
    return {
      data: [],
      page: {},
      search: {},
      loading: false,
    };
  },
  created() {
    console.log('rs:',allRS,RS)
    this.fetchReports();
  },
  methods: {
    pageChange(pageination, filters, sorter) {
      const page = { page: pageination.current, limit: pageination, pageSize };
      this.fetchReports(page);
    },
    fetchReports(param = {}) {
      param = { ...param, ...this.search };
      this.$store.dispatch("remote/reports", param).then((res) => {
        this.page = res.page;
        this.data = res.data;
      });
    },
  },
};
</script>

<style>
</style>