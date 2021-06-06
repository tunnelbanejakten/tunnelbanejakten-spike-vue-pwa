<template>
  <div>
    <PrerequisiteStatus icon='🧭'
                        label='Geolocation'
                        :status="prerequisiteStatus"
                        @on-button-click="toggleStatusShown"
                        buttonLabel='Status'/>
    <div v-if="showStatus">
      <p>{{ geolocationMessage }}</p>
      <div v-if="isStatusSuccessful()">
        <p>Latitude: {{ latitude.toFixed(10) }}</p>
        <p>Longitude: {{ longitude.toFixed(10) }}</p>
        <p>Accuracy: {{ accuracy.toFixed(2) }} km</p>
        <p>Distances:</p>
        <div class="distance" v-for="item in checkpointsDistances()" :key="item.label">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.distance.toFixed(2) }} km</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PrerequisiteStatus, { Status } from '@/components/PrerequisiteStatus.vue'

const GeolocationStatus = {
  UNKNOWN: 'UNKNOWN',
  NO_BROWSER_API: 'NO_BROWSER_API',
  NO_USER_APPROVAL: 'NO_USER_APPROVAL',
  NO_POSITION: 'NO_POSITION',
  NO_RESPONSE: 'NO_RESPONSE',
  BROWSER_API_AVAILABLE: 'BROWSER_API_AVAILABLE',
  LOCATION_REQUEST_INITIATED: 'LOCATION_REQUEST_INITIATED',
  LOCATION_REQUEST_SUCCEEDED: 'LOCATION_REQUEST_SUCCEEDED',
  LOCATION_REQUEST_FAILED: 'LOCATION_REQUEST_FAILED'
}

const checkpoints = [
  {
    label: 'Hässelby strand',
    latitude: 59.361081,
    longitude: 17.832173
  },
  {
    label: 'Grinden till Maltesholmsbadet',
    latitude: 59.358008,
    longitude: 17.840209
  },
  {
    label: 'Pizzeria Piccolo Rosa',
    latitude: 59.360993,
    longitude: 17.831647
  },
  {
    label: 'Maltesholmsvägen 145',
    latitude: 59.361201,
    longitude: 17.833718
  },
  {
    label: 'Förskolan Mirabell',
    latitude: 59.359003,
    longitude: 17.835081
  },
  {
    label: 'Equmenia Hässelby',
    latitude: 59.377278,
    longitude: 17.821176
  },
  {
    label: 'Ankdammen vid Bergslagsplan',
    latitude: 59.365252,
    longitude: 17.860014
  },
  {
    label: 'Sankt Tomas kyrka',
    latitude: 59.362901,
    longitude: 17.870432
  },
  {
    label: 'Pallas konditori',
    latitude: 59.362267,
    longitude: 17.872503
  },
  {
    label: 'Norrmalmskyrkan',
    latitude: 59.345013,
    longitude: 18.048704
  },
  {
    label: 'Sergels torg',
    latitude: 59.332085,
    longitude: 18.064205
  }
]

// Credits: https://stackoverflow.com/a/27943
//
// From https://nathanrooy.github.io/posts/2016-09-07/haversine-with-python/:
//   "Much of [this algorithm's] simplicity comes from the underlying assumption that
//   Earth is a perfect sphere (which it isn't...). Because of this, it can lead to
//   errors of up to 0.5%."

interface Coord {
  latitude: number,
  longitude: number
}

const coordinateDistance = (coord1: Coord, coord2: Coord) => {
  const R = 6371 // Radius of the Earth (in km)
  const dLat = deg2rad(coord2.latitude - coord1.latitude)
  const dLon = deg2rad(coord2.longitude - coord1.longitude)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance (in km)
}

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
}

@Component({
  name: 'Geolocation',
  components: { PrerequisiteStatus }
})
export default class Geolocation extends Vue {
  private prerequisiteStatus = '';
  private geolocationMessage = '';
  private geolocationStatus = '';
  private latitude = 0.0;
  private longitude = 0.0;
  private accuracy = 0.0;
  private showStatus = false;

  isStatusSuccessful () {
    return this.geolocationStatus === GeolocationStatus.LOCATION_REQUEST_SUCCEEDED
  }

  toggleStatusShown () {
    this.showStatus = !this.showStatus
  }

