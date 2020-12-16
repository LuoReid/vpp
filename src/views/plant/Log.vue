<template>
  <div class="report">
    <h3>Task Report</h3>
    <div class="toolbar">
      Filter
      <a-input
        v-model="search.kind"
        style="width: 150px"
        placeholder="Postcode"
        allow-clear
      /><a-button type="primary" @click="fetchReports()">Search</a-button>
    </div>
    <a-table
      :data-source="data"
      row-key="id"
      :pagination="false"
      :loading="loading"
      @change="pageChange"
    >
      <a-table-column data-index="id" title="Log ID" />
      <a-table-column data-index="kind" title="Kind" />
      <a-table-column data-index="param" title="Param">
        <template slot-scope="text, record">  {{ text }} </template>
      </a-table-column>
      <a-table-column data-index="result" title="Result">
        <a-tag slot-scope="text, record">{{ text  }}</a-tag>
      </a-table-column>
      <a-table-column data-index="call_time" title="Call time" />
      <a-table-column data-index="updated_at" title="Update time" />
    </a-table>
    <a-pagination :total="page.total" :pageSizeOptions="['15','30','50','70','100']" :show-total="total => `Total ${total} reports`" @change="changePage"  @showSizeChange="changePage" show-size-changer show-quick-jumper />
  </div>
</template>

<script>
import { RS, allRS } from "@/util";
export default {
  filters: { remoteStatus: RS },
  data() {
    return {
      data: [],
      page: {total:0,pageSize:15},
      search: {},
      loading: false,
    };
  },
  created() {
    // console.log('rs:',allRS,RS)
    this.fetchReports({limit:15});
  },
  methods: {
    changePage(page,pageSize){
      console.log('chage page:',page,pageSize)
      this.fetchReports({limit:pageSize||15,page:page||1})
    },
    pageChange(pageination, filters, sorter) {
      const page = { page: pageination.current, limit: pageination, pageSize };
      this.fetchReports(page);
    },
    fetchReports(param = {}) {
      param = { ...param, ...this.search };
      if(!param.limit){
        param.limit = 15
      }
      this.$store.dispatch("remote/syncLogs", param).then((res) => {
        this.page = res.page;
        this.data = res.data;
      });
    },
  },
};
</script>

<style>
</style>