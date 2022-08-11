<script setup>
import Header from './components/Header.vue'
import FileCombiner from './components/FileCombiner.vue'

</script>

<template>
  <div class="wrapper w-100 h-100">
    <Header />
    <FileCombiner />
  </div>
</template>

<style scoped>
.wrapper {
  padding: 100px 200px;
}
</style>
<style>
body,
html {
  height: 100vh;
  width: 100vw;
}
</style>
<style>
@import "./style.css";
</style>