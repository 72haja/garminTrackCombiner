<script setup>
import { computed, watch, ref } from 'vue';

const errorMessage = ref("")
const fileActivityTypes = ref([])

const props = defineProps({
  files: {
    type: Array,
    default: () => ([])
  }
})

const emit = defineEmits(['error-exists'])

watch(() => props.files, async () => {
  getFileActivityTypes();
  checkIfAllDocsHaveSameActivity();
},
  {
    immediate: true
  }
)

const errorMessageLength = computed(() => errorMessage.value?.length || 0)

function getFileActivityTypes () {
  if (!props.files) return []

  fileActivityTypes.value = props.files.map((file) => {
    const sportType = file.content.getElementsByTagName("Activity")[0].getAttribute("Sport")

    return {
      name: file.name,
      sportType: sportType,
    }
  })
}

function checkIfAllDocsHaveSameActivity () {
  emit("error-exists", false)
  const firstActivity = fileActivityTypes.value[0].sportType
  fileActivityTypes.value.forEach((doc) => {
    const docActivity = doc.sportType
    if (docActivity !== firstActivity) {
      errorMessage.value = "Alle XML-Dateien müssen die gleiche Aktivität haben."
      emit("error-exists", true)
    }
  })
}
</script>

<template>
  <div class="pa-4 custom-list">
    <v-list-item v-for="(file, index) in fileActivityTypes"
                 :key="index"
                 elevation="2">
      <div class="d-flex justify-space-between align-center">
        <span>
          {{ file.name }}
        </span>
        <span>
          {{ file.sportType }}
        </span>
      </div>
    </v-list-item>
  </div>
  <v-alert v-if="errorMessageLength > 0"
           type="error"
           dismissible
           class="mb-4">
    {{ errorMessage }}
  </v-alert>

</template>
<style lang='scss' scoped>
.custom-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
