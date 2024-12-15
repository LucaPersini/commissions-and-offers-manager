<template>
  <div class="view-container">
    <div class="title">Commesse</div>
    <div class="folders-by-year">
      <div class="year-folder" v-for="data in foldersByYears" @click="changeFolderToDisplay(data.year)">{{ data.year }}</div>
    </div>
    <div class="data-container">
      <div class="commissions-list">
        <div class="id-list">
          <div class="list-name first-list">ID</div>
          <div v-for="commission in commissionsToDisplay" class="item commission-id" @click="openCommissionFolder(commission.folder)"> {{ commission.id }}</div>
        </div>
        <div class="clients-list">
          <div class="list-name">Cliente</div>
          <div v-for="commission in commissionsToDisplay" class="item"> {{ commission.client }}</div>
        </div>
        <div class="commissionCode-list">
          <div class="list-name">Codice commessa</div>
          <div v-for="commission in commissionsToDisplay" class="item"> {{ commission.commissionCode }}</div>
        </div>
        <div class="descriptions-list">
          <div class="list-name">Descrizione</div>
          <div v-for="commission in commissionsToDisplay" class="item"> {{ commission.description }}</div>
        </div>
        <div class="commissionType-list">
          <div class="list-name">Tipologia commessa</div>
          <div v-for="commission in commissionsToDisplay" class="item"> {{ commission.commissionType }}</div>
        </div>
        <div class="acceptanseDate-list">
          <div class="list-name">Data di accettazione</div>
          <div v-for="commission in commissionsToDisplay" class="item"> {{ commission.acceptanseDate }}</div>
        </div>
        <div class="deliveryDate-list">
          <div class="list-name">Data di consegna</div>
          <div v-for="commission in commissionsToDisplay" class="item"> {{ commission.deliveryDate }}</div>
        </div>
        <div class="state-list">
          <div class="list-name last-list">Stato</div>
          <div class="item" v-for="commission in commissionsToDisplay">
            <select class="state-select" v-model="commission.state" @change="changeCommissionState(commission)">
              <option :value="commission.state" default>{{ commission.state }}</option>
              <option value="Da iniziare">Da iniziare</option>
              <option value="Aperta">Aperta</option>
              <option value="Chiusa">Chiusa</option>
              <option value="Eliminata">Eliminata</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw, watch } from 'vue';

let commissions = ref([]);
let foldersByYears = ref([]);
let folderToDisplay = ref('');
let commissionsToDisplay = ref([]);

async function getAllCommissions() {
  const result = await window.API.getAllCommissions();
  if(result.success) {
    commissions.value = result.data;
  } else {
    alert(result.error);
  }
}

async function getFoldersByYear() {
  if(commissions.value.length > 0) {
    const result = await window.API.getCommissionsYears();
    if(result.success) {
      foldersByYears.value = result.data;
      folderToDisplay.value = result.data[0].year;
    } else {
      alert(result.error);
    }
  }  
}

function changeFolderToDisplay(newFolder) {
  folderToDisplay.value = newFolder;
}

async function openCommissionFolder(path) {
  const result = await window.API.openFolder(path);
  if(!result.success) {
    alert(result.error);
  }
}

async function changeCommissionState(updatedCommission) {
  const commissionToSend = toRaw(updatedCommission);
  const result = await window.API.updateCommission(commissionToSend);
  if(!result.success) {
    alert(result.error);
  }
}

onMounted(async () => {
  await getAllCommissions();
  await getFoldersByYear();
  commissionsToDisplay.value = [];
  commissions.value.forEach(commission => {
    if(commission.year == folderToDisplay.value) {
      commissionsToDisplay.value.push(commission);
    }
  })
})

watch(folderToDisplay, (newFolderToDisplay) => {
  commissionsToDisplay.value = [];
  commissions.value.forEach(commission => {
    if(commission.year == newFolderToDisplay) {      
      commissionsToDisplay.value.push(commission);
    }
  })
})
</script>

<style>
.view-container {
  display: flex; 
  flex-direction: column;
  width: 100%;
  padding: 30px;
}

.title {
  margin-bottom: 30px;
}

.data-container {
  background-color: white;
  min-height: 600px;
  min-width: 800px;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: scroll;
}

.folders-by-year {
  display: flex;
}

.year-folder {
  font-size: 14px;
  margin-bottom: 10px;
  background-color: rgb(238, 238, 238);
  width: fit-content;
  border: 1px solid lightgrey;
  padding: 4px;
  border-radius: 3px;
  margin-right: 20px;
}

.year-folder:hover {
  cursor: pointer;
}

.commissions-list {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto auto;
  width: 100%;
}

.state-select {
  margin: 0;
  padding: 0;
  width: fit-content;
  font-size: 12px;
}

.list-name {
  display: flex;
  justify-content: center;
  font-size: 14px;
  border-bottom: 1px solid lightgrey;
  padding: 5px 0;
}

.first-list {
  border-top-left-radius: 10px;
}

.last-list {
  border-top-right-radius: 10px;
}

.item {
  display: flex;
  justify-content: center;
  font-size: 14px;
  padding: 5px 0;
}

.commission-id:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>