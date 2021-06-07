<template>
  <div>
    <PrerequisiteStatus icon='📷'
                        label='Camera'
                        :status="prerequisiteStatus"
                        @on-button-click="toggleStatusShown"
                        buttonLabel='Status'/>
    <div v-if="showStatus">
      <WebCam
        width="100%"
        height="300"
        ref="webcam"
        :device-id="deviceId"
        @started="onStarted"
        @stopped="onStopped"
        @error="onError"
        @cameras="onCameras"
        @camera-change="onCameraChange"
      />
      <div>
        <button v-if="!isPlaying" @click="start">Start</button>
        <button v-if="isPlaying" @click="stop">Stop</button>
        <button v-if="isPlaying" @click="capture">Capture</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrerequisiteStatus, { Status } from '@/components/PrerequisiteStatus.vue'
import { WebCam } from 'vue-web-cam'

@Component({
  name: 'Camera',
  components: { PrerequisiteStatus, WebCam }
})
export default class Camera extends Vue {
  private prerequisiteStatus = Status.PENDING;
  private showStatus = false;

  private img? = ''
  private camera? = ''
  private deviceId? = ''
  private devices = []
  private isPlaying = false

  toggleStatusShown () {
    this.showStatus = !this.showStatus
  }

  @Watch('camera')
  onCameraValueChange (id: string) {
    this.deviceId = id
  }

  @Watch('devices')
  onDevicesValueChange () {
    // Once we have a list select the first one
    const [first, ...tail]: any[] = this.devices
    if (first) {
      this.camera = first.deviceId
      this.deviceId = first.deviceId
    }
  }

  capture () {
    const cam: any = this.$refs.webcam
    const image = cam.capture()
    console.log('🏞', image)
  }

  stop () {
    const cam: any = this.$refs.webcam
    cam.stop()
  }

  start () {
    const cam: any = this.$refs.webcam
    cam.start()
  }

  onStarted (stream: any) {
    console.log('On Started Event', stream)
    this.isPlaying = true
  }

  onStopped (stream: any) {
    console.log('On Stopped Event', stream)
    this.isPlaying = false
  }

  onStop () {
    const cam: any = this.$refs.webcam
    cam.stop()
  }

  onStart () {
    const cam: any = this.$refs.webcam
    cam.stop()
  }

  onError (error: any) {
    console.log('On Error Event', error)
  }

  onCameras (cameras: any) {
    this.devices = cameras
    console.log('On Cameras Event', cameras)
  }

  onCameraChange (deviceId: string) {
    this.deviceId = deviceId
    this.camera = deviceId
    console.log('On Camera Change Event', deviceId)
  }
}
</script>

<style scoped>

</style>
