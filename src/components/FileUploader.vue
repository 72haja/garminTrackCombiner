<script setup>
import { ref, watch, computed } from 'vue';

const emit = defineEmits(['files-changed'])

const files = ref([])

function emitFilesChanged () {
  emit('files-changed', files.value || [])
}

function removeFile (fileName) {
  files.value = files.value?.filter((localFile) => localFile.name !== fileName) || []
}

const fileLength = computed(() => files.value?.length || 0)

watch(files, async () => {
  emitFilesChanged();
})
</script>

<template>
  <div>
    <v-file-input accept=".tcx"
                  label="TXC-Dateien"
                  outlined
                  chips
                  counter
                  :key="fileLength"
                  clearable
                  v-model="files"
                  class="w-100"
                  multiple>
      <template #selection="item">
        <v-chip v-for="(file, index) in item.fileNames"
                :key="index"
                closable
                @click:close.stop="removeFile(file)">
          {{ file }}
        </v-chip>
      </template>
    </v-file-input>
  </div>
</template>
<style lang='scss'>
</style>
