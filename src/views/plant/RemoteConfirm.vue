<template>
  <div>
    <div class="box">
      Operation Selection:
      <a-radio-group v-model="form.action" button-style="solid">
        <a-radio-button value="on"> Switch on - Connect </a-radio-button>
        <a-radio-button value="off"> Switch off - Disconnect </a-radio-button>
        <a-radio-button value="limit" v-if="false">
          Zero export
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="box" v-if="false && form.action == 'limit'">
      Export to Capacity:
      <a-input v-model="form.capacity" placeholder="Enter kWh (Max.)" style="width: 350px" />
      <p>
        Instructions: When the electricity that exports to the grid reaches the
        maximum, the plant will stop exporting.
      </p>
    </div>
    <div class="box">
      Start time:
      <a-date-picker v-model="form.start_time" showTime :disabled-date="disabledDate" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
    </div>
    <div class="box">
      End time:
      <a-date-picker v-model="form.end_time" showTime :disabled-date="disabledDate" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
    </div>
    <div class="box">
      <a-button @click="$emit('next', { step: 0 })">Back to select</a-button>
      <a-button type="primary" @click="toExcute" :loading="loading">Execute
        <a-icon type="right-circle" />
      </a-button>
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
        this.$message.error({ content: "Please choose operation type" });
        return false;
      }
      // if (!f.start_time && !f.start_time) {
      //   this.$message.error({ content: "请选择时间" });
      //   return false;
      // }
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
          pids: [...new Set(this.plants.map((m) => m.plant_id))].join(","),
          data: JSON.stringify(
            this.plants.map((m) => ({
              id: m.id,
              plant_id: m.plant_id,
              user_id: m.user_id,
              address: m.address,
            }))
          ),
          kind: "remote",
        };
        if (!data.start_time || data.start_time =='null') {
          // data.start_time = data.start_time.format("YYYY-MM-DD HH:mm:ss");
          delete data.start_time
        }
        if (!data.end_time || data.end_time == 'null') {
          // data.end_time = data.end_time.format("YYYY-MM-DD HH:mm:ss");
          delete data.end_time
        }
        if (!this.plants || this.plants.length < 1) {
          this.$message.error({
            content: "The choosed inverters lost, please rechoose them",
          });
          return;
        }
        console.log("log data:", data);
        // return; // for test
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