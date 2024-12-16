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
          <div v-for="offer in offersToDisplay" class="item offer-id" @click="openFolder(offer.folder)">{{ offer.id }}</div>
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
            <div v-if="offer.commission == 'true'" @click="openFolder(offer.commissionFolder)" class="commission-id">{{ offer.commissionId }}</div>
            <div v-else><p class="create-commission-btn" @click="createCommissionFromOffer(offer)">Crea</p></div>
          </div>
        </div>
      </div>
    </div>    
  </div>
  <div class="create-commission-background" v-if="areUCreatingACommission"></div>
  <div class="create-commission-alert" v-if="areUCreatingACommission">
    <div>
      <p class="alert-text">Creare la commessa {{ commissionFolderName }}</p>
      <p class="alert-text select-folder-btn" @click="selectSavingFolder">Seleziona cartella di salvataggio</p>
      <p>{{ commissionToSend.folder }}</p>
      <p v-if="folderNotSelected" class="error-text">Seleziona la cartella di salvataggio</p>
    </div>
    <div class="btn-container">
      <button class="ok-btn" @click="sendCommission(commissionToSend, offerToUpdate)">Ok</button>
      <button class="cancel-btn" @click="cancelCommissionCreation">Annulla</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let offers = ref([]);
let foldersByYears = ref([]);
let folderToDisplay = ref('');
let offersToDisplay = ref([]);
let areUCreatingACommission = ref(false);
let commissionToSend = ref();
let commissionFolderName = ref('');
let folderNotSelected = ref(false);
let offerToUpdate;

async function getAllOffers() {
  const result = await window.API.getAllOffers();
  if(result.success) {
    offers.value = result.data;
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

async function openFolder(path) {
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
    alert(result);
  }
}

async function createCommissionFromOffer(offer) {
  const commissionNumberResult = await window.API.getNumberOfCommissionsByYear(offer.year);
  offerToUpdate = offer;
  let commissionNumber;
  if(commissionNumberResult.success) {
    commissionNumber = commissionNumberResult.data.count + 1;
  } else {
    alert(commissionNumberResult.err);
  }
  while(commissionNumber.toString().length < 4) {
    commissionNumber = '0' + commissionNumber;
  }

  const id = `C${offer.year.toString().slice(-2)}-${commissionNumber}`;
  const date = new Date();
  const acceptanseDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  
  commissionToSend.value = {
    id: id,
    year: offer.year.toString(),
    client: offer.client,
    description: offer.description,
    commissionCode: offer.offerCode,
    commissionType: offer.offerType,
    acceptanseDate: acceptanseDate,
    state: 'Da iniziare',
    folder: ''
  }

  commissionFolderName.value = `${id}-${commissionToSend.value.commissionCode}-${commissionToSend.value.client}-${commissionToSend.value.description}`;
  areUCreatingACommission.value = true;
}

async function selectSavingFolder() {
  const result = await window.API.selectSavingFolder();
  if(result.success) {
    commissionToSend.value.folder = `${result.data.filePaths}/${commissionFolderName.value}`;
  } else {
    alert(result);
  }
}

async function cancelCommissionCreation() {
  commissionFolderName.value = '';
  commissionToSend.value = '';
  areUCreatingACommission.value = false;
}

async function sendCommission(commission, offerToUpdate) { 
  if(commission.folder == '') {
    folderNotSelected.value = true;
  } else {
    const rawCommission = toRaw(commission);
    const commissionResult = await window.API.addCommission(rawCommission);
    offerToUpdate.commission = 'true';
    offerToUpdate.commissionId = commission.id;
    offerToUpdate.commissionFolder = commission.folder;
    const rawOffer = toRaw(offerToUpdate);
    const offerResult = await window.API.updateOffer(rawOffer);
    if(commissionResult.success && offerResult.success) {
      alert('Commessa salvata');
      areUCreatingACommission.value = 'false';
      router.push('/');
    } else {
      alert(result.err);
    }
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

.offer-id {
  width: fit-content;
  margin: auto;
}

.offer-id:hover {
  cursor: pointer;
  text-decoration: underline;
}

.create-commission-btn:hover {
  cursor: pointer;
  text-decoration: underline;
}

.create-commission-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: black;
  opacity: 0.5;
}

.create-commission-alert {
  position: absolute;
  background-color: white;
  width: fit-content;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 10px;
}

.alert-text {
  margin: 10px;
}

.btn-container {
  margin: 10px;
  display: flex;
  justify-content: center;
}

.ok-btn {
  padding: 5px;
  margin-right: 10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.cancel-btn {
  padding: 5px;
  margin-left: 10px;
  background-color: red;
  border: none;
  color: white;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.select-folder-btn {
  text-decoration: underline;
}

.select-folder-btn:hover {
  cursor: pointer;
}
</style>