  checkpointsDistances () {
    return checkpoints
      .map(({ label: checkpointLabel, latitude: checkpointLatitude, longitude: checkpointLongitude }) => (
        {
          label: checkpointLabel,
          distance: coordinateDistance(
            {
              latitude: this.latitude,
              longitude: this.longitude
            },
            {
              latitude: checkpointLatitude,
              longitude: checkpointLongitude
            }
          )
        }
      ))
      .sort(({ distance: d1 }, { distance: d2 }) => d1 - d2)
  }

  created () {
    this.geolocationStatus = ('geolocation' in navigator
      ? GeolocationStatus.BROWSER_API_AVAILABLE
      : GeolocationStatus.NO_BROWSER_API
    )
  }

  @Watch('geolocationStatus')
  onStatusChange (geolocationStatus: string) {
    switch (geolocationStatus) {
      case GeolocationStatus.UNKNOWN:
        this.prerequisiteStatus = Status.PENDING
        this.geolocationMessage = 'We do not know if we can figure out your location.'
        break
      case GeolocationStatus.NO_BROWSER_API:
        this.prerequisiteStatus = Status.FAILURE
        this.geolocationMessage = 'We will not be able to figure out your location. Your browser does not support providing us with your GPS coordinates.'
        break
      case GeolocationStatus.NO_USER_APPROVAL:
        this.prerequisiteStatus = Status.FAILURE
        this.geolocationMessage = 'You denied our request to get your location, or your GPS is not turned on.'
        break
      case GeolocationStatus.NO_POSITION:
        this.prerequisiteStatus = Status.FAILURE
        this.geolocationMessage = 'We could not lock onto your location. Maybe you are moving around? Maybe the reception is bad where you are at the moment?'
        break
      case GeolocationStatus.NO_RESPONSE:
        this.prerequisiteStatus = Status.FAILURE
        this.geolocationMessage = 'We did not get your position because the request timed out.'
        break
      case GeolocationStatus.BROWSER_API_AVAILABLE:
        this.prerequisiteStatus = Status.PENDING
        this.geolocationMessage = 'Your device is figuring out your location.'
        this.geolocationStatus = GeolocationStatus.LOCATION_REQUEST_INITIATED

        navigator.geolocation.getCurrentPosition((position) => {
          const {
            coords: {
              accuracy,
              latitude,
              longitude
            }
          } = position
          this.accuracy = 1.0 * accuracy / 1000
          this.latitude = latitude
          this.longitude = longitude
          this.geolocationStatus = GeolocationStatus.LOCATION_REQUEST_SUCCEEDED
        }, (error) => {
          switch (error.code) {
            // 1 PERMISSION_DENIED The acquisition of the geolocation information failed because the page didn't have the permission to do it.
            case 1:
              this.geolocationStatus = GeolocationStatus.NO_USER_APPROVAL
              break
            // 2 POSITION_UNAVAILABLE The acquisition of the geolocation failed because one or several internal sources of position returned an internal error.
            case 2:
              this.geolocationStatus = GeolocationStatus.NO_POSITION
              break
            // 3 TIMEOUT The time allowed to acquire the geolocation, defined by PositionOptions.timeout information that was reached before the information was obtained.
            case 3:
              this.geolocationStatus = GeolocationStatus.NO_RESPONSE
              break
            default:
              this.geolocationStatus = GeolocationStatus.LOCATION_REQUEST_FAILED
              break
          }
        })
        break
      case GeolocationStatus.LOCATION_REQUEST_INITIATED:
        this.prerequisiteStatus = Status.PENDING
        break
      case GeolocationStatus.LOCATION_REQUEST_SUCCEEDED:
        this.prerequisiteStatus = Status.SUCCESS
        this.geolocationMessage = 'We have received your location.'
        break
      case GeolocationStatus.LOCATION_REQUEST_FAILED:
        this.prerequisiteStatus = Status.FAILURE
        this.geolocationMessage = 'For some reason, we could not find your location.'
        break
      default:
        this.prerequisiteStatus = Status.FAILURE
        this.geolocationMessage = 'Unknown status'
        break
    }
  }
}
</script>

<style scoped>
.distance {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-bottom: 5px;
  margin-left: 20px;
}
.distance .label {
}

.distance .value {
}
</style>
