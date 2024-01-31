<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ApiResponse, GuestbookEntry } from "../types";
import entryService from "../services/entryService";
import { formatDate } from '../utils/format';

const data = ref<GuestbookEntry[]>([]);
const currentPage = ref(1);
const pageSize = 4;
const totalPages = ref(0);

onMounted(async () => {
  await fetchData()
});

async function fetchData() {
  try {
    const result: ApiResponse = await entryService.fetchEntries(pageSize, currentPage.value);
    data.value = result.data;
    totalPages.value = result.pagination.last_page;
  } catch (error) {
    console.error('error:', error);
  }
}

function changePage(page: number) {
  currentPage.value = page;
  fetchData();
}

function goToFirstPage() {
  changePage(1);
}

function goToPreviousPage() {
  if (currentPage.value <= 1) return
  changePage(currentPage.value - 1);
}

function goToNextPage() {
  if (currentPage.value >= totalPages.value) return
  changePage(currentPage.value + 1);
}

function goToLastPage() {
  changePage(totalPages.value);
}


</script>


<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-2 gap-4">
      <div v-for="entry in data" :key="entry.id" class="border p-4">
        <div>{{ entry.name }}</div>
        <div v-html="entry.message"></div>
        <div>{{ formatDate(entry.created_at) }}</div>
      </div>
    </div>
    <div class="flex mt-4">
      <button @click="goToFirstPage" :disabled="currentPage === 1"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">&lt;&lt;</button>
      <button @click="goToPreviousPage" :disabled="currentPage === 1"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">&lt;</button>
      <div>
        {{ currentPage }} / {{ totalPages }}
      </div>
      <button @click="goToNextPage" :disabled="currentPage === totalPages"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">></button>
      <button @click="goToLastPage" :disabled="currentPage === totalPages"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">>></button>
    </div>
  </div>
</template>
