<template>
  <div id="app">
    <div>
      <button v-if="isUpdatePending" @click="refreshApplication">Update app</button>
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
import ServiceWorkerMixing from '@/mixins/serviceWorker'

@Component({
  name: 'App'
})
export default class App extends Mixins(ServiceWorkerMixing) {

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
