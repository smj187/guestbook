<script setup lang="ts">
import { useLexicalComposer } from 'lexical-vue';
import { ref } from 'vue';
import { $generateHtmlFromNodes } from '@lexical/html';
import entryService from "../services/entryService";
import { useRouter } from 'vue-router';

const savedContent = ref('');
const editor = useLexicalComposer()
const router = useRouter();

function onSaveAsync() {
    editor.update(async () => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        savedContent.value = htmlString;

        try {
            const result = await entryService.createEntry("this", htmlString);
            console.log(result)

            router.push('/');
        } catch (error) {
            console.error('error:', error);
        }
    });
}
</script>

<template>
    <button
        class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)]  w-full text-white  inline-flex justify-center space-x-3 items-center text-lg font-semibold py-3 px-4 rounded shadow  focus:outline-none focus:ring-2 focus:ring-[hsl(80,47%,44%)] focus:ring-opacity-50"
        @click="onSaveAsync">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Save Entry</button>
</template>