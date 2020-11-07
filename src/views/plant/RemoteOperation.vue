<template>
  <div>
    <div class="box" v-if="step === 2">
      <div class="spin-content">
        <a-spin style="margin-right:15px;"></a-spin>Processing
      </div>
    </div>
    <template v-if="step === 3">
      <div class="box">
        <a-icon type="like" style="color:green;font-size:32px;" /> All
        Successfully Done!
      </div>
      <div class="box">
        The electricity exported to the grid will decrease by 1,738 kWh during
        the implementation period as estimated.
      </div>
      <div class="box">
        <span style="margin-right:10px;"
          ><img width="20" src="../../assets/p1.png" /> Offline and
          Linked:xxx</span
        >
        <span
          ><img width="20" src="../../assets/p0.png" /> Offline and No
          linked:xxx</span
        >
      </div>
    </template>
    <div class="box">
      <div class="map">need to do</div>
    </div>
    <div class="box">
      <a-button type="primary" :disabled="step !== 3" @click="toClose"
        >Close and Back</a-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: { step: [Number] },
  data() {
    return {
      timer: null
    };
  },
  watch: {
    step: function(newVal) {
      if (newVal && newVal == 2) {
        this.timer = setTimeout(() => {
          this.$emit("toFeedback");
        });
      }
    }
  },
  created() {
    this.timer = setTimeout(() => {
      this.$emit("toFeedback");
    }, 5000);
  },
  methods: {
    toClose() {
      this.$emit("next", { type: "finish" });
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
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
</style>