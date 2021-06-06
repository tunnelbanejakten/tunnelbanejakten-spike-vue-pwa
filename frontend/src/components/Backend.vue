<template>
  <div>
    <PrerequisiteStatus icon='🌍'
                        label='API Connection'
                        :status="prerequisiteStatus"
                        @on-button-click="toggleStatusShown"
                        buttonLabel='Status'/>
    <div v-if="showStatus">
      <p>{{ backendStatus }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrerequisiteStatus, { Status } from '@/components/PrerequisiteStatus.vue'

const BackendStatus = {
  UNKNOWN: 'We do not know if the backend is alive or not',
  CHECKING: 'We are checking if you are connected',
  ONLINE: 'The system is online',
  FAILED: 'You are not connected to the system'
}

const apiHost = process.env.VUE_APP_API_HOST

@Component({
  name: 'Backend',
  components: { PrerequisiteStatus }
})
export default class Geolocation extends Vue {
  private prerequisiteStatus = Status.PENDING;
  private backendStatus = BackendStatus.UNKNOWN;
  private showStatus = false;

  toggleStatusShown () {
    this.showStatus = !this.showStatus
  }

  async created () {
    this.backendStatus = BackendStatus.CHECKING
    try {
      const resp = await fetch(`${apiHost}/api/ping`)
      const payload = await resp.json()
      console.log('ℹ️', payload)
      this.backendStatus = BackendStatus.ONLINE
    } catch (e) {
      this.backendStatus = BackendStatus.FAILED
    }
  }

  @Watch('backendStatus')
  onStatusChange (backendStatus: string) {
    this.prerequisiteStatus = {
      [BackendStatus.UNKNOWN]: Status.PENDING,
      [BackendStatus.CHECKING]: Status.PENDING,
      [BackendStatus.ONLINE]: Status.SUCCESS,
      [BackendStatus.FAILED]: Status.FAILURE
    }[backendStatus] || Status.PENDING
  }
}
</script>

<style scoped>

</style>
