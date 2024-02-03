<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ApiResponse, GuestbookEntry } from "../types";
import entryService from "../services/entryService";
import { formatDate } from '../utils/format';
import { debounce } from '../utils/debounce';
import DispayMessage from "../components/display-message.vue"

const data = ref<GuestbookEntry[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);

const contentRef = ref<HTMLDivElement>()
const columns = ref(2)
const rows = ref(3);

async function loadEntriesAsync() {
  try {
    const result: ApiResponse = await entryService.fetchEntries(columns.value * rows.value, currentPage.value);
    data.value = result.data;
    const entriesShortage = (columns.value * rows.value) - data.value.length;
    if (entriesShortage > 0) {

      const fakeData = Array.from({ length: entriesShortage }, (_, i) => ({
        id: i,
        name: "Placeholder Name",
        message: "This is a placeholder message",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_placeholder: true
      } as GuestbookEntry));


      data.value = [...data.value, ...fakeData];
    }
    totalPages.value = result.pagination.last_page;
  } catch (error) {
    console.error('error:', error);
  }
}

async function changePageAsync(page: number) {
  currentPage.value = page;
  await loadEntriesAsync();
}

function goToFirstPage() {
  changePageAsync(1);
}

function goToPreviousPage() {
  if (currentPage.value <= 1) return
  changePageAsync(currentPage.value - 1);
}

function goToNextPage() {
  if (currentPage.value >= totalPages.value) return
  changePageAsync(currentPage.value + 1);
}

function goToLastPage() {
  changePageAsync(totalPages.value);
}


const debouncedUpdateLayoutAsync = debounce(async () => {
  if (!contentRef.value) return;

  const columnWidth = 350;
  const baseItemHeight = 256;

  const contentWidth = contentRef.value.offsetWidth;
  const numColumns = Math.floor(contentWidth / columnWidth);
  columns.value = Math.max(numColumns, 1);

  const contentHeight = contentRef.value.offsetHeight;
  const numRows = Math.floor(contentHeight / baseItemHeight);
  rows.value = Math.max(numRows - 1, 1);

  currentPage.value = 1
  await loadEntriesAsync();
}, 500);

const resizeObserver = new ResizeObserver(debouncedUpdateLayoutAsync);

onMounted(() => {
  if (!contentRef.value) return

  resizeObserver.observe(contentRef.value);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});

</script>


<template>
  <div className="flex justify-center items-center min-h-screen bg-[#f3e9dc] p-10 relative ">

    <div class="w-full h-full container">
      <!-- layout -->
      <img src="../assets/48945.svg" class="absolute top-3 left-3 w-32" alt="Vue logo" />
      <img src="../assets/48945.svg" class="absolute top-3 right-3 w-32 transform rotate-90" alt="Vue logo" />
      <img src="../assets/48945.svg" class="absolute bottom-3 right-3 w-32 transform rotate-180" alt="Vue logo" />
      <img src="../assets/48945.svg" class="absolute bottom-3 left-3 w-32 transform -rotate-90" alt="Vue logo" />

      <h1 className="text-3xl absolute top-4 left-1/2 transform -translate-x-1/2 font-kalam">
        Guest Book
      </h1>

      <!-- content -->
      <div ref="contentRef" class="absolute inset-0 flex flex-col p-16 pb-16 sm:pb-6">
        <div class=" h-full w-full p-0 py-3">
          <div class="grid gap-6 h-full" :style="`grid-template-columns: repeat(${columns}, minmax(0, 1fr));`">
            <div v-for="entry in data" :key="entry.id" class="flex flex-col h-full"
              :class="entry.is_placeholder && 'opacity-0 pointer-events-none cursor-default select-none'">
              <div class="flex flex-col bg-white rounded-lg py-3 px-5 h-full">
                <div class="flex-grow h-full">
                  <div class="text-[#70912E] text-2xl font-medium">{{ entry.name }}</div>
                  <div class="text-[#9C907D] mt-0.5">{{ formatDate(entry.created_at, false) }}</div>
                  <div class=" " :style="`height: calc(100%  - 4rem)`">
                    <DispayMessage :entry="entry" />
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
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
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
  </div>
</template>
