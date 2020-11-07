<template>
  <div>
    <a-row :gutter="30">
      <a-col :span="14">
        <DashSummary title="Daily Overview" :data="data" />
      </a-col>
      <a-col :span="10">
        <DashSummary title="Summary" :data="data1" />
      </a-col>
    </a-row>
    <h4>Pant management</h4>
    <div class="filter">
      Filter Satate:
      <a-select default-value="" style="width: 120px">
        <a-select-option value="">
          All areas
        </a-select-option>
        <a-select-option value="sa">
          SA-South Australia
        </a-select-option>
        <a-select-option value="wa" disabled>
          WA-West Australia
        </a-select-option>
        <a-select-option value="vic">
          VIC-Victoria
        </a-select-option>
      </a-select>
      Postcode/Suburb <a-input style="width:100px;"></a-input> Plants status:
      <a-select default-value="" style="width: 120px">
        <a-select-option value="">
          All Plants
        </a-select-option>
        <a-select-option value="sa">
          Online
        </a-select-option>
        <a-select-option value="wa" disabled>
          Notconnected
        </a-select-option>
        <a-select-option value="vic">
          Unknown
        </a-select-option>
      </a-select>
      Batteries status:<a-select
        ><a-select-option value="">
          All Batteries
        </a-select-option>
        <a-select-option value="sa">
          Charging
        </a-select-option>
        <a-select-option value="wa" disabled>
          Discharging
        </a-select-option>
        <a-select-option value="vic">
          Unclear
        </a-select-option>
      </a-select>
      <a-button type="link">More filters</a-button>
      <a-button type="primary" icon="search">Search</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" row-key="key">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
    <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="action" slot-scope="text, record">
      <a>Check profile</a>
      <a>Export report</a>
      <a class="ant-dropdown-link">Switch off plant<a-icon type="down" /> </a>
    </span>
  </a-table>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    title:'Plant ID',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Plant status',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Total component power',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'State',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' },
  },
  {
    title: 'Postcode/Suburb',
    key: 'postcode',
    dataIndex: 'postcode',
  },
  {
    title: 'Batteries status',
    key: 'battery',
    dataIndex: 'battery',
  },

  {
    title: 'Install date',
    key: 'installdate',
    dataIndex: 'installdate',
  },

  {
    title: 'Total generation',
    key: 'totalGen',
    dataIndex: 'totalGen',
  },

  {
    title: 'Total revenue',
    key: 'totalRe',
    dataIndex: 'totalRe',
  },
  {
    title: 'Operations',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
import DashSummary from "./DashSummary";
export default {
  components: { DashSummary },
  data() {
    return {
      data,
      columns,
      data: [
        { text: "PV production", value: 359, unit: "MW" },
        { text: "Export to grid", value: 5.3, unit: "MW" },
        { text: "Import from grid", value: 139.3, unit: "MW" },
        { text: "Available Battery Capacity", value: 985, unit: "KW" }
      ],
      data1: [
        { text: "Gross genestion", value: 5.12, unit: "GWh" },
        { text: "Total component power", value: 27734, unit: "kWh" },
        { text: "Total revenue(estimated)", value: 273832.39, unit: "$" }
      ]
    };
  }
};
</script>

<style>
</style>