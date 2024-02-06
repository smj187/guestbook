<script setup lang="ts">
import PlaygroundEditorTheme from '../themes/theme'
import {
    LexicalAutoFocusPlugin,
    LexicalComposer,
    LexicalHistoryPlugin,
    LexicalListPlugin,
    LexicalRichTextPlugin
} from 'lexical-vue'
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import ContentEditable from '../components/content-editable.vue';
import EditorToolbar from "../components/editor-toolbar-plugin.vue"
import SaveButton from '../components/save-button.vue';
import DrawCanvas from '../components/draw-canvas.vue';
import EditorSwitchButton from '../components/editor-switch-button.vue';

import { ref } from 'vue';

const config = {
    editable: true,
    theme: PlaygroundEditorTheme,
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,

    ]
}

function onError(error: Error) {
    throw error
}



const mode = ref<"text" | "draw">("text")

const onToggleState = () => {
    if (mode.value === "text") {
        mode.value = "draw"
    } else {
        mode.value = "text"
    }
}

</script>


<template>
    <div ref="contentRef" class="absolute inset-0 flex flex-col p-16 pb-16 sm:pb-6">
        <div class="flex space-x-2 w-full justify-center py-3">
            <router-link to="/">
                <button
                    class="bg-transparent hover:bg-[hsl(80,47%,44%)] hover:text-white hover:fill-white w-[142px] hover:outline-[hsl(80,47%,44%)] fill-slate-600 text-slate-600 inline-flex space-x-2 justify-center outline outline-slate-600/30  outline-2 items-center text font-semibold py-2 px-4 rounded shadow  focus:outline-none focus:ring-2 focus:ring-[hsl(80,47%,44%)] focus:ring-opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span> View All </span>
                </button>
            </router-link>

            <router-link to="/create">
                <button
                    class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)] w-[142px] text-white inline-flex justify-center space-x-1.5 items-center text font-semibold py-2 px-4 rounded shadow  focus:outline-none focus:ring-2 focus:ring-[hsl(80,47%,44%)] focus:ring-opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-4 h-4 ">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    <span> Create New </span>
                </button>
            </router-link>
        </div>


        <div class=" h-[90%] flex flex-col relative max-w-5xl border border-slate-600 mx-auto w-full">

            <div class=" flex flex-col relative w-full">

                <div class=" w-28 h-[3.5rem] flex items-center absolute top-0 right-0">
                    <EditorSwitchButton :onToggleState="() => onToggleState()" :mode="mode" />
                </div>

                <template v-if="mode === 'text'">
                    <LexicalComposer :initial-config="config" @error="onError">
                        <EditorToolbar />
                        <div class="relative w-full h-full p-6 bg-white mt-3">
                            <LexicalRichTextPlugin>
                                <template #contentEditable>
                                    <div class="  rounded ">

                                        <ContentEditable />
                                    </div>
                                </template>

                                <template #placeholder>
                                    <div class="absolute top-6 left-6 text-slate-500/80">
                                        Enter some text...
                                    </div>
                                </template>

                            </LexicalRichTextPlugin>
                        </div>
                        <LexicalHistoryPlugin />
                        <LexicalAutoFocusPlugin />
                        <LexicalListPlugin />
                        <div class="py-6">
                            <SaveButton />
                        </div>
                    </LexicalComposer>

                </template>

                <template v-else>
                    <DrawCanvas />
                </template>
            </div>

        </div>


    </div>
</template>
  