<script setup>
import { ref, computed } from 'vue';

import FileUploader from './FileUploader.vue';
import CombinedValues from './CombinedValues.vue';

const localFiles = ref([])
const combinedFile = ref("")
const combining = ref(false)

const xmlCombinedValues = ref({
  totalTimeSeconds: 0,
  distanceMeters: 0,
  maximumSpeed: 0,
  calories: 0,
  maximumHeartRateBpm: 0,
  trackPoints: [],
})

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

  resetXmlCombinedValues();

  const xmlDocs = getXmlDocs()

  xmlDocs.forEach((doc) => {
    setXmlCombinedValues(doc)
  })

  setXmlCombinedFileValues()
  combining.value = false;
}

function resetXmlCombinedValues () {
  xmlCombinedValues.value = {
    totalTimeSeconds: 0,
    distanceMeters: 0,
    maximumSpeed: 0,
    calories: 0,
    maximumHeartRateBpm: 0,
    trackPoints: [],
  }
}

function getXmlDocs () {
  return localFiles.value.map((file) => {
    const parser = new DOMParser();
    return parser.parseFromString(file.content, "text/xml");
  }).filter((doc) => doc.documentElement.nodeName !== "parsererror")
}

function setXmlCombinedValues (doc) {
  const docTotalTimeSeconds = doc.getElementsByTagName("TotalTimeSeconds")[0].childNodes[0].nodeValue;
  const docDistanceMeters = doc.getElementsByTagName("DistanceMeters")[0].childNodes[0].nodeValue;
  const docMaximumSpeed = doc.getElementsByTagName("MaximumSpeed")[0].childNodes[0].nodeValue;
  const docCalories = doc.getElementsByTagName("Calories")[0].childNodes[0].nodeValue;
  const docMaximumHeartRateBpm = doc.getElementsByTagName("MaximumHeartRateBpm")[0];
  const docMaximumHeartRateBpmValue = docMaximumHeartRateBpm.getElementsByTagName("Value")[0].childNodes[0].nodeValue;
  const currTrack = doc.getElementsByTagName("Track")[0]
  const currentTrackPoints = currTrack.getElementsByTagName("Trackpoint")

  xmlCombinedValues.value.totalTimeSeconds += parseFloat(docTotalTimeSeconds);
  xmlCombinedValues.value.distanceMeters += parseFloat(docDistanceMeters);
  xmlCombinedValues.value.maximumSpeed = xmlCombinedValues.value.maximumSpeed > parseFloat(docMaximumSpeed) ? xmlCombinedValues.value.maximumSpeed : parseFloat(docMaximumSpeed);
  xmlCombinedValues.value.calories += parseFloat(docCalories);
  xmlCombinedValues.value.maximumHeartRateBpm = xmlCombinedValues.value.maximumHeartRateBpm > parseFloat(docMaximumHeartRateBpmValue) ? xmlCombinedValues.value.maximumHeartRateBpm : parseFloat(docMaximumHeartRateBpmValue);
  xmlCombinedValues.value.trackPoints = [
    ...xmlCombinedValues.value.trackPoints,
    ...currentTrackPoints
  ];

}

function setXmlCombinedFileValues () {
  const [firstFile] = localFiles.value;

  combinedFile.value = {
    name: "combined.tcx",
    content: firstFile.content,
  }

  const rootParser = new DOMParser();
  const rootXmlDoc = rootParser.parseFromString(combinedFile.value.content, "text/xml");


  rootXmlDoc.getElementsByTagName("TotalTimeSeconds")[0].childNodes[0].nodeValue = xmlCombinedValues.value.totalTimeSeconds;
  rootXmlDoc.getElementsByTagName("DistanceMeters")[0].childNodes[0].nodeValue = xmlCombinedValues.value.distanceMeters;
  rootXmlDoc.getElementsByTagName("MaximumSpeed")[0].childNodes[0].nodeValue = xmlCombinedValues.value.maximumSpeed;
  rootXmlDoc.getElementsByTagName("Calories")[0].childNodes[0].nodeValue = xmlCombinedValues.value.calories;
  const rootXmlDocMaximumHeartRateBpm = rootXmlDoc.getElementsByTagName("MaximumHeartRateBpm")[0];
  rootXmlDocMaximumHeartRateBpm.getElementsByTagName("Value")[0].childNodes[0].nodeValue = xmlCombinedValues.value.maximumHeartRateBpm;

  const track = document.createElementNS('', "Track");
  xmlCombinedValues.value.trackPoints
    .sort((a, b) => {
      const dateA = new Date(a.getElementsByTagName("Time")[0].childNodes[0].nodeValue);
      const dateB = new Date(b.getElementsByTagName("Time")[0].childNodes[0].nodeValue);
      return dateA - dateB;
    })
    .forEach((trackPoint) => {
      track.appendChild(trackPoint)
    })

  rootXmlDoc.getElementsByTagName("Track")[0].replaceWith(track);

  const parsedXmlElement = new XMLSerializer().serializeToString(rootXmlDoc);

  combinedFile.value.content = parsedXmlElement
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
           :loading="combining.value"
           @click="combineFiles"
           class="w-max-content">
      Kombinieren
    </v-btn>
    <CombinedValues :combined-values="xmlCombinedValues" />
    <v-btn outlined
           color="grey darken-2"
           :disabled="xmlCombinedValues.totalTimeSeconds < 1"
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
