<script setup>
import { ref, watch, computed } from 'vue';
import DropZone from './DropZone.vue';
import useFileList from '../utils/file-list'
const { files, addFiles, removeFile } = useFileList()

const emit = defineEmits(['files-changed'])

function emitFilesChanged () {
  emit('files-changed', files.value || [])
}

const fileLength = computed(() => files.value?.length || 0)

watch(files, async () => {
  emitFilesChanged();
})
</script>

<template>
  <DropZone @files-dropped="addFiles"
            #default="{ dropZoneActive }">
    <v-file-input accept=".tcx"
                  chips
                  :label="dropZoneActive ? 'Drop Them Here' : 'Drag Your Files Here or Click'"
                  counter
                  :key="fileLength"
                  clearable
                  prepend-icon=""
                  v-model="files"
                  class="w-100 h-100 custom-input-field"
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
  </DropZone>
</template>
<style lang='scss' scoped>
.custom-input-field.v-input--horizontal {
  grid-template-rows: auto 0;
}
</style>
<style lang="scss">
.custom-input-field.v-input--horizontal .v-field--variant-filled .v-field__outline::before {
  border-width: 0;
}
</style>
