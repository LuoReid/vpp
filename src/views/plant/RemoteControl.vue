<template>
  <div>
    <div class="box">
      <a-radio-group v-model="kind">
        <a-radio-button value="p"> Soloar PV System Control </a-radio-button>
        <a-radio-button value="b">
          Battery Charging / Discharging Control
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="box">
      <a-steps :current="curstep">
        <a-step title="Select area" />
        <a-step title="Confirm area" />
        <a-step title="Operation setting" />
        <a-step title="Operation feedback" />
      </a-steps>
    </div>
    <component
      :is="curcom"
      :data="form"
      :plants="plants"
      :step="curstep"
      @next="toStep"
      @toFindPlants="getPlants"
    />
  </div>
</template>

<script>
import RemoteArea from "./RemoteArea";
import RemoteConfirm from "./RemoteConfirm";
import RemoteOperation from "./RemoteOperation";
export default {
  components: { RemoteArea, RemoteConfirm, RemoteOperation },
  data() {
    return {
      kind: "p",
      curstep: 0,
      curcom: "RemoteArea",
      form: {},
      plants: [],
    };
  },
  methods: {
    getPlants(param) {
      console.log("param:", param);
      this.$store.dispatch("remote/plants", param).then((res) => {
        this.plants = res.data;
      });
    },
    toNext(val) {
      if ((val.type = "check")) {
        this.curstep = 1;
      } else if (val.type == "execute") {
        this.curstep = 2;
        this.curcom = "RemoteOperation";
      } else if (val.type == "feedback") {
        this.curstep = 3;
        this.curcom = "RemoteOperation";
      } else if (val.type == "finish") {
        this.curstep = 0;
      } else if (val.type == "back") {
        const nstep = this.curstep + val.step;
        this.curstep = this.curstep + val.step;
      }
    },
    toExcute(val) {
      this.form;
    },
    toStep({ step, obj }) {
      console.log("toStep:", step, obj);
      if (step == 0) {
        this.curcom = "RemoteArea";
        this.form = obj;
      } else if (step == 1) {
        this.form = obj;
        this.curcom = "RemoteConfirm";
      } else if (step == 2) {
        this.plants = obj.ps
        this.curcom = "RemoteOperation";
      } else if (step == 3) {
        this.curcom = "RemoteOperation";
      } else {
        this.curcom = "RemoteArea";
        step = 0;
      }
      this.curstep = step;
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