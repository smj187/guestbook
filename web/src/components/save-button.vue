<script setup lang="ts">
import { useLexicalComposer } from 'lexical-vue';
import { ref } from 'vue';
import { $generateHtmlFromNodes } from '@lexical/html';
import entryService from "../services/entryService";

const savedContent = ref('');
const editor = useLexicalComposer()

function onSaveAsync() {
    editor.update(async () => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        savedContent.value = htmlString;

        try {
            const result = await entryService.createEntry("this", htmlString);
            console.log(result)
        } catch (error) {
            console.error('error:', error);
        }
    });
}
</script>

<template>
    <button class="p-3 bg-blue-500" @click="onSaveAsync">save content</button>
</template>