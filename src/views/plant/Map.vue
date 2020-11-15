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
      imgLinked:'data:image/png;base64,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',
      imgNolinked:'data:image/png;base64,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'
    };
  },
  mounted() {
    this.initMap();
    this.setMarker();
  },
  watch: {
    places: function (newVal, oldVal) {
      if (oldVal) {
        (oldVal||[]).forEach((e) => {
          if (e.marker) {
            e.marker.setMap(null);
          }
        });
      }
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
          icon:e.status == 'on' ? this.imgNolinked : this.imgLinked
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