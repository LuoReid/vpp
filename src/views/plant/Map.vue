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
      p0:require("@/assets/p0.png"),
      p1:require("@/assets/p1.png"),
      p2:require("@/assets/p2.png"),
    };
  },
  mounted() {
    this.initMap();
    this.setMarker();
  },
  watch: {
    places: function (newVal, oldVal) {
      if (oldVal) {
        (oldVal || []).forEach((e) => {
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
        center: { lat: -34.9260551, lng: 138.5989762 },
        zoom: 10,
        maxZoom: 18,
        minZoom: 5,
        mapTypeControl: false,
      });
    },
    toUrl(e) {
      console.log("data:", e);
    },
    setMarker() {
      this.places.forEach((e, idx) => {
        const option = {
          position: { lat: e.latitude, lng: e.longitude },
          map: this.map,
          data: e,
          id:e.id
        }; 
        // if (e.status) {
        option.icon ={url:this[`p${e.state}`],scaledSize:new google.maps.Size(30,30)} ;
        // }
        e.marker = new google.maps.Marker(option);
        // e.marker.addListener("click", (e) => {
        //   console.log('marker click:',e,this)
        //     this.$router.push({name:'plantDetail',parmas:{id:e.id}})
        // } );
        const that = this;
        const toUrl = function (e) {
          // that.$router.push({ name: "plantDetail", parmas: { id: e.id } });
          let routeData = that.$router.resolve({
            name:'plantDetail',params:{id:e.id}
          });
          window.open(routeData.href,'_blank')
        };

        (function (marker, id, that) {
          google.maps.event.addListener(marker, "click", function (evt) {
            // console.log("click:",marker.id,id, that,evt);
            // that.$router.push({ name: "plantDetail", params: { id: id} });
            let routeData = that.$router.resolve({
            name:'plantDetail',params:{id:e.id}
          });
          window.open(routeData.href,'_blank')
            // that.toUrl(e)
            // toUrl(e);
          });
        })(e.marker, e.id, that);
        if (idx == this.places.length - 1 && this.map) {
          const { latitude, longitude } = e;
          // this.map.setCenter(new google.maps.LatLng(latitude,longitude))
        }
      });
    },
  },
};
</script>

<style scoped>
.google-map {
  width: 100%;
  min-height: 50vh;
  height: 450px;
}
</style>