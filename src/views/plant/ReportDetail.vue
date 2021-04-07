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
      <a-descriptions-item label="Command">
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
        By {{ remote[remote.scope]||'all' }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions class="table" title="Executed Rresult" :column="2">
      <a-descriptions-item label="Total">
        {{ inverterCount }}</a-descriptions-item>
      <a-descriptions-item label="Success Execution">
        {{ successCount }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions class="table" :title="`Success Execution(${inverterSuccess.length})`" :column="1">
      <a-descriptions-item>
        <a-table :data-source="inverterSuccess" row-key="id" :pagination="false" :loading="loading" :rowClassName='rowClassName'>
          <a-table-column data-index="id" title="#" :width="70" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
          <a-table-column data-index="action" title="Command">
            <template slot-scope="text">
              <a-tag color="green" v-if="text=='on'">{{text}}</a-tag>
              <a-tag color="red" v-else>{{text}}</a-tag>
            </template>
          </a-table-column>
          <a-table-column data-index="control_time" title="Operation time">
            <span slot-scope="text">{{text | atldTime1 }}</span>
          </a-table-column>
          <a-table-column data-index="status_remote" title="Execute Status">
            <span slot-scope="text">{{
              text == 0 ? "Successful" : "Failed"
            }}</span>
          </a-table-column>
          <a-table-column data-index="state_remote" title="Current status" v-if="showCurrent">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
        </a-table>
      </a-descriptions-item>
    </a-descriptions>
    <!-- Gosolar#20 vppadmin Gosolar+1-->
    <a-descriptions class="table" :title="`Fail Execution(${inverterFail.length})`" :column="1">
      <a-descriptions-item >
        <a-table :data-source="showCurrent?inverterFail:inverterFailPrint" row-key="id" :pagination="false" :loading="loading" :rowClassName='rowClassName'>
          <a-table-column data-index="id1" title="" :width="70" />
          <a-table-column data-index="id" title="#" :width="70" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
          </a-table-column>
          <a-table-column data-index="action" title="Command">
            <template slot-scope="text">
              <a-tag color="green" v-if="text=='on'">{{text}}</a-tag>
              <a-tag color="red" v-else>{{text}}</a-tag>
            </template>
          </a-table-column>
          <a-table-column data-index="control_time" title="Operation time" width="190px">
            <span slot-scope="text">{{text | atldTime1 }}</span>
          </a-table-column>
          <a-table-column data-index="status_remote" title="Execute Status">
            <span slot-scope="text" style="white-space: nowrap;">{{
              text == 0 ? "Successful" : "Failed"
            }}</span>
          </a-table-column>
          <a-table-column data-index="state_remote" title="Current status" v-if="showCurrent">
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
      rowClassName: (record, index) => {
        // console.log("log :", record, index);
        let className = "dark-row";
        if (index % 2 === 1) className = "light-row";
        // console.log(className);
        return className;
      },
      remote: {},
      plants: [],
      inverters: [],
      loading: false,
      showCurrent: true,
    };
  },
  computed: {
    inverterCount() {
      return [...new Set(this.inverters.map((m) => m.device_sn))].length;
    },
    successCount() {
      return [
        ...new Set(
          this.inverters
            .filter((f) => f.status_remote == 0)
            .map((m) => m.device_sn)
        ),
      ].length;
    },
    standbyCount() {
      return this.inverters.filter((f) => f.state == 2).length;
    },
    abnormalCount() {
      return this.inverters.filter((f) => f.state == 3).length;
    },
    inverterSuccess() {
      return this.inverters.filter((f) => f.status_remote == 0);
    },
    successSn() {
      return this.inverters
        .filter((f) => f.status_remote == 0)
        .map((m) => `${m.device_sn}_${m.action}`);
    },
    inverterFail() {
      const data = [];
      this.inverters
        .filter(
          (f) =>
            f.status_remote != 0 &&
            !this.successSn.includes(`${f.device_sn}_${f.action}`)
        )
        .sort((a, b) => b.id - a.id)
        .forEach((e) => {
          const temp = data.find((f) => f.device_sn == e.device_sn);
          if (temp) {
            temp.children = [...(temp.children || []), e];
          } else {
            data.push({ ...e });
          }
        });
      return data;
    },
    inverterFailPrint() {
      const data = [];
      this.inverters
        .slice()
        .filter(
          (f) =>
            f.status_remote != 0 &&
            !this.successSn.includes(`${f.device_sn}_${f.action}`)
        )
        .sort((a, b) => b.id - a.id)
        .forEach((e) => {
          const temp = data.find((f) => f.device_sn == e.device_sn);
          if (!temp) {
            data.push({ ...e });
          }
        });
      console.log("inp:", data);
      return data;
    },
    inverterAbnormal() {
      return this.inverters.filter((f) => f.state_remote == 3);
    },
  },
  created() {
    this.fetchRemote();
  },
  mounted() {
    window.onafterprint = function () {
      console.log("log print after:");
      this.showCurrent = true;
    };
  },
  beforeDestroy() {
    window.onafterprint = null;
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
      this.showCurrent = false;
      this.$nextTick(() => {
        window.print();
      });
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
.ant-table-tbody .light-row {
  color: #000;
  background: white;
}

.ant-table-tbody .dark-row {
  color: #000;
  background: #e6f0fa;
}
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
  .main-content .oa-finish-nav {
    display: none;
  }
  .table {
    /* page-break-inside: avoid; */
    /* margin: 50px 0; */
    orphans: 2;
    widows: 2;
  }
  .ant-table-tbody {
    orphans: 2;
    widows: 2;
  }
  .ant-table-row {
    page-break-inside: avoid;
    orphans: 2;
    widows: 2;
  }
}
@page {
  margin: 0;
  /* padding: 50px 0; */
  /* orphans: 3;
  widows: 2; */
}
</style>