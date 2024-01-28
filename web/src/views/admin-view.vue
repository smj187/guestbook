<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ApiResponse, GuestbookEntry } from '../types';
import entryService from '../services/entryService';
import { formatDate } from '../utils/format';
import ConfirmModal from '../components/confirm-delete-modal.vue';

const data = ref<GuestbookEntry[]>([]);
const currentPage = ref(1);
const pageSize = 10;
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



const deleteEntryAsync = async (id: number) => {
    await entryService.deleteEntry(id)
    data.value = data.value.filter(x => x.id !== id)
}

const isConfirmModalOpen = ref(false);
const entryToDelete = ref<GuestbookEntry | null>(null);

function openConfirmModal(entry: GuestbookEntry) {
    entryToDelete.value = entry;
    isConfirmModalOpen.value = true;
}

function closeConfirmModal() {
    isConfirmModalOpen.value = false;
    entryToDelete.value = null;
}

async function confirmDelete() {
    if (!entryToDelete.value) return

    await deleteEntryAsync(entryToDelete.value.id);
    closeConfirmModal();
}



</script>

<template>
    <ConfirmModal v-if="isConfirmModalOpen" :entry="entryToDelete" @confirm="confirmDelete" @cancel="closeConfirmModal" />

    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
        <table class="min-w-full table-auto">
            <thead>
                <tr class="bg-gray-100">
                    <th class="px-4 py-2 text-left">ID</th>
                    <th class="px-4 py-2 text-left">Name</th>
                    <th class="px-4 py-2 text-left">Message</th>
                    <th class="px-4 py-2 text-left">Created At</th>
                    <th class="px-4 py-2 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in data" :key="entry.id" class="border-b">
                    <td class="px-4 py-2">{{ entry.id }}</td>
                    <td class="px-4 py-2">{{ entry.name }}</td>
                    <td class="px-4 py-2">{{ entry.message }}</td>
                    <td class="px-4 py-2">{{ formatDate(entry.created_at) }}</td>
                    <td class="px-4 py-2">
                        <button @click="openConfirmModal(entry)"
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="flex justify-between items-center mt-4">
            <div>
                <button @click="goToFirstPage" :disabled="currentPage === 1"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">&lt;&lt;</button>
                <button @click="goToPreviousPage" :disabled="currentPage === 1"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">&lt;</button>
            </div>
            <div>
                Page {{ currentPage }} of {{ totalPages }}
            </div>
            <div>
                <button @click="goToNextPage" :disabled="currentPage === totalPages"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">&gt;</button>
                <button @click="goToLastPage" :disabled="currentPage === totalPages"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50">&gt;&gt;</button>
            </div>
        </div>
    </div>
</template>
  