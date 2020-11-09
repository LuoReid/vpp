<template>
  <div>
    <div class="box">
      Operation Selection:
      <a-radio-group v-model="form.action">
        <a-radio-button value="on">
          Switch on - Connect
        </a-radio-button>
        <a-radio-button value="off">
          Switch off - Disconnect
        </a-radio-button>
        <a-radio-button value="limit">
          Zero export
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="box" v-if="false && form.action == 'limit'">
      Export to Capacity:
      <a-input
        v-model="form.capacity"
        placeholder="Enter kWh (Max.)"
        style="width:350px;"
      />
      <p>
        Instructions: When the electricity that exports to the grid reaches the
        maximum, the plant will stop exporting.
      </p>
    </div>
    <div class="box">
      Start time:
      <a-date-picker 
      format="YYYY-MM-DD HH:mm:ss"
        v-model="form.start_time"
        :disabled-date="disabledDate"
        :show-time="{ defaultValue: moment() }"
      />
    </div>
    <div class="box">
      End time:
      <a-date-picker
      format="YYYY-MM-DD HH:mm:ss"
        v-model="form.end_time"
        :disabled-date="disabledDate"
        :show-time="{ defaultValue: moment() }"
      />
    </div>
    <div class="box">
      <a-button @click="$emit('next', { step: 0 })">Back to select</a-button>
      <a-button type="primary" @click="toExcute"
        >Execute <a-icon type="right-circle"
      /></a-button>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: { data: Object },
  data() {
    return {
      form: {
        con: true,
        capacity: ""
      }
    };
  },
  methods: {
    moment,
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    },
    valid() {
      const f = this.form;
      if (!f.start_time && !f.start_time) {
        this.$message.error({ content: "请选择时间" });
        return false;
      }
      return true;
    },
    toExcute() {
      if (this.valid()) {

        console.log("form:", this.data, this.form);
            this.$emit("next", { step: 2, obj: this.form });
        const data = {
          kind: "remote",
          ...this.data.inverters,
          ...this.form,
          data: JSON.stringify(this.form.inverters)
        };
        // this.$store.dispatch("remote/control", data).then(res => {
        //   if (res.code == 20) {
        //     this.$message.success({ content: res.msg });
        //     this.$emit("next", { step: 2, obj: this.form });
        //   }
        // });
      }
    }
  }
};
</script>

<style scoped>
.box {
  margin: 15px 0;
}
</style>