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
    <div>
        <button @click="onSaveAsync"
            class="font-oswald tracking-wider text-slate-800 hover:text-slate-600 bg-white rounded-lg py-2.5 px-5">
            save
        </button>
    </div>
</template>