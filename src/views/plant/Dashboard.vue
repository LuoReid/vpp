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
      <a-select default-value="" v-model="search.state" style="width: 120px" allow-clear>
        <a-select-option value=""> All areas </a-select-option>
        <a-select-option value="sa"> SA-South Australia </a-select-option>
        <a-select-option value="wa" disabled>
          WA-West Australia
        </a-select-option>
        <a-select-option value="vic"> VIC-Victoria </a-select-option>
      </a-select>
      Suburb <a-input style="width: 100px" v-model="search.installation_suburb" allow-clear></a-input>
      Postcode<a-input style="width: 100px" v-model="search.installation_postcode" allow-clear></a-input> Plants status:
      <a-select default-value="" style="width: 120px" v-model="search.status" allow-clears>
        <a-select-option value=""> All Plants </a-select-option>
        <a-select-option value="online"> Online </a-select-option>
        <a-select-option value="offline" > Notconnected </a-select-option>
        <a-select-option value="unknown"> Unknown </a-select-option>
      </a-select>
      Batteries status:<a-select style="width:120px;" v-model="search.state1" allow-clear
        ><a-select-option value=""> All Batteries </a-select-option>
        <a-select-option value="sa"> Charging </a-select-option>
        <a-select-option value="wa" disabled> Discharging </a-select-option>
        <a-select-option value="vic"> Unclear </a-select-option>
      </a-select>
      <a-button type="link">More filters</a-button>
      <a-button type="primary" icon="search" @click="fetchPlants()">Search</a-button>
    </div>
    <a-table :data-source="plants" row-key="id" :pagination="page" :loading="loading" @change="handleTableChange">
       <a-table-column data-index="id" title="Plant ID"/>
       <a-table-column data-index="status" title="Plants status"/>
       <a-table-column data-index="system_size" title="Total component power"/>
       <a-table-column data-index="installation_postcode" title="Postcode"/>
       <a-table-column data-index="installation_suburb" title="Suburb"/>
       <a-table-column data-index="inverter_sn" title="Inverter SN"/>
       <a-table-column data-index="installation_date" title="Installation date"/>
       <a-table-column data-index="total_generation" title="Total generation"/>
       <a-table-column data-index="action" title="Operations">
         <template slot-scope="text,record">
           <a-button type="link">Switch off plant</a-button>
         </template>
       </a-table-column>
    </a-table>
  </div>
</template>

<script> 
import DashSummary from "./DashSummary";
export default {
  components: { DashSummary },
  data() {
    return {
      plants:[],
      page:{},
      loading:false,
      search:{},
      data: [
        { text: "PV production", value: 359, unit: "MW" },
        { text: "Export to grid", value: 5.3, unit: "MW" },
        { text: "Import from grid", value: 139.3, unit: "MW" },
        { text: "Available Battery Capacity", value: 985, unit: "KW" },
      ],
      data1: [
        { text: "Gross genestion", value: 5.12, unit: "GWh" },
        { text: "Total component power", value: 27734, unit: "kWh" },
        { text: "Total revenue(estimated)", value: 273832.39, unit: "$" },
      ],
    };
  },
  created(){
    this.fetchPlants()
  },
  methods:{
    handleTableChange(pagination, filters, sorter) {
      console.log('change:',pagination,filters,sorter);
      const pager = { page:pagination.current,limit:pagination.pageSize };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetchPlants(pager);
      // this.fetch({
      //   results: pagination.pageSize,
      //   page: pagination.current,
      //   sortField: sorter.field,
      //   sortOrder: sorter.order,
      //   ...filters,
      // });
    },
    fetchPlants(param={}){
      param.kind='page'
      this.loading = true
      if (this.search.state){
        param.state = this.search.state
      }
      if (this.search.status){
        param.status = this.search.status
      }
      if (this.search.installation_suburb){
        param.installation_suburb = this.search.installation_suburb
      }
      if (this.search.installation_postcode){
        param.installation_postcode = this.search.installation_postcode
      }
      this.$store.dispatch('remote/plants',param).then(res => {
        this.loading = false
        this.plants = res.data
        this.page = res.page
      })
    }
  }
};
</script>

<style scoped>
.filter{
  display: flex;
  align-items: center;
}
</style>