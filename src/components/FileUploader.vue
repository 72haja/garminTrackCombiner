<script setup>
import { ref } from 'vue';

emits: ['files-changed']

const files = ref([])

function onFilesChanged (files) {
  this.$emit('files-changed', files)
}
</script>

<template>
  <v-file-input accept=".tcx"
                label="TXC-Dateien"
                outlined
                chips
                counter
                v-model="files"
                @change="onFilesChanged"
                multiple></v-file-input>
</template>
<style lang='scss'>
</style>
