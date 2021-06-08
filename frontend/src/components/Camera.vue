<template>
  <div>
    <PrerequisiteStatus icon='📷'
                        label='Camera'
                        :status="prerequisiteStatus"
                        @on-button-click="toggleStatusShown"
                        buttonLabel='Status'/>
    <div v-if="showStatus">
      <WebCam
        :width="videoPreviewDimensions.width"
        :height="videoPreviewDimensions.height"
        :resolution="{ width: 1980, height: 1080 }"
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
        <button v-if="!!devices && devices.length > 1" @click="switchCamera">Switch camera</button>
      </div>
      <div v-if="!!img">
        <p>
          Most recently captured photo:
        </p>
        <div>
          <img :src="img"  class='captured-photo'/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrerequisiteStatus, { Status } from '@/components/PrerequisiteStatus.vue'
import { WebCam } from 'vue-web-cam'

type DeviceData = {
  deviceId: string
}

type Dimensions = {
  width: number,
  height: number
}

@Component({
  name: 'Camera',
  components: { PrerequisiteStatus, WebCam }
})
export default class Camera extends Vue {
  private prerequisiteStatus = Status.USER_INTERACTION_REQUIRED;
  private showStatus = false;

  private img? = ''
  private camera? = ''
  private deviceId? = ''
  private devices: DeviceData[] = []
  private isPlaying = false
  private videoActualDimensions: Dimensions | null = null
  private videoPreviewDimensions: Dimensions | null = { width: 300, height: 300 }

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

  @Watch('videoActualDimensions')
  onVideoActualDimensionsChange (videoActualDimensions: Dimensions) {
    const { width, height } = videoActualDimensions.width ? videoActualDimensions : { width: 1980, height: 1080 }
    const ratio = width / height
    console.log(`📐 Aspect ratio of ${width}x${height} is ${ratio.toFixed(2)}.`)
    const maxSize = 400
    if (width > height) {
      this.videoPreviewDimensions = { width: maxSize, height: maxSize / ratio }
    } else {
      this.videoPreviewDimensions = { width: maxSize * ratio, height: maxSize }
    }
  }

  capture () {
    const cam: any = this.$refs.webcam
    const image = cam.capture()
    console.log(`📷 Captured photo. Got ${image.length} bytes.`)
    this.img = image
    this.prerequisiteStatus = Status.SUCCESS
  }

  stop () {
    const cam: any = this.$refs.webcam
    cam.stop()
  }

  start () {
    const cam: any = this.$refs.webcam
    cam.start()
  }

  switchCamera () {
    const currentIndex = this.devices.findIndex(device => device.deviceId === this.deviceId)
    this.deviceId = this.devices[(currentIndex + 1) % this.devices.length].deviceId
  }

  onStarted (mediaStream: any) {
    console.log('On Started Event', mediaStream)
    this.isPlaying = true

    mediaStream.getVideoTracks().forEach((videoTrack:any) => {
      const currentSettings = videoTrack.getSettings()
      console.log(`Got ${currentSettings.width}x${currentSettings.height}`)
      this.videoActualDimensions = { width: currentSettings.width, height: currentSettings.height }
    })
  }

  onStopped (stream: any) {
    console.log('On Stopped Event', stream)
    this.isPlaying = false
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
.captured-photo {
  border: 10px solid white;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  width: 300px;
  height: auto;
}
</style>
