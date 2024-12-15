<template>
  <div class="view-container">
    <div class="title">Crea offerta</div>
    <div class="data-container">
      <div class="form">
        <div class="input-title">Anno</div>
        <input type="number" v-model="year" min="2000" max="9999">
        <div class="input-title">Committente</div>
        <input type="text" v-model="client">
        <div class="input-title">Descrizione</div>
        <input type="text" v-model="description">
        <div class="input-title">Codice lavoro</div>
        <select v-model="offerCode">
          <option value="W">W - installazione</option>
          <option value="F">F - fornitura</option>
          <option value="P">P - progettazione</option>
        </select>
        <div class="input-title">Tipologia offerta</div>
        <select v-model="offerType">
          <option value="Civile">Civile</option>
          <option value="Navale">Navale</option>
          <option value="Industriale">Industriale</option>
        </select>
        <div class="input-title">Data di ricezione</div>
        <input type="date" v-model="receptionDate">
        <div class="input-title"><p class="select-folder-text" @click="selectSavingFolder">Seleziona cartella di salvataggio:</p>{{ savingFolder }}</div>
        <div>{{ id }} - {{ offerCode }} - {{ client }} - {{ description }}</div>
        <div v-if="error" class="error-text">Compilare tutti i dati obbligatori</div>
        <button class="save-btn" @click="saveOffer">Salva offerta</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let id = ref('');
let year = ref('');
let client = ref('');
let description = ref('');
let offerCode = ref('');
let offerType = ref('');
let receptionDate = ref('');
let state = 'Da inviare';
let savingFolder = ref('');
let error = ref(false);
let offerNumber;
let folderName;

watch(year, async (newYear) => {
  const result = await window.API.getNumberOfOffersByYear(newYear);
  offerNumber = result.data.count + 1;
  offerNumber = offerNumber.toString();
  while (offerNumber.length < 4) {
    offerNumber = '0' + offerNumber;
  }
  id.value = `P${newYear.toString().slice(-2)}-${offerNumber}`;
})

async function selectSavingFolder() {
  const result = await window.API.selectSavingFolder();
  if(result.success) {
    savingFolder.value = result.data.filePaths;
  }
}

async function saveOffer() {
  error.value = false;

  let valuesToCheck = [
    year.value,
    client.value,
    description.value,
    offerCode.value,
    offerType.value,
    receptionDate.value,
    savingFolder.value
  ];

  valuesToCheck.forEach(value => {
  if(value == '') {
    error.value = true;
    return;
    } 
  });

  if(!error.value) {
    folderName = `${id.value}-${offerCode.value}-${client.value}-${description.value}`;

  const newOffer = {
    id: id.value,
    year: year.value.toString(),
    client: client.value,
    description: description.value,
    offerCode: offerCode.value,
    offerType: offerType.value,
    receptionDate: receptionDate.value,
    state: state,
    folder: `${savingFolder.value}/${folderName}`,
    commission: 'false',
    commissionId: '',
    commissionFolder: ''
  }

  const result = await window.API.addOffer(newOffer);
  if(result.success) {
    alert('Offerta salvata');
    router.push('/offers');
  } else {
    alert(result.error);
    console.log(result)
  }
  }  
}
</script>

<style>
.select-folder-text {
  margin: 10px 0;
}
.error-text {
  margin: 10px 0;
}

.save-btn {
  margin: 10px 0;
}
</style>