<script setup>
import { ref } from 'vue';
import FileList from './FileList.vue';

const emit = defineEmits(['files-changed'])

const files = ref([])

function onFilesChanged () {
  emit('files-changed', files.value)
}

function removeFile (file) {
  files.value = files.value.filter((localFile) => localFile.name !== file.name)
  onFilesChanged()
}
</script>

<template>
  <div>
    <v-file-input accept=".tcx"
                  label="TXC-Dateien"
                  outlined
                  chips
                  counter
                  v-model="files"
                  class="w-100"
                  @change="onFilesChanged"
                  multiple></v-file-input>
    <FileList :local-files="files"
              @remove-file="removeFile" />
  </div>
</template>
<style lang='scss'>
</style>
