<template>
  <div class="hello">
    <Geolocation />
    <Backend />
    <Camera />
    <QrCodeReader />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Geolocation from '@/components/Geolocation.vue'
import Backend from '@/components/Backend.vue'
import Camera from '@/components/Camera.vue'
import QrCodeReader from '@/components/QrCodeReader.vue'

@Component({
  components: { QrCodeReader, Camera, Backend, Geolocation }
})
export default class HelloWorld extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
