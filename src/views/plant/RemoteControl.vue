<template>
  <div>
    <div class="box">
      <a-radio-group v-model="kind" button-style="solid">
        <a-radio-button value="p"> Soloar PV System Control </a-radio-button>
        <a-radio-button value="b">
          Battery Charging / Discharging Control
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="box">
      <a-steps :current="step">
        <a-step title="Select area" />
        <a-step title="Confirm area" />
        <a-step title="Operation setting" />
        <a-step title="Operation feedback" />
      </a-steps>
    </div>
    <div class="box" v-if="step == 0">
      <RemoteArea
        :data="form"
        :plants="plants"
        @next="toStep"
        @toFindPlants="getPlants"
        @setPlants="setPlants"
      />
    </div>
    <div class="box" v-if="step == 1">
      <RemoteConfirm
        :data="form"
        :plants="plants"
        @next="toStep"
        @toFindPlants="getPlants"
        @setPlants="setPlants"
      />
    </div>
    <div class="box" v-if="step == 2">
      <RemoteOperation
        :data="form"
        :plants="plants"
        @next="toStep"
        @toFindPlants="getPlants"
        @setPlants="setPlants"
      />
    </div>
    <div class="box" v-if="step == 3">
      <RemoteSummary
        :data="form"
        :plants="plants"
        @next="toStep"
        @toFindPlants="getPlants"
        @setPlants="setPlants"
        :remote="remote"
        :remotePlants="remotePlants"
        :remoteInverters="remoteInverters"
      />
    </div>
  </div>
</template>
<script>
import RemoteArea from "./RemoteArea";
import RemoteConfirm from "./RemoteConfirm";
import RemoteOperation from "./RemoteOperation";
import RemoteSummary from "./RemoteSummary";
export default {
  components: { RemoteArea, RemoteConfirm, RemoteOperation, RemoteSummary },
  data() {
    return {
      // kind: "p",
      curstep: 0,
      curcom: "RemoteArea",
      form: {},
      plants: [],
      remote: {},
      remotePlants: [],
      remoteInverters: [],
    };
  },
  computed: {
    step() {
      return this.$route.query.step-0 || 0;
    },
    kind: {
      get() {
        return this.$route.query.kind || "p";
      },
      set(v) {
        this.$router.replace({
          name: this.$route.name,
          query: { ...this.$route.query, kind: v },
        });
      },
    },
  },
  methods: {
    setPlants(d) {
      console.log("plants:", d);
      this.plants = d;
    },
    getPlants(param) {
      console.log("param:", param);
      this.$store.dispatch("remote/plants", param).then((res) => {
        this.plants = res.data;
      });
    },
    toExcute(remote) {
      this.loading = true;
      this.$store.dispatch("remote/control", remote).then((res) => {
        this.loading = false;
        if (res.code == 200) {
          this.$message.success({ content: res.msg });
          this.remote = res.remote;
          this.remotePlants = res.remote_plants;
          this.remoteInverters = res.remote_inverters;
          this.toStep({
            step: 3,
            obj: { ...this.form, ps: res.data },
          });
        } else {
          this.toStep({ step: 1 });
        }
      });
    },
    toStep({ step, obj, remote }) {
      console.log("toStep:", step, obj);
      if (step == 0) {
        this.curcom = "RemoteArea";
        this.form = obj;
      } else if (step == 1) {
        this.form = { ...this.form, ...obj };
        this.curcom = "RemoteConfirm";
      } else if (step == 2) {
        // this.plants = obj.ps;
        this.toExcute(remote);
        this.curcom = "RemoteOperation";
      } else if (step == 3) {
        this.curcom = "RemoteSummary";
      } else {
        this.curcom = "RemoteArea";
        step = 0;
      }
      // this.curstep = step;
      this.$router.replace({
        name: this.$route.name,
        query: { ...this.$route.query, step },
      });
    },
  },
};
</script>

<style scoped>
.box {
  margin: 15px 0;
}
.map {
  border: 1px dashed orange;
  min-height: 50vh;
}
</style>