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



const mode = ref<"text" | "draw">("draw")

</script>


<template>
    <div class="bg-slate-500 text-slate-200 h-full flex flex-col relative">
        <div class="flex space-x-2 absolute top-0 z-50 left-0">
            <button @click="mode = 'text'" class="p-2 bg-slate-900 text-slate-100 "
                :class="mode === 'draw' && 'opacity-30'">text
                mode</button>
            <button @click="mode = 'draw'" class="p-2 bg-slate-900 text-slate-100  "
                :class="mode === 'text' && 'opacity-30'">draw
                mode</button>
        </div>
        <div class=" flex flex-col relative">

            <template v-if="mode === 'text'">
                <div class="mt-20 mx-auto ">
                    <LexicalComposer :initial-config="config" @error="onError">
                        <EditorToolbar />
                        <LexicalRichTextPlugin>
                            <template #contentEditable>
                                <div class="editor-container bg-slate-600 rounded p-4">

                                    <ContentEditable />
                                </div>
                            </template>
                            <!--
                         <template #placeholder>
                            <div class="absolute top-24 left-6">
                                Enter some text...
                            </div>
                        </template>
                       -->
                        </LexicalRichTextPlugin>
                        <LexicalHistoryPlugin />
                        <LexicalAutoFocusPlugin />
                        <LexicalListPlugin />
                        <div class="mt-12">
                            <SaveButton />
                        </div>
                    </LexicalComposer>
                </div>

            </template>

            <template v-else>
                <DrawCanvas />
            </template>
        </div>

    </div>
</template>
  