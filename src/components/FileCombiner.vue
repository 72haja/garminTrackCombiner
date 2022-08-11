<script setup>
import { ref } from 'vue';
import FileUploader from './FileUploader.vue';

const localFiles = ref([])

function updateLocalFiles (files) {
  this.localFiles = files
}
</script>

<template>
  <div class="wrapper w-100 h-100">
    <FileUploader @files-changed="updateLocalFiles"/>
    <div class="files-wrapper">
      <div v-for="file in localFiles" class="file-wrapper">
        <p class="file-name">{{ file.name }}</p>
        <p class="file-size">{{ file.size }}</p>
      </div>
    </div>
  </div>
</template>
<style lang='scss'>
</style>
˚