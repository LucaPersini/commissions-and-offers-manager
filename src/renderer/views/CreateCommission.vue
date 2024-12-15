<template>
  <div class="view-container">
    <div class="title">Crea commessa</div>
    <div class="data-container">
      <div class="form">
        <div class="input-title">Anno</div>
        <input type="number" v-model="year" min="2000" max="9999">
        <div class="input-title">Committente</div>
        <input type="text" v-model="client">
        <div class="input-title">Descrizione</div>
        <input type="text" v-model="description">
        <div class="input-title">Codice lavoro</div>
        <select v-model="commissionCode">
          <option value="W">W - installazione</option>
          <option value="F">F - fornitura</option>
          <option value="P">P - progettazione</option>
        </select>
        <div class="input-title">Tipologia commessa</div>
        <select v-model="commissionType">
          <option value="Civile">Civile</option>
          <option value="Navale">Navale</option>
          <option value="Industriale">Industriale</option>
        </select>
        <div class="input-title">Data di accettazione</div>
        <input type="date" v-model="acceptanseDate">
        <div class="input-title">Data di consegna prevista</div>
        <input type="date" v-model="deliveryDate"> 
        <div class="input-title"><p class="select-folder-text" @click="selectSavingFolder">Seleziona cartella di salvataggio:</p> {{ savingFolder }} </div><br>
        <div>{{ id }} - {{ commissionCode }} - {{ client }} - {{ description }}</div><br>
        <div v-if="error" class="error-text">Compilare tutti i dati obbligatori</div><br>
        <button class="save-btn" @click="saveCommission">Salva commessa</button>
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
let commissionCode = ref('');
let commissionType = ref('');
let acceptanseDate = ref('');
let deliveryDate = ref('');
let state = 'Da iniziare';
let savingFolder = ref('');
let error = ref(false);
let commissionNumber;
let folderName;

watch(year, async(newYear) => {
  const result = await window.API.getNumberOfCommissionsByYear(newYear);
  commissionNumber = result.data.count + 1;
  commissionNumber = commissionNumber.toString();
  while(commissionNumber.length < 4) {
    commissionNumber = '0' + commissionNumber;
  }
  id.value = `C${newYear.toString().slice(-2)}-${commissionNumber}`;
})

async function selectSavingFolder() {
  const result = await window.API.selectSavingFolder();
  if(result.success) {
    savingFolder.value = result.data.filePaths;
  }
}

async function saveCommission() {
  error.value = false;

  let valuesToCheck = [
  year.value,
  client.value,
  description.value,
  commissionCode.value,
  commissionType.value,
  acceptanseDate.value,
  deliveryDate.value,
  savingFolder.value
];

  valuesToCheck.forEach(value => {
  if(value == '') {
    error.value = true;
    return;
  } 
});

if(!error.value) {
  folderName = `${id.value}-${commissionCode.value}-${client.value}-${description.value}`;

  const newCommission = {
    id: id.value,
    year: year.value.toString(),
    client: client.value,
    description: description.value,
    commissionCode: commissionCode.value,
    commissionType: commissionType.value,
    acceptanseDate: acceptanseDate.value,
    deliveryDate: deliveryDate.value,
    state: state,
    folder: `${savingFolder.value}/${folderName}`
  }

  const result = await window.API.addCommission(newCommission);
  if(result.success) {
    alert('Commessa salvata');
    router.push('/');
  } else {
    alert(result.error);
  }
}
}
</script>

<style>
.data-container {
  display: flex;
}

.form {
  width: fit-content;
  margin: auto
}

input, select {
  margin: 10px 0;
  width: 300px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  padding: 8px;
}

.input-title {
  font-size: 14px;
}

.save-btn {
  background-color: #1e3a8a;
  color: #f9fafb;
  padding: 5px;
  border: none;
  border-radius: 3px;
}

.save-btn:hover {
  background-color: #2563eb;
}

.error-text {
  color: red;
}

.select-folder-text {
  text-decoration: underline;
  width: fit-content;
}

.select-folder-text:hover {
  cursor: pointer;
}
</style>