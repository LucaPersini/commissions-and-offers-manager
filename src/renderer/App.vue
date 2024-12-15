<template>
  <div v-if="!invalidPath" class="main-container">
    <div class="menu">
      <div class="link-container">
        <router-link class="link" to="/">Commesse</router-link>
        <router-link class="link" to="/offers">Offerte</router-link>
        <router-link class="link" to="/createcommission">Crea commessa</router-link>
        <router-link class="link" to="/createoffer">Crea offerta</router-link>
      </div>      
    </div>
    <router-view></router-view>
  </div>
  <div v-else="invalidPath" class="error-container">
    <p class="error-title">Selezionare la cartella di salvataggio del database</p>
    <div class="select-btn" @click="selectDatabaseFolder">Seleziona</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
let invalidPath = ref(false);

async function startAppConfiguration() {
  const  result = await window.API.configApp(); 
  console.log(result);
  if(result.success == false) {
    if(result.error == 'invalid_path') {
      invalidPath.value = true;
    } else {
      alert(result.error);
    }
  }
}

startAppConfiguration();

async function selectDatabaseFolder() {
  const result = await window.API.selectDatabaseFolder();
  if(result.success) {
    console.log(result);
    invalidPath.value = false;
  }
}

</script>

<style>
* {
  padding: 0;
  margin: 0;
}

html, body {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #e7eaf6;
  font-family: sans-serif;
}

button:hover {
  cursor: pointer;
}

.error-container {
  min-width: 400px;
  min-height: 100px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.error-title {
  margin: auto;
}

.select-btn {
  width: fit-content;
  margin: auto
}

.main-container {
  display: flex;
  height: 100vh;
}

.menu {
  background-color: white;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  height: 100%;
  box-shadow: 0 4px 6px -2px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.link-container {
  display: flex;
  flex-direction: column;
  margin: auto;
}

.link {
  margin: 10px 0;
  color: #23272A;
  text-decoration: none;
}
</style>