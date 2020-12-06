<template>
  <div class="task">
    <h4>
      Task Summary <span class="task-no">Task No.{{ remote.id }}</span>
    </h4>

    <a-descriptions title="Task Information" :column="2">
      <a-descriptions-item label="Opearation">
        {{ remote.action }}
      </a-descriptions-item>
      <a-descriptions-item label="Status">
        {{ remote.state }}
      </a-descriptions-item>
      <a-descriptions-item label="StartTime">
        {{ remote.start_time }}
      </a-descriptions-item>
      <a-descriptions-item label="EndTime">
        {{ remote.end_time }}
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions title="Task Scope" :column="2">
      <a-descriptions-item label="State">
        {{ remote.state }}
      </a-descriptions-item>
      <a-descriptions-item label="Postcode">
        {{ remote.postcode }}
      </a-descriptions-item>
      <a-descriptions-item label="Suburb">
        {{ remote.suburb }}
      </a-descriptions-item>
      <a-descriptions-item label="NMI">
        {{ remote.nmi }}
      </a-descriptions-item>
      <a-descriptions-item label="Inverter SN">
        {{ remote.invertersn }}
      </a-descriptions-item>
      <a-descriptions-item label="Total plants" span="2">
        {{ remoteInverters.length }} inverters,{{ onlineCount }} of plants are online,
        {{ offlineCount }} of plants are offline.
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="Notes" :column="1">
      <a-descriptions-item>
        After execution, the system will usually generate the complete report
        within 30 minutes. You can search the [Task No.] to download the
        complete report under[Report]Tab.
      </a-descriptions-item>
      <a-descriptions-item>
        Go to <router-link :to="{ name: 'plantReport' }">Report >></router-link>
      </a-descriptions-item>
    </a-descriptions>
    <div class="box">
      <a-button type="primary" @click="toClose">Close and Back</a-button>
    </div>
  </div>
</template>

<script>
export default {
  props: { remote: Object, remotePlants: Array, remoteInverters: Array },
  computed: {
    onlineCount() {
      return this.remoteInverters.filter((f) => f.state == 1).length;
    },
    offlineCount() {
      return this.remoteInverters.filter((f) => f.status == 0).length;
    },
  },
  methods: {
    toClose() {
      this.$emit("next", { step: 0 });
    },
  },
};
</script>

<style scoped>
.task {
  margin: 30px 0;
}
.task h4 {
  text-align: center;
  position: relative;
  font-weight: 500;
  font-size: larger;
}
.task-no {
  position: absolute;
  left: 0;
  top: 0;
  font-weight: normal;
  font-size: smaller;
}
</style>