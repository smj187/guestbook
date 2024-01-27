<script setup lang="ts">
import { ref, onMounted } from 'vue';

type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
};

type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type ApiResponse = {
  data: GuestbookEntry[];
  pagination: Pagination;
};


const data = ref<GuestbookEntry[]>([]);
const currentPage = ref(1);
const pageSize = 4;
const totalPages = ref(0);

const fetchData = async () => {
  try {
    const response = await fetch(`http://localhost:8000?pageSize=${pageSize}&page=${currentPage.value}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result: ApiResponse = await response.json();
    data.value = result.data;
    totalPages.value = result.pagination.last_page;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


const changePage = (page: number) => {
  currentPage.value = page;
  fetchData();
};

const goToFirstPage = () => {
  changePage(1);
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1);
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1);
  }
};

const goToLastPage = () => {
  changePage(totalPages.value);
};


onMounted(fetchData);
</script>


<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-2 gap-4">
      <div v-for="entry in data" :key="entry.id" class="border p-4">
        <div>{{ entry.name }}</div>
        <div>{{ entry.message }}</div>
        <div>{{ entry.created_at }}</div>
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
</div></template>
