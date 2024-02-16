<template>
  <div class="flex space-x-3">
    <input
      type="text"
      class="bg-white p-3 rounded-lg"
      placeholder="Your name"
      v-model="name"
    />
    <button
      @click="onSaveAsync"
      :disabled="name.trim().length === 0 || isEditorEmpty"
      class="font-oswald tracking-wider text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-600 bg-white rounded-lg py-2.5 px-5"
    >
      save
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLexicalComposer } from "lexical-vue";
import { onMounted, ref } from "vue";
import { $generateHtmlFromNodes } from "@lexical/html";
import entryService from "../services/entryService";
import { useRouter } from "vue-router";
import { $getRoot } from "lexical";

const savedContent = ref("");
const editor = useLexicalComposer();
const router = useRouter();

const name = ref("");
const isEditorEmpty = ref(true);

onMounted(() => {
  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      // parse the editor sate to check if there is any content in it
      const stringifiedEditorState = JSON.stringify(
        editor.getEditorState().toJSON()
      );
      const parsedEditorState = editor.parseEditorState(stringifiedEditorState);

      const editorStateTextString = parsedEditorState.read(() => {
        return $getRoot().getTextContent();
      });

      // only show the save button if there is content available to save
      isEditorEmpty.value = editorStateTextString.trim().length === 0;
    });
  });
});

function onSaveAsync() {
  editor.update(async () => {
    // get the html content from the editor, serialize it and send it to the api
    const htmlString = $generateHtmlFromNodes(editor, null);
    savedContent.value = htmlString;

    try {
      await entryService.createEntryAsync(name.value, htmlString);

      router.push("/");
    } catch (error) {
      console.error("error:", error);
    }
  });
}
</script>
