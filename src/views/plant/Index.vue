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
        { name: "plantTrading", text: "Power trading" },
        { name: "plantReport", text: "Report" },
      ]
    };
  }
};
</script>

<style>
</style>