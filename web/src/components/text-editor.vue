<template>
    <div class="h-full w-full max-w-5xl px-6 lg:px-16">
        <div class="flex flex-col w-full" style="height: calc(100% - 10rem)">
            <LexicalComposer :initial-config="config" @error="onError">
                <EditorToolbar />
                <div class="w-full h-full px-3">
                    <div class="relative w-full h-full p-6 bg-white mt-3 rounded-xl">
                        <LexicalRichTextPlugin>
                            <template #contentEditable>
                                <ContentEditable />
                            </template>

                            <template #placeholder>
                                <div class="absolute top-6 left-6 text-slate-500/80 pointer-events-none">
                                    Enter some text...
                                </div>
                            </template>
                        </LexicalRichTextPlugin>
                    </div>
                </div>
                <LexicalHistoryPlugin />
                <LexicalAutoFocusPlugin />
                <LexicalListPlugin />
                <div class="w-full flex justify-end mt-6 pr-3">
                    <SaveButton />
                </div>
            </LexicalComposer>
        </div>
    </div>
</template>

<script setup lang="ts">
import PlaygroundEditorTheme from "../themes/theme";
import {
    LexicalAutoFocusPlugin,
    LexicalComposer,
    LexicalHistoryPlugin,
    LexicalListPlugin,
    LexicalRichTextPlugin,
} from "lexical-vue";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import EditorToolbar from "./editor-toolbar.vue";
import ContentEditable from "../components/content-editable.vue";
import SaveButton from "../components/save-button.vue";

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
    ],
};

function onError(error: Error) {
    throw error;
}
</script>
