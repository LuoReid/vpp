<template>
  <div>
    <div class="box">
      Operation Selection:
      <a-radio-group v-model="form.action" button-style="solid">
        <a-radio-button value="on"> Switch on - Connect </a-radio-button>
        <a-radio-button value="off"> Switch off - Disconnect </a-radio-button>
        <a-radio-button value="limit"> Zero export </a-radio-button>
      </a-radio-group>
    </div>
    <div class="box" v-if="false && form.action == 'limit'">
      Export to Capacity:
      <a-input
        v-model="form.capacity"
        placeholder="Enter kWh (Max.)"
        style="width: 350px"
      />
      <p>
        Instructions: When the electricity that exports to the grid reaches the
        maximum, the plant will stop exporting.
      </p>
    </div>
    <div class="box">
      Start time:
      <a-date-picker
        v-model="form.start_time"
        :disabled-date="disabledDate"
        format="YYYY-MM-DD HH:mm:ss"
      />
    </div>
    <div class="box">
      End time:
      <a-date-picker
        v-model="form.end_time"
        :disabled-date="disabledDate"
        format="YYYY-MM-DD HH:mm:ss"
      />
    </div>
    <div class="box">
      <a-button @click="$emit('next', { step: 0 })">Back to select</a-button>
      <a-button type="primary" @click="toExcute" :loading="loading"
        >Execute <a-icon type="right-circle"
      /></a-button>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: { data: Object, plants: Array },
  data() {
    return {
      loading: false,
      form: {},
    };
  },
  methods: {
    moment,
    disabledDate(current) {
      // Can not select days before today and today
      return false;
      // return current && current < moment().endOf("timestamp");
    },
    valid() {
      const f = this.form;
      if (!f.action) {
        this.$message.error({ content: "请选择操作类型" });
        return false;
      }
      if (!f.start_time && !f.start_time) {
        this.$message.error({ content: "请选择时间" });
        return false;
      }
      return true;
    },
    toExcute() {
      if (this.valid()) {
        console.log("form:", this.plants, this.data, this.form);
        // this.$emit("next", { step: 2, obj: this.form });
        const data = {
          kind: "remote",
          ...this.data,
          ...this.form,
          data: JSON.stringify(
            this.plants.map((m) => ({
              id: m.id,
              plant_id: m.plant_id,
              user_id: m.user_id,
            }))
          ),
          kind: "remote",
        };
        data.start_time = data.start_time.format("YYYY-MM-DD HH:mm:ss");
        data.end_time = data.end_time.format("YYYY-MM-DD HH:mm:ss");
        if (!this.plants || this.plants.length < 1) {
          this.$message.error({ content: "所选电站丢失，请重新选择" });
          return;
        }
        this.$emit("next", { step: 2, remote: data });
      }
    },
  },
};
</script>

<style scoped>
.box {
  margin: 15px 0;
}
</style>