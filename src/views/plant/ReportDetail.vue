<template>
  <div class="report">
    <div class="logo"><img src="@/assets/logo.png" width="100" alt="Gosolar Logo" /></div>
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
        {{ remote.action }}</a-descriptions-item
      >
      <a-descriptions-item v-if="false" label="Export limit:">
        {{ remote.capacity }}</a-descriptions-item
      >
      <a-descriptions-item label="Status">
        {{ remote.status | remoteStatus }}</a-descriptions-item
      >
      <a-descriptions-item v-if="remote.start_time" label="Start time">
        {{ remote.start_time }}</a-descriptions-item
      >
      <a-descriptions-item  v-if="remote.end_time" label="End time">
        {{ remote.end_time }}</a-descriptions-item
      >
    </a-descriptions>
    <a-descriptions title="Task Scope" :column="1">
      <a-descriptions-item :label="remote.scope">
        {{ remote[remote.scope] }}</a-descriptions-item
      >
    </a-descriptions>
    <a-descriptions title="Executed Rresult" :column="2">
      <a-descriptions-item label="Total">
        {{ inverters.length }}</a-descriptions-item
      >
      <a-descriptions-item label="Success Execution">
        {{ inverters.length }}</a-descriptions-item
      >
      <a-descriptions-item label="Online">
        {{ onlineCount }}</a-descriptions-item
      >
      <a-descriptions-item label="Anomaly">
        {{ abnormalCount }}</a-descriptions-item
      >
      <a-descriptions-item label="Offline">
        {{ offlineCount }}</a-descriptions-item
      >
    </a-descriptions>
    <a-descriptions
      :title="`Success Execution(${inverterOnline.length})`"
      :column="1"
    >
      <a-descriptions-item>
        <a-table
          :data-source="inverterOnline"
          row-key="id"
          :pagination="false"
          :loading="loading"
        >
          <a-table-column data-index="id" title="#" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
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
    <a-descriptions :title="`Anomaly(${inverterAnomaly.length})`" :column="1">
      <a-descriptions-item>
        <a-table
          :data-source="inverterAnomaly"
          row-key="id"
          :pagination="false"
          :loading="loading"
        >
          <a-table-column data-index="id" title="#" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
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
    <a-descriptions :title="`Offline(${inverterOffline.length})`" :column="1">
      <a-descriptions-item>
        <a-table
          :data-source="inverterOffline"
          row-key="id"
          :pagination="false"
          :loading="loading"
        >
          <a-table-column data-index="id" title="#" />
          <a-table-column data-index="location" title="Location" />
          <a-table-column data-index="device_sn" title="Inverter SN" />
          <a-table-column data-index="state" title="Pre-status">
            <span slot-scope="text">{{text | inverterState }}</span>
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
  </div>
</template>
<script>
import { RS,IS } from "@/util";
export default {
  filters: {
    remoteStatus: RS, inverterState:IS
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
    onlineCount() {
      return this.inverters.filter((f) => f.state == 1).length;
    },
    offlineCount() {
      return this.inverters.filter((f) => f.state == 0).length;
    },
    abnormalCount() {
      return this.inverters.filter((f) => f.state == 2).length;
    },
    inverterOnline() {
      return this.inverters.filter((f) => f.state == 1);
    },
    inverterAnomaly() {
      return this.inverters.filter((f) => f.state == 0);
    },
    inverterOffline() {
      return this.inverters.filter((f) => f.state == 2);
    },
  },
  created() {
    this.fetchRemote();
  },
  methods: {
    fetchRemote(param = {}) {
      this.$store.dispatch("remote/reportById", this.id).then((res) => {
        this.remote = res.remote;
        this.plants = res.remote_plants;
        this.inverters = res.remote_inverters;
      });
    },
  },
};
</script>

<style scoped>
.logo {
  /* width: 100px; */
}
.report{
  max-width: 297mm;
  margin: 10 auto;
}
.report h4 {
  font-weight: 500;
  font-size: 32px;
  text-align: center;
}
</style>