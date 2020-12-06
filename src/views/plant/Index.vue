<template>
  <div>
    <Nav :links="navLinks" />
    <router-view />
  </div>
</template>

<script>
import Nav from "@/components/Nav";
export default {
  components: { Nav },
  data() {
    return {
      navLinks: [
        { name: "plantDashboard", text: "Dashboard" },
        { name: "plantControl", text: "Remote control" },
        { name: "plantReport", text: "Report" },
        { name: "plantAlert", text: "Alert" },
      ]
    };
  }
};
</script>

<style>
</style>