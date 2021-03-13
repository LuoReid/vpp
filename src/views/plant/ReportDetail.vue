<template>
  <div class="report">
    <div class="logo"><img src="@/assets/logo.png" width="100" alt="Gosolar Logo" /></div>
    <div class="toolbar">
      <a-button @click="toDownload">Download</a-button>
      <a-button @click="toDownload1" v-if="false">Download1</a-button>
    </div>
    <h4>Task No.{{ remote.id }} Execution Report</h4>
    <a-descriptions title="Access Declaration" :column="1">
      <a-descriptions-item>
        GoSolar Group is one of the approved relevant agents. Only after the
        business partners appointed GoSolar as their relevant agent, GoSolar
        platform can gain access to perform remote control task.
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="Technology & Solutions" :column="1">
      <a-descriptions-item>
        The GoSolar Group IoT platform primarily connects and disconnects each
        power plant by remotely controlling the Growatt inverters, which has
        already pass the VDTR test and approved by Department for Energy and
        Mining.
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="Task Description" :column="1">
      <a-descriptions-item label="Operation">
        {{ remote.action }}</a-descriptions-item>
      <a-descriptions-item v-if="false" label="Export limit:">
        {{ remote.capacity }}</a-descriptions-item>
      <a-descriptions-item label="Status">
        {{ remote.status | remoteStatus }}</a-descriptions-item>
      <a-descriptions-item v-if="remote.start_time" label="Start time">
        {{ remote.start_time | atldTime1}}</a-descriptions-item>
      <a-descriptions-item v-if="remote.end_time" label="End time">
        {{ remote.end_time | atldTime1 }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="Task Scope" :column="1">
      <a-descriptions-item :label="remote.scope">
        {{ remote[remote.scope] }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions class="table" title="Executed Rresult" :column="2">
      <a-descriptions-item label="Total">
        {{ inverters.length }}</a-descriptions-item>
      <a-descriptions-item label="Success Execution">
        {{ inverters.length }}</a-descriptions-item>
      <template v-if="false">
        <a-descriptions-item label="Online">
          {{ onlineCount }}</a-descriptions-item>
        <a-descriptions-item label="Standby">
          {{ standbyCount }}</a-descriptions-item>
        <a-descriptions-item label="Abnormal">
          {{ abnormalCount }}</a-descriptions-item>
        <a-descriptions-item label="Offline">
          {{ offlineCount }}</a-descriptions-item>
      </template>
    </a-descriptions>
    <a-descriptions class="table" v-if="inverterOnline.length > 0" :title="`Success Execution(${inverterOnline.length})`" :column="1">
      <a-descriptions-item>
        <a-table :data-source="inverterOnline" row-key="id" :pagination="false" :loading="loading">
          <a-table-column data-index="id" title="#" :width="70" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
          <a-table-column data-index="control_time" title="Operation time">
            <span slot-scope="text">{{text | atldTime1 }}</span>
          </a-table-column>
          <a-table-column data-index="status_remote" title="Execute Status">
            <span slot-scope="text">{{
              text == 0 ? "Successful" : "Failed"
            }}</span>
          </a-table-column>
          <a-table-column data-index="state_remote" title="Current status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions class="table" v-if="inverterStandby.length > 0" :title="`Standby(${inverterStandby.length})`" :column="1">
      <a-descriptions-item>
        <a-table :data-source="inverterStandby" row-key="id" :pagination="false" :loading="loading">
          <a-table-column data-index="id" title="#" :width="70" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
          <a-table-column data-index="control_time" title="Operation time">
            <span slot-scope="text">{{text | atldTime1 }}</span>
          </a-table-column>
          <a-table-column data-index="status_remote" title="Execute Status">
            <span slot-scope="text">{{
              text == 0 ? "Successful" : "Failed"
            }}</span>
          </a-table-column>
          <a-table-column data-index="state_remote" title="Current status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions class="table" v-if="inverterAbnormal.length > 0" :title="`Abnormal(${inverterAbnormal.length})`" :column="1">
      <a-descriptions-item>
        <a-table :data-source="inverterAbnormal" row-key="id" :pagination="false" :loading="loading">
          <a-table-column data-index="id" title="#" :width="70" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
          <a-table-column data-index="control_time" title="Operation time">
            <span slot-scope="text">{{text | atldTime1 }}</span>
          </a-table-column>
          <a-table-column data-index="status_remote" title="Execute Status">
            <span slot-scope="text">{{
              text == 0 ? "Successful" : "Failed"
            }}</span>
          </a-table-column>
          <a-table-column data-index="state_remote" title="Current status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <!-- Gosolar#20 vppadmin Gosolar+1-->
    <a-descriptions class="table" v-if="inverterOffline.length > 0" :title="`Offline(${inverterOffline.length})`" :column="1">
      <a-descriptions-item>
        <a-table :data-source="inverterOffline" row-key="id" :pagination="false" :loading="loading">
          <a-table-column data-index="id" title="#" :width="70" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
          <a-table-column data-index="control_time" title="Operation time" width="190px">
            <span slot-scope="text">{{text | atldTime1 }}</span>
          </a-table-column>
          <a-table-column data-index="status_remote" title="Execute Status">
            <span slot-scope="text" style="white-space: nowrap;">{{
              text == 0 ? "Successful" : "Failed"
            }}</span>
          </a-table-column>
          <a-table-column data-index="state_remote" title="Current status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
import { RS, IS, time, atldTime1 } from "@/util";
export default {
  filters: {
    remoteStatus: RS,
    inverterState: IS,
    datetime: time,
    atldTime1,
  },
  props: { id: [String, Number] },
  data() {
    return {
      remote: {},
      plants: [],
      inverters: [],
      loading: false,
    };
  },
  computed: {
    offlineCount() {
      return this.inverters.filter((f) => f.state == 0).length;
    },
    onlineCount() {
      return this.inverters.filter((f) => f.state == 1).length;
    },
    standbyCount() {
      return this.inverters.filter((f) => f.state == 2).length;
    },
    abnormalCount() {
      return this.inverters.filter((f) => f.state == 3).length;
    },
    inverterOffline() {
      return this.inverters.filter((f) => f.state_remote == 0);
    },
    inverterOnline() {
      return this.inverters.filter((f) => f.state_remote == 1);
    },
    inverterStandby() {
      return this.inverters.filter((f) => f.state_remote == 2);
    },
    inverterAbnormal() {
      return this.inverters.filter((f) => f.state_remote == 3);
    },
  },
  created() {
    this.fetchRemote();
  },
  methods: {
    toDownload1() {
      window.open(
        'mailto:long.read@qq.com?subject=Task report&attachment=""&body=<img src="data:image/png;base64,　iVBORw0KGgoAAAANSUhEUgAAAAEAAAAkCAYAAABIdFAMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHhJREFUeNo8zjsOxCAMBFB/　KEAUFFR0Cbng3nQPw68ArZdAlOZppPFIBhH5EAB8b+Tlt9MYQ6i1BuqFaq1CKSVcxZ2Acs6406KUgpt5/　LCKuVgz5BDCSb13ZO99ZOdcZGvt4mJjzMVKqcha68iIePB86GAiOv8CDADlIUQBs7MD3wAAAABJRU5ErkJggg%3D%3D" width="210mm">'
      );
    },
    toDownload() {
      const today = "";
      document.title = `${today}Task No.${this.remote.id} Execution Report`;
      window.print();
    },
    fetchRemote(param = {}) {
      this.$store.dispatch("remote/reportById", this.id).then((res) => {
        this.remote = res.remote;
        this.plants = res.remote_plants;
        this.inverters = res.remote_inverters.sort((a, b) => {
          if (a.control_time < b.control_time) {
            return 1;
          } else if (a.control_time > b.control_time) {
            return -1;
          } else {
            return 0;
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.logo {
  /* width: 100px; */
}
.report {
  
  max-width: 297mm;
  margin: 10 auto;
  padding: 0 15px;
}
.report h4 {
  font-weight: 500;
  font-size: 20px;
  text-align: center;
}
.toolbar {
  display: flex;
  justify-content: flex-end;
}
</style>
<style>
@media print {
  .ant-layout-sider {
    display: none;
  }
  #components-layout-demo-custom-trigger .ant-layout-header {
    display: none;
  }

  .report .toolbar {
    display: none;
  }
  .main-content {
    margin: 0;
    padding: 0;
  }
  .main-content #oa-finish-nav {
    display: none;
  }
  .table {
    page-break-inside: avoid;
  }
}
@page {
  margin: 0;
}
</style>