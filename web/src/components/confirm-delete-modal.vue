<template>
  <div
    class="absolute inset-0 bg-gray-600 bg-opacity-50 z-30 flex justify-center items-center"
  >
    <div class="bg-white p-4 rounded">
      <p>Are you sure you want to delete this entry?</p>
      <input
        type="password"
        v-model="password"
        placeholder="Enter password"
        class="mt-4 p-2 border rounded w-full"
      />

      <div class="flex justify-end mt-4">
        <button
          @click="closeModal"
          class="mr-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          @click="confirmDeletion"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { GuestbookEntry } from "../types";

const ADMIN_PASSWORD = "admin";

defineProps({ entry: Object as () => GuestbookEntry | null });
const emits = defineEmits(["confirm", "cancel"]);
const password = ref("");

function confirmDeletion() {
  if (password.value === ADMIN_PASSWORD) {
    emits("confirm");
  } else {
    alert("Incorrect password!");
  }
}

function closeModal() {
  emits("cancel");
}
</script>
