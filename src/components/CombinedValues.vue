<script setup>
import { computed } from '@vue/reactivity';


const props = defineProps({
  combinedValues: {
    type: Object,
    default: () => { }
  }
})

const combinedValueKeys = computed(() => {
  return Object.keys(props.combinedValues)
})

const combinedValuesHasValues = computed(() => {
  return props.combinedValues.totalTimeSeconds > 0
})
</script>

<template>
  <div v-if="combinedValuesHasValues">
    <v-card color="grey darken-2"
            elevation-10>
      <v-list v-for="key in combinedValueKeys"
              class="file-wrapper d-flex justify-space-between">
        <v-list-item class="file-name">{{ key }}</v-list-item>
        <v-list-item class="file-name">{{ props.combinedValues[key] }}</v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
<style lang='scss'>
</style>
