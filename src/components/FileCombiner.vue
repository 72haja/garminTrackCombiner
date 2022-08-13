<script setup>
import { ref, computed } from 'vue';

import FileUploader from './FileUploader.vue';
import CombinedValues from './CombinedValues.vue';

const localFiles = ref([])
const combinedFile = ref("")
const combining = ref(false)

const allLabs = ref([])

function updateLocalFiles (files) {
  files.forEach((file) => {
    var reader = new FileReader();
    reader.onload = (event) => {
      if (localFiles.value.findIndex((f) => f.name === file.name) === -1) {
        localFiles.value.push({
          name: file.name,
          content: event.target.result
        });
      }
    }
    reader.readAsText(file)
  })
}

function combineFiles () {
  combining.value = true;

  resetLaps();

  const xmlDocs = getXmlDocs()

  xmlDocs.forEach((doc) => {
    setLaps(doc)
  })

  sortLapsByXmlStartTimeAttribute();

  setXmlCombinedFileValues()
  combining.value = false;
}

function resetLaps () {
  allLabs.value = []
}

function getXmlDocs () {
  return localFiles.value.map((file) => {
    const parser = new DOMParser();
    return parser.parseFromString(file.content, "text/xml");
  })
}

function setLaps (doc) {
  const docLaps = doc.getElementsByTagName("Lap")

  allLabs.value.push(...docLaps)
}

function sortLapsByXmlStartTimeAttribute () {
  allLabs.value.sort((a, b) => {
    const aTime = new Date(a.getAttribute("StartTime"))
    const bTime = new Date(b.getAttribute("StartTime"))
    return aTime - bTime
  })
}

function setXmlCombinedFileValues () {
  const [firstFile] = localFiles.value;

  combinedFile.value = {
    name: "combined.tcx",
    content: firstFile.content,
  }

  const rootParser = new DOMParser();
  const rootXmlDoc = rootParser.parseFromString(combinedFile.value.content, "text/xml");


  const activities = rootXmlDoc.getElementsByTagName("Activity")[0]

  removeCurrentLapEntriesInActivities(activities)

  addAllLapsToActivities(activities)

  const parsedXmlElement = new XMLSerializer().serializeToString(rootXmlDoc);

  combinedFile.value.content = parsedXmlElement
}

function removeCurrentLapEntriesInActivities(activities) {
  const laps = activities.getElementsByTagName("Lap")
  for (let i = laps.length - 1; i >= 0; i--) {
    laps[i].parentNode.removeChild(laps[i])
  }
}

function addAllLapsToActivities (activities) {
  allLabs.value.forEach((lap) => {
    activities.appendChild(lap)
  })
}

const localFilesAreLessThan2 = computed(() => {
  return localFiles.value.length < 2
})

function downloadCombinedFile () {
  const blob = new Blob([combinedFile.value.content], { type: "text/xml" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = combinedFile.value.name
  a.click()
  URL.revokeObjectURL(url)
}

</script>

<template>
  <div class="file-combine-wrapper w-100 h-100 d-flex flex-column">
    <FileUploader @files-changed="updateLocalFiles" />
    <v-btn outlined
           color="grey darken-2"
           :disabled="localFilesAreLessThan2"
           :loading="combining"
           @click="combineFiles"
           class="w-max-content">
      Kombinieren
    </v-btn>
    <!-- <CombinedValues :combined-values="xmlCombinedValues" /> -->
    <v-btn outlined
           color="grey darken-2"
           :disabled="allLabs.length < 1"
           @click="downloadCombinedFile"
           class="w-max-content">
      Download Kombiniertes File
    </v-btn>

  </div>
</template>
<style lang='scss' scoped>
.file-combine-wrapper {
  padding: 50px 0;

  gap: 20px;
}
</style>
