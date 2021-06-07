<template>
  <div class="prerequisite-status">
    <div>{{ icon }}</div>
    <div>{{ label }}</div>
    <button v-if="buttonLabel" @click="onButtonClick">{{ buttonLabel }}️</button>
    <div>{{ getStatusIcon(status) }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'

export const Status = {
  PENDING: 'pending',
  FAILURE: 'failure',
  SUCCESS: 'success',
  USER_INTERACTION_REQUIRED: 'user_interaction_required'
}

@Component({
  name: 'PrerequisiteStatus'
})
export default class PrerequisiteStatus extends Vue {
  @Prop({ default: '' }) private readonly label!: string
  @Prop({ default: '' }) private readonly status!: string
  @Prop({ default: '' }) private readonly icon!: string
  @Prop({ default: '' }) private readonly buttonLabel!: string

  @Emit()
  onButtonClick () {
    return true
  }

  getStatusIcon () {
    switch (this.status) {
      case Status.PENDING:
        return '⏳'
      case Status.FAILURE:
        return '💥'
      case Status.SUCCESS:
        return '✅'
      case Status.USER_INTERACTION_REQUIRED:
        return '👋'
    }
  }
}
</script>

<style scoped>
div.prerequisite-status {
  display: flex;
  border-radius: 5px;
  border: 1px solid rgba(255,255,255,0.2);
}
div.prerequisite-status div:first-child,
div.prerequisite-status div:last-child {
  width: 30px;
  flex-grow: 0;
  text-align: center;
}

div.prerequisite-status div {
  flex-grow: 1;
  padding: 5px;
  text-align: left;

  height: 30px;
  line-height: 30px;
}
</style>
