<script setup>
import { ref, computed } from 'vue';

import FileUploader from './FileUploader.vue';
import FileValidator from './FileValidator.vue';

const localFiles = ref([])
const combinedFile = ref({})
const combining = ref(false)

const filesLoaded = ref(false)

const allLabs = ref([])

const errorExists = ref(false)

const setFileLoader = (value) => {
  filesLoaded.value = value
}

function updateLocalFiles (files) {
  let filesCounter = 0;
  setFileLoader(false)
  localFiles.value = []

  files.forEach((file, index) => {
    var reader = new FileReader();
    reader.onload = (event) => {
      if (localFiles.value.findIndex((f) => f.name === file.name) === -1) {
        localFiles.value.push({
          name: file.name,
          content: getXmlDoc(event.target.result)
        });
      }
      filesCounter += 1;
      if (files.length === filesCounter) {
        setFileLoader(true)
      }
    }
    if (typeof file === "Blob") {
      reader.readAsText(file)
      } else {
      reader.readAsText(file.file)
    }
  })
}

function combineFiles () {
  combining.value = true;

  resetLaps();

  localFiles.value.map(doc => doc.content).forEach((doc) => {
    setLaps(doc)
  })

  sortLapsByXmlStartTimeAttribute();

  setXmlCombinedFileValues()
  combining.value = false;
}

function resetLaps () {
  allLabs.value = []
}

function getXmlDoc (content) {
  const parser = new DOMParser();
  return parser.parseFromString(content, "text/xml");
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

  const activities = firstFile.content.getElementsByTagName("Activity")[0]

  removeCurrentLapEntriesInActivities(activities)

  addAllLapsToActivities(activities)

  const parsedXmlElement = new XMLSerializer().serializeToString(firstFile.content);

  combinedFile.value.content = parsedXmlElement
}

function removeCurrentLapEntriesInActivities (activities) {
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

function setErrorExists (propErrorExists) {
  errorExists.value = propErrorExists
}

</script>

<template>
  <div class="file-combine-wrapper w-100 h-100 d-flex flex-column">
    <FileUploader @files-changed="updateLocalFiles" />
    <FileValidator v-if="filesLoaded"
                   :files="localFiles"
                   @error-exists="setErrorExists" />
    <v-btn outlined
           color="grey darken-2"
           :disabled="localFilesAreLessThan2 || errorExists"
           :loading="combining"
           @click="combineFiles"
           class="w-max-content">
      Kombinieren
    </v-btn>
    <v-btn outlined
           color="grey darken-2"
           :disabled="allLabs.length < 1 || errorExists"
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
