<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider
      v-model="collapsed"
      :trigger="null"
      style="min-height:100vh;background:#fff;"
      collapsible
    >
      <div class="logo" />
      <a-menu  mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1">
          <a-icon type="home" />
          <span>Plant</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="line-chart" />
          <span>Data</span>
        </a-menu-item> 
        <a-menu-item key="3">
          <a-icon type="setting" />
          <span>Account</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <span
          ><a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />Welcome, {{ user.name }} :)</span
        >
        <a-button type="link" @click="toLogout">Log out</a-button>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px'
        }"
        ><router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      collapsed: false
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["logout"]),
    toLogout() {
      this.$confirm({
        title: "Do you want to logout the site?",
        onOk: () => {
          this.logout().then(res => {
            this.$router.push({ name: "login" });
          });
        }
      });
    }
  }
};
</script>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0;
}
#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2) url(./../assets/logo.png) center/auto
    100%;
  margin: 16px;
}
</style>