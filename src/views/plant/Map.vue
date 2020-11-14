<template>
  <!-- <GmapMap
    :center="{ lat: -34.98, lng: 138.574 }"
    :zoom="7"
    map-type-id="gosolar-vpp-map" style="width:100%;min-height:50vh;"
  >
  </GmapMap> -->
  <div class="google-map" id="map"></div>
</template>

<script>
export default {
  props: { places: Array },
  data() {
    return {
      map: null,
      lat: -34.98,
      lng: 138.574,
    };
  },
  mounted() {
    this.initMap();
    this.setMarker();
  },
  watch: {
    places: function (newVal, oldVal) {
      if (newVal) {
        this.setMarker();
      }
    },
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.98, lng: 138.574 },
        zoom: 6,
        maxZoom: 15,
        minZoom: 5,
        mapTypeControl: false,
      });
    },
    setMarker() {
      this.places.forEach((e) => {
        e.marker = new google.maps.Marker({
          position: { lat: e.latitude, lng: e.longitude },
          map: this.map,
        });
      });
    },
  },
};
</script>

<style scoped>
.google-map {
  width: 100%;
  min-height: 50vh;
  height: 400px;
}
</style>