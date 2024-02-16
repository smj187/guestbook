<template>
  <div class="absolute top-3 left-3 lg:top-9 lg:left-9 z-50">
    <router-link to="/">
      <button
        class="flex z-50 items-center font-oswald tracking-wide text-slate-700 hover:text-slate-800 cursor-pointer p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4 mr-1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>
    </router-link>
  </div>

  <ConfirmModal
    v-if="isConfirmModalOpen"
    :entry="entryToDelete"
    @confirm="confirmDelete"
    @cancel="closeConfirmModal"
  />

  <!-- the entries table -->
  <div class="absolute inset-0 flex flex-col p-16 pb-16 sm:pb-6">
    <div class="mx-auto w-full h-full my-auto pt-12">
      <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div class="flex flex-col h-full w-full overflow-y-auto max-h-[80vh]">
        <table class="min-w-full table-auto">
          <thead>
            <tr class="bg-white">
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left w-56">Name</th>
              <th class="px-4 py-2 text-left">Message</th>
              <th class="px-4 py-2 text-left">Created At</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in data"
              :key="entry.id"
              class="border-b border-slate-400"
            >
              <td class="px-4 py-2">{{ entry.id }}</td>
              <td class="px-4 py-2 w-56">{{ entry.name }}</td>
              <td class="px-4 py-2 max-h-64 overflow-auto h-full">
                <template v-if="entry.message.startsWith('data:image')">
                  <img
                    :src="entry.message"
                    class="w-full h-full max-w-44 object-contain"
                  />
                </template>
                <template v-else>
                  <div v-html="entry.message" class="h-full py-3"></div>
                </template>
              </td>
              <td class="px-4 py-2 w-44">
                {{ formatDate(entry.created_at) }}
              </td>
              <td class="px-4 py-2">
                <button
                  @click="openConfirmModal(entry)"
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
            <template v-if="data.length === 0">
              <tr>
                no entries yet
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- the pagination is only visible if there are any pages to used the pagination feature -->
      <template v-if="totalPages > 1">
        <div class="flex justify-between items-center mt-4">
          <div>
            <button
              @click="goToFirstPage"
              :disabled="currentPage === 1"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                />
              </svg>
            </button>
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </div>
          <div>Page {{ currentPage }} of {{ totalPages }}</div>
          <div>
            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
            <button
              @click="goToLastPage"
              :disabled="currentPage === totalPages"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ApiResponse, GuestbookEntry } from "../types";
import entryService from "../services/entryService";
import { formatDate } from "../utils/format";
import ConfirmModal from "../components/confirm-delete-modal.vue";

const data = ref<GuestbookEntry[]>([]);
const currentPage = ref(1);
const pageSize = 20; // for now just a hardcoded value
const totalPages = ref(0);
const isConfirmModalOpen = ref(false);
const entryToDelete = ref<GuestbookEntry | null>(null);

onMounted(async () => {
  // load the data when the page loads
  await fetchDataAsync();
});

async function fetchDataAsync() {
  try {
    const result: ApiResponse = await entryService.listEntriesAsync(
      pageSize,
      currentPage.value
    );
    data.value = result.data;
    totalPages.value = result.pagination.last_page;
  } catch (error) {
    console.error("error:", error);
  }
}

// pagination methods
function changePage(page: number) {
  currentPage.value = page;
  fetchDataAsync();
}

function goToFirstPage() {
  changePage(1);
}

function goToPreviousPage() {
  if (currentPage.value <= 1) return;
  changePage(currentPage.value - 1);
}

function goToNextPage() {
  if (currentPage.value >= totalPages.value) return;
  changePage(currentPage.value + 1);
}

function goToLastPage() {
  changePage(totalPages.value);
}

// register the currently active entry
function openConfirmModal(entry: GuestbookEntry) {
  entryToDelete.value = entry;
  isConfirmModalOpen.value = true;
}

function closeConfirmModal() {
  isConfirmModalOpen.value = false;
  entryToDelete.value = null;
}

// delete an entry after entring the password correctly
async function confirmDelete() {
  if (!entryToDelete.value) return;

  const id = entryToDelete.value.id;
  await entryService.deleteEntryAsync(id);
  data.value = data.value.filter((x) => x.id !== id);
  closeConfirmModal();
}
</script>
