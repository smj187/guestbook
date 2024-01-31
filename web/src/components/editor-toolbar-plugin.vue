<script setup lang="ts">
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode } from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $patchStyleText, $wrapNodes } from '@lexical/selection';
import { $getSelection, $isRangeSelection, $createParagraphNode, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, REDO_COMMAND, UNDO_COMMAND, FORMAT_TEXT_COMMAND, RangeSelection, SELECTION_CHANGE_COMMAND, FORMAT_ELEMENT_COMMAND, LexicalEditor } from 'lexical';
import { useLexicalComposer } from 'lexical-vue';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { onMounted, ref } from 'vue';

const editor = useLexicalComposer()
const blockType = ref('paragraph')
const selectedElementKey = ref()
const canRedo = ref(false)
const canUndo = ref(false)
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)

function updateToolbar() {
    const selection = $getSelection() as RangeSelection
    if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const element
            = anchorNode.getKey() === 'root'
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow()
        const elementKey = element.getKey()
        const elementDOM = editor.getElementByKey(elementKey)
        if (elementDOM !== null) {
            selectedElementKey.value = elementKey
            if ($isListNode(element)) {
                const parentList = $getNearestNodeOfType(anchorNode, ListNode) as ListNode
                blockType.value = parentList ? parentList.getTag() : (element as ListNode).getTag()
            }
            else {
                blockType.value = $isHeadingNode(element)
                    // @ts-expect-error: Missing internal types
                    ? (element as ListNode).getTag()
                    : element.getType()
            }
        }
        // Update text format
        isBold.value = selection.hasFormat('bold')
        isItalic.value = selection.hasFormat('italic')
        isUnderline.value = selection.hasFormat('underline')

    }
}

let unregisterMergeListener: () => void

onMounted(() => {

    unregisterMergeListener = mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar()
            })
        }),
        editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar()
                return false
            },
            COMMAND_PRIORITY_LOW,
        ),
    )

    editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
            canUndo.value = payload;
            return false;
        },
        COMMAND_PRIORITY_LOW
    );

    editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
            canRedo.value = payload;
            return false;
        },
        COMMAND_PRIORITY_LOW
    );



})

function handleUndo() {
    editor.dispatchCommand(UNDO_COMMAND, undefined)
}
function handleRedo() {
    editor.dispatchCommand(REDO_COMMAND, undefined)
}


function toggleBold() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
}

function toggleItalic() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
}

function toggleUnderline() {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
}

function applyFormat(format: string) {
    switch (format) {
        case "normal":
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, $createParagraphNode);
                }
            });
            break;

        case "h1":
            editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode('h1'))
                }
            })
            break;

        case "h2":
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createHeadingNode('h2'))
                }
            })
            break;

        case "paragraph":
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createParagraphNode())
                }
            })
            break;

        case "ul":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            break;

        case "ol":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            break;

        case "quote":
            editor.update(() => {
                const selection = $getSelection()

                if ($isRangeSelection(selection)) {
                    $wrapNodes(selection, () => $createQuoteNode())
                }
            })
            break

        default:
            break;
    }

}


function formatLeft() {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
}

function formatCenter() {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
}

function formatRight() {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
}


function applyFontChange(fontFamily: string) {
    editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
            $patchStyleText(selection, {
                'font-family': fontFamily,
            });
        }
    });
}

onMounted(() => {
    unregisterMergeListener?.()
})



</script>

<template>
    <div class="flex space-x-1 py-2">
        <button class=" rounded px-2 py-0.5 bg-slate-800 disabled:opacity-25 disabled:cursor-default" :disabled="!canUndo"
            @click="handleUndo">Undo</button>
        <button class=" rounded px-2 py-0.5 bg-slate-800 disabled:opacity-25 disabled:cursor-default" :disabled="!canRedo"
            @click="handleRedo">Redo</button>
        <select class="rounded px-2 py-0.5 bg-slate-800"
            @change="event => applyFormat((event.target as HTMLSelectElement).value)">
            <option value="normal">Normal</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="paragraph">Paragraph</option>
            <option value="ul">Bullet List</option>
            <option value="ol">Numbered List</option>
            <option value="quote">Quote</option>
        </select>
        <select class="rounded px-2 py-0.5 bg-slate-800"
            @change="event => applyFontChange((event.target as HTMLSelectElement).value)">
            <option value="">Select Font</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
        </select>
        <button class="rounded px-2 py-0.5 bg-slate-800" @click="toggleBold">Bold</button>
        <button class="rounded px-2 py-0.5 bg-slate-800" @click="toggleItalic">Italic</button>
        <button class="rounded px-2 py-0.5 bg-slate-800" @click="toggleUnderline">Underline</button>

        <button class="rounded px-2 py-0.5 bg-slate-800" @click="formatLeft">format left</button>
        <button class="rounded px-2 py-0.5 bg-slate-800" @click="formatCenter">format center</button>
        <button class="rounded px-2 py-0.5 bg-slate-800" @click="formatRight">format right</button>
    </div>
</template>