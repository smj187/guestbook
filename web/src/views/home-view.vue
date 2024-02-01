<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ApiResponse, GuestbookEntry } from "../types";
import entryService from "../services/entryService";
import { formatDate } from '../utils/format';
const data = ref<GuestbookEntry[]>([]);
const currentPage = ref(1);
const pageSize = 4;
const totalPages = ref(0);

const columns = ref(2)
const rows = ref(2)

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
  <div className="flex justify-center items-center min-h-screen bg-[#f3e9dc] p-10 relative">

    <!-- layout -->
    <img src="../assets/48945.svg" class="absolute top-3 left-3 w-32" alt="Vue logo" />
    <img src="../assets/48945.svg" class="absolute top-3 right-3 w-32 transform rotate-90" alt="Vue logo" />
    <img src="../assets/48945.svg" class="absolute bottom-3 right-3 w-32 transform rotate-180" alt="Vue logo" />
    <img src="../assets/48945.svg" class="absolute bottom-3 left-3 w-32 transform -rotate-90" alt="Vue logo" />

    <h1 className="text-3xl absolute top-4 left-1/2 transform -translate-x-1/2 font-kalam">
      Guest Book
    </h1>

    <!-- content -->
    <div class="absolute inset-0 flex flex-col p-16 pb-5">
      <div class=" h-full w-full p-0 py-3">
        <div class="grid grid-cols-2 gap-6 h-full">
          <div v-for="entry in data" :key="entry.id" class="flex flex-col">
            <div class="flex flex-col bg-[#FAF7F4] rounded-lg py-3 px-5 flex-grow">
              <div class="flex-grow">
                <div class="text-[#70912E] text-2xl font-medium">{{ entry.name }}</div>
                <div class="text-[#9C907D] mt-0.5">{{ formatDate(entry.created_at, false) }}</div>
                <div class="flex-grow overflow-auto">
                  <template v-if="entry.message.startsWith('data:image')">
                    <!-- <img :src="entry.message" class="object-contain  mx-auto max-h-40" /> -->
                  </template>
                  <template v-else>
                    <div v-html="entry.message" class="mt-2"></div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- pagination -->
      <div class="flex mt-4 items-center space-x-9 mx-auto">
        <div class="flex space-x-1.5">
          <button @click="goToFirstPage" :disabled="currentPage === 1"
            class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-10 inline-flex items-center justify-center py-1.5 rounded  text-white   disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
            </svg>

          </button>
          <button @click="goToPreviousPage" :disabled="currentPage === 1"
            class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-10 inline-flex items-center justify-center py-1.5 rounded  text-white   disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        <div class="font-kalam">
          {{ currentPage }} / {{ totalPages }}
        </div>
        <div class="flex space-x-1.5">
          <button @click="goToNextPage" :disabled="currentPage === totalPages"
            class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-10 inline-flex items-center justify-center py-1.5 rounded  text-white   disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button @click="goToLastPage" :disabled="currentPage === totalPages"
            class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-10 inline-flex items-center justify-center py-1.5 rounded  text-white   disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
