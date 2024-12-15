<template>
  <div class="view-container">
    <div class="title">Offerte</div>
    <div class="folders-by-year">
      <div class="year-folder" v-for="data in foldersByYears" @click="changeFolderToDisplay(data.year)"> {{ data.year }}</div>
    </div>
    <div class="data-container">
      <div class="offers-list">
        <div class="id-list">
          <div class="list-name first-list">ID</div>
          <div v-for="offer in offersToDisplay" class="item offer-id" @click="openCommissionFolder(offer.folder)">{{ offer.id }}</div>
        </div>
        <div class="client-list">
          <div class="list-name">Cliente</div>
          <div v-for="offer in offersToDisplay" class="item">{{ offer.client }}</div>
        </div>
        <div class="offerCode-list">
          <div class="list-name">Codice offerta</div>
          <div v-for="offer in offersToDisplay" class="item">{{ offer.offerCode }}</div>
        </div>
        <div class="descriptions-list">
          <div class="list-name">Descrizione</div>
          <div v-for="offer in offersToDisplay" class="item">{{ offer.description }}</div>
        </div>
        <div class="offerType-list">
          <div class="list-name">Tipologia offerta</div>
          <div v-for="offer in offersToDisplay" class="item">{{ offer.offerType }}</div>
        </div>
        <div class="receptionDate-list">
          <div class="list-name">Data di ricezione</div>
          <div v-for="offer in offersToDisplay" class="item">{{ offer.receptionDate }}</div>
        </div>
        <div class="state-list">
          <div class="list-name">Stato</div>
          <div class="item" v-for="offer in offersToDisplay">
            <select class="state-select" v-model="offer.state" @change="changeOfferState(offer)">ù
              <option :value="offer.state" default>{{ offer.state }}</option>
              <option value="Da inviare">Da inviare</option>
              <option value="Inviata"> Inviata</option>
              <option value="Eliminata">Eliminata</option>
            </select>
          </div>
        </div>
        <div class="commission-state-list">
          <div class="list-name last-list">Commessa</div>
          <div class="item" v-for="offer in offersToDisplay">
            <div v-if="offer.commission == 'true'">{{ offer.commissionId }}</div>
            <div v-else><p>Crea</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw, watch } from 'vue';

let offers = ref([]);
let foldersByYears = ref([]);
let folderToDisplay = ref('');
let offersToDisplay = ref([]);

async function getAllOffers() {
  const result = await window.API.getAllOffers();
  if(result.success) {
    offers.value = result.data;
    console.log(result.data)
  } else {
    alert(result.error);
  }
}

async function getFoldersByYear() {
  if(offers.value.length > 0) {
    const result = await window.API.getOffersYears();
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

async function changeOfferState(updatedOffer) {
  const offerToSend = toRaw(updatedOffer);
  const result = await window.API.updateOffer(offerToSend);
  console.log(result)
  if(!result.success) {
    console.log(result)
    alert(result);
  }
}

onMounted(async () => {
  await getAllOffers();
  await getFoldersByYear();
  offersToDisplay.value = [];
  offers.value.forEach(offer => {
    if(offer.year == folderToDisplay.value) {
      offersToDisplay.value.push(offer);
    }
  })
})

watch(folderToDisplay, (newFolderToDisplay) => {
  offersToDisplay.value = [];
  offers.value.forEach(offer => {
    if(offer.year == newFolderToDisplay) {
      offersToDisplay.value.push(offer);
    }
  })
})
</script>

<style>
.offers-list {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto auto;
  width: 100%;
}
</style>