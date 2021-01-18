<template>
  <div class="user">
    <h2>Account</h2>
    <div class="filter">
      <a-button type="primary" @click="addAccount">Add user</a-button>
    </div>
    <a-table
      :data-source="data"
      row-key="id"
      :pagination="false"
      :loading="loading"
    >
      <a-table-column data-index="name" title="Name"> </a-table-column>
      <a-table-column data-index="login_name" title="Login name">
      </a-table-column>
      <a-table-column data-index="email" title="Email"> </a-table-column>
      <a-table-column data-index="action" title="Operations">
        <template slot-scope="text, record">
          <a-button v-if="record.role != 0 && user.role == 0" type="link" @click="toDel(record)">Delete</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination
      :total="page.total"
      :pageSizeOptions="['15', '30', '50', '70', '100']"
      :show-total="(total) => `Total ${total} users`"
      @change="changePage"
      @showSizeChange="changePage"
      show-size-changer
      show-quick-jumper
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      data: [],
      page: { total: 0 },
      loading: false,
    };
  },
  computed:{
    ...mapGetters(['user'])
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    toDel(u) {
      this.$confirm({
        title: `Do you want to delete the user${u.name}?`,
        onOk: () => {
          this.$store.dispatch("user/delete", u.id).then((res) => {
            // this.$router.push({ name: "login" });
            this.fetchUsers();
          });
        },
      });
    },
    addAccount() {
      this.$router.push({ name: "accountEdit", params: { id: 0 } });
    },
    changePage(page, pageSize) {
      this.featUsers({ limit: pageSize || 15, page: page || 1 });
    },
    fetchUsers(param = {}) {
      this.$api.getUsers(param).then((res) => {
        this.data = res.data;
        this.page = res.page;
      });
    },
  },
};
</script>

<style scoped>
</style>