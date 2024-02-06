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
const isLoading = ref(false)

async function loadEntriesAsync() {
  try {
    isLoading.value = true
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
  } finally {
    isLoading.value = false
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

  isLoading.value = true

  resizeObserver.observe(contentRef.value);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});

</script>


<template>
  <div ref="contentRef" class="absolute inset-0 flex flex-col p-16 pb-16 sm:pb-6">
    <!-- menu buttons -->
    <div class="flex space-x-2 w-full justify-center py-3">
      <router-link to="/">
        <button
          class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-[142px] text-white inline-flex justify-center space-x-2.5 items-center text font-semibold py-2 px-4 rounded shadow  focus:outline-none focus:ring-2 focus:ring-[hsl(80,47%,44%)] focus:ring-opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span>
            View All
          </span>
        </button>
      </router-link>

      <router-link to="/create">
        <button
          class="bg-transparent hover:bg-[hsl(80,47%,44%)] hover:text-white hover:fill-white w-[142px] hover:outline-[hsl(80,47%,44%)] fill-slate-600 text-slate-600 inline-flex space-x-2 justify-center outline outline-slate-600/30  outline-2 items-center text font-semibold py-2 px-4 rounded shadow  focus:outline-none focus:ring-2 focus:ring-[hsl(80,47%,44%)] focus:ring-opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-4 h-4 ">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
          <span>Create New</span>
        </button>
      </router-link>
    </div>

    <div class=" h-full w-full p-0 py-3">

      <!-- loading spinner -->
      <template v-if="isLoading">
        <div class="w-full h-full flex justify-center items-center flex-col space-y-3">
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin  fill-[hsl(80,47%,44%)]" viewBox="0 0 100 101"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="text-sm text-slate-600/60">Loading...</span>
        </div>
      </template>

      <!-- entry grid -->
      <template v-else>
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
      </template>
    </div>

    <!-- pagination -->
    <div class="flex mt-4 items-center space-x-9 mx-auto" :class="isLoading && 'opacity-0'">
      <div class="flex space-x-1.5">
        <button @click="goToFirstPage" :disabled="currentPage === 1"
          class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-10 inline-flex items-center justify-center py-1.5 rounded  text-white   disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
          </svg>
        </button>
        <button @click="goToPreviousPage" :disabled="currentPage === 1"
          class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-10 inline-flex items-center justify-center py-1.5 rounded  text-white   disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-5 h-5">
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <button @click="goToLastPage" :disabled="currentPage === totalPages"
          class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-10 inline-flex items-center justify-center py-1.5 rounded  text-white   disabled:opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
