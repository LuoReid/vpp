<template>
  <div>
    <div class="box">
      Operation Selection:
      <a-switch
        checked-children="Switch on - Connect"
        un-checked-children="Switch off - Disconnect"
        v-model="form.con"
      />
    </div>
    <div class="box">
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
      <a-date-picker v-model="form.starttime"
        :disabled-date="disabledDate"
        :show-time="{ defaultValue: moment() }"
      />
    </div>
    <div class="box">
      End time:
      <a-date-picker v-model="form.endtime"
        :disabled-date="disabledDate"
        :show-time="{ defaultValue: moment() }"
      />
    </div>
    <div class="box">
      <a-button type="primary" @click="$emit('next',{type:'execute'})">Execute <a-icon type="right-circle"
      /></a-button>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
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
    }
  }
};
</script>

<style scoped>
.box {
  margin: 15px 0;
}
</style>