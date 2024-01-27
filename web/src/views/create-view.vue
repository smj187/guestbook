<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const message = ref('');
const router = useRouter();

const createEntry = async () => {
    try {
        const response = await fetch('http://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.value,
                message: message.value,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        router.push('/');
    } catch (error) {
        console.error('Error creating entry:', error);
    }
};
</script>


<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Create Entry</h1>
        <form @submit.prevent="createEntry">
            <div class="mb-4">
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input v-model="name" type="text" id="name"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required>
            </div>
            <div class="mb-4">
                <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message:</label>
                <textarea v-model="message" id="message"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required></textarea>
            </div>
            <button type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create</button>
    </form>
</div></template>
  