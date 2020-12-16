<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider
      v-model="collapsed"
      :trigger="null"
      style="min-height: 100vh;"
      collapsible
    >
      <div class="logo" />
      <a-menu mode="inline" theme="dark" :default-selected-keys="['1']" @click="toPage">
        <a-menu-item key="plant">
          <a-icon type="home" />
          <span>Plant</span>
        </a-menu-item>
        <a-menu-item key="plantMap">
          <a-icon type="home" />
          <span>Map</span>
        </a-menu-item>
        <a-menu-item key="data">
          <a-icon type="line-chart" />
          <span>Data</span>
        </a-menu-item>
        <a-menu-item key="account">
          <a-icon type="setting" />
          <span>Account</span>
        </a-menu-item>
        <a-menu-item key="log">
          <a-icon type="info-circle" />
          <span>Logs</span>
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
          margin: '16px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
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
      collapsed: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    ...mapActions(["logout"]),
    toPage({ item, key, keyPath }) {
      // console.log("menu click:", item, key, keyPath);
      if (this.$route.name == key) {
        // this.$router.replace({ name: key });
      } else {
        this.$router.push({ name: key });
      }
    },
    toLogout() {
      this.$confirm({
        title: "Do you want to logout the site?",
        onOk: () => {
          this.logout().then((res) => {
            this.$router.push({ name: "login" });
          });
        },
      });
    },
  },
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
  background: url(./../assets/logo.png) center/auto 100%;
  margin: 16px;
}
</style>