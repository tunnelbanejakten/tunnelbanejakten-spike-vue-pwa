import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ServiceWorkerMixing extends Vue {
  private isUpdatePending = false
  private isUpdating = false
  private pendingRegistration: any = null

  created () {
    document.addEventListener('serviceWorkerUpdate', this.onServiceWorkerUpdated, { once: true })

    navigator.serviceWorker.addEventListener('controllerchange', this.onControllerChange)
  }

  onControllerChange () {
    console.log('onControllerChange', this.isUpdating)
    if (this.isUpdating) {
      return
    }
    this.isUpdating = true

    window.location.reload()
  }

  onServiceWorkerUpdated (event: any) {
    console.log('serviceWorkerUpdate', event)
    this.isUpdatePending = true
    this.pendingRegistration = event.detail
  }

  refreshApplication () {
    this.isUpdatePending = false
    console.log('refreshApplication', this.pendingRegistration, this.pendingRegistration.waiting)
    if (this.pendingRegistration && this.pendingRegistration.waiting) {
      this.pendingRegistration.waiting.postMessage({
        type: 'SKIP_WAITING'
      })
    }
  }
}
