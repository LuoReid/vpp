<template>
  <div>
    <div class="box">
      <a-radio-group v-model="kind">
        <a-radio-button value="p">
          Soloar PV System Control
        </a-radio-button>
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
      :step="curstep"
      @next="toNext"
      @toExecute="toExecute"
      @toFeedback="toFeedback"
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
      curcom: "RemoteArea"
    };
  },
  methods: {
    toNext(val) {
      if ((val.type = "check")) {
        this.curstep = 1;
        this.curcom = "RemoteConfirm";
      } else if (val.type == "execute") {
        this.curstep = 2;
        this.curcom = "RemoteOperation";
      } else if (val.type == "feedback") {
        this.curstep = 3;
        this.curcom = "RemoteOperation";
      } else if (val.type == "finish") {
        this.curstep = 0;
      }
    }
  }
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