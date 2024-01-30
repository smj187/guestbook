<script setup lang="ts">
import { $getRoot, $getSelection, EditorState } from 'lexical'
import PlaygroundEditorTheme from '../themes/theme'
import {
    LexicalAutoFocusPlugin,
    LexicalComposer,
    LexicalHistoryPlugin,
    LexicalListPlugin,
    LexicalOnChangePlugin,
    LexicalRichTextPlugin
} from 'lexical-vue'
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import ContentEditable from '../components/content-editable.vue';
import EditorToolbar from "../components/editor-toolbar-plugin.vue"

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

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
    editorState.read(() => {
        // const root = $getRoot()
        // const selection = $getSelection()

        // console.log(root, selection)
    })
}
</script>


<template>
    <div class="bg-slate-500 text-slate-200 h-full">
        <div class="max-w-4xl mx-auto flex flex-col">
            <LexicalComposer :initial-config="config" @error="onError">
                <EditorToolbar />
                <LexicalRichTextPlugin>
                    <template #contentEditable>
                        <div class="editor-container bg-slate-600 rounded p-4">

                            <ContentEditable />
                        </div>
                    </template>
                    <template #placeholder>
                        <div>
                            Enter some text...
                        </div>
                    </template>
                </LexicalRichTextPlugin>
                <LexicalOnChangePlugin @change="onChange" />
                <LexicalHistoryPlugin />
                <LexicalAutoFocusPlugin />
                <LexicalListPlugin />
            </LexicalComposer>
        </div>
    </div>
</template>
  