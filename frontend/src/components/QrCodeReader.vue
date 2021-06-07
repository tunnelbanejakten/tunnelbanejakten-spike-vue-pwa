<template>
  <div>
    <PrerequisiteStatus icon='⌘'
                        label='QR Code Reader'
                        :status="prerequisiteStatus"
                        @on-button-click="toggleStatusShown"
                        buttonLabel='Status'/>
    <div v-if="showStatus">
      <qrcode-stream @decode="onDecode" @init="onStarted">
        <div v-if="!isStarted">
          Loading...
        </div>
        <div v-if="!!lastQrCodeValue">
          {{ lastQrCodeValue }}
        </div>
      </qrcode-stream>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PrerequisiteStatus, { Status } from '@/components/PrerequisiteStatus.vue'
import { QrcodeStream } from 'vue-qrcode-reader'

@Component({
  name: 'QrCodeReader',
  components: { PrerequisiteStatus, QrcodeStream }
})
export default class QrCodeReader extends Vue {
  private prerequisiteStatus = Status.USER_INTERACTION_REQUIRED;
  private showStatus = false;
  private lastQrCodeValue = '';
  private isStarted = false;

  toggleStatusShown () {
    this.showStatus = !this.showStatus
  }

  onDecode (qrCodeValue: string) {
    this.lastQrCodeValue = qrCodeValue
    this.prerequisiteStatus = Status.SUCCESS
  }

  onStarted () {
    this.isStarted = true
  }
}
</script>

<style scoped>

</style>
