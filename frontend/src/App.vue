<template>
  <div id="app">
    <div v-if="isUpdatePending">
      <p>
        <strong>A new version of the app is available.</strong>
        We recommend you save your changes and then click Update.
      </p>
      <button @click="onUpdateApp">Update</button>
      <p><small>Updating the app will reload the page.</small></p>
    </div>
    <!--
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
    -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ServiceWorkerMixin from '@/mixins/ServiceWorkerMixin'

@Component({
  name: 'App'
})
export default class App extends Mixins(ServiceWorkerMixin) {
  onUpdateApp () {
    this.refreshApplication()
  }
}
</script>

<style>
#app {
  font-family: sans-serif;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
