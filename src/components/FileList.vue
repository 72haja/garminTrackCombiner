<script setup>
const props = defineProps({
  localFiles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove-file'])

function removeFile (file) {
  emit("remove-file", file)
}
</script>

<template>
  <div class="files-wrapper">
    <v-list v-for="file in localFiles"
            class="file-wrapper d-flex justify-space-between">
      <v-list-item class="file-name">{{ file.name }}</v-list-item>
      <v-list-item-action>
        <v-btn icon
               flat
               @click="removeFile(file)">
          <v-icon large
                  color="grey darken-2">
            mdi-close
          </v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list>
  </div>
</template>
<style lang='scss'>
</style>
