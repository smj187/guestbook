<script setup lang="ts">
import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode } from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $patchStyleText, $wrapNodes } from '@lexical/selection';
import { $getSelection, $isRangeSelection, $createParagraphNode, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_LOW, REDO_COMMAND, UNDO_COMMAND, FORMAT_TEXT_COMMAND, RangeSelection, SELECTION_CHANGE_COMMAND, FORMAT_ELEMENT_COMMAND } from 'lexical';
import { useLexicalComposer } from 'lexical-vue';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { onMounted, ref } from 'vue';
import PopoverMenu from './popover-menu.vue';



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
    console.log(format)
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
    console.log(fontFamily)
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


const formats = [
    { value: 'normal', text: 'Normal', icon: "M13 6V21H11V6H5V4H19V6H13Z" },
    { value: 'h1', text: 'H1', icon: "M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.5005 8H21.0005Z" },
    { value: 'h2', text: 'H2', icon: "M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z" },
    { value: 'paragraph', text: 'Paragraph', icon: "M12 6V21H10V16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4H20V6H17V21H15V6H12ZM10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14V6Z" },
    { value: 'ul', text: 'Bullet List', icon: "M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" },
    { value: 'ol', text: 'Numbered List', icon: "M5.75024 3.5H4.71733L3.25 3.89317V5.44582L4.25002 5.17782L4.25018 8.5H3V10H7V8.5H5.75024V3.5ZM10 4H21V6H10V4ZM10 11H21V13H10V11ZM10 18H21V20H10V18ZM2.875 15.625C2.875 14.4514 3.82639 13.5 5 13.5C6.17361 13.5 7.125 14.4514 7.125 15.625C7.125 16.1106 6.96183 16.5587 6.68747 16.9167L6.68271 16.9229L5.31587 18.5H7V20H3.00012L2.99959 18.8786L5.4717 16.035C5.5673 15.9252 5.625 15.7821 5.625 15.625C5.625 15.2798 5.34518 15 5 15C4.67378 15 4.40573 15.2501 4.37747 15.5688L4.3651 15.875H2.875V15.625Z" },
    { value: 'quote', text: 'Quote', icon: "M17.934 3.0359L19.666 4.0359L18.531 6H21V8H19V12H21V14H19V21H17V14L13.9157 14.0004C13.5914 16.8623 12.3522 19.3936 10.5466 21.1933L8.98361 19.9233C10.5031 18.4847 11.5801 16.4008 11.9008 14.0009L10 14V12L12 11.999V8H10V6H12.467L11.334 4.0359L13.066 3.0359L14.777 6H16.221L17.934 3.0359ZM5 13.803L3 14.339V12.268L5 11.732V8H3V6H5V3H7V6H9V8H7V11.197L9 10.661V12.731L7 13.267V18.5C7 19.8807 5.88071 21 4.5 21H3V19H4.5C4.74546 19 4.94961 18.8231 4.99194 18.5899L5 18.5V13.803ZM17 8H14V12H17V8Z" },
];


const fonts = [
    { value: "Arial", text: "Arial" },
    { value: "Georgia", text: "Georgia" },
    { value: "Times New Roman", text: "Times New Roman" },
    { value: "Courier New", text: "Courier New" },
]

</script>

<template>
    <div class="flex w-full justify-between items-center h-[3.5rem]">
        <div class="flex space-x-1 py-2">
            <button type="button" :title="canUndo ? 'undo' : ''" :disabled="!canUndo" @click="handleUndo"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            </button>

            <button type="button" :title="canRedo ? 'undo' : ''" :disabled="!canRedo" @click="handleRedo"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                </svg>
            </button>

            <PopoverMenu :buttonName="'Format'" :formats="formats" @applyFormat="applyFormat" />
            <PopoverMenu :buttonName="'Select Font'" :formats="fonts" @applyFormat="applyFontChange" />

            <button type="button" title="bold" @click="toggleBold"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                        d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z">
                    </path>
                </svg>
            </button>

            <button type="button" title="italic" @click="toggleItalic"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z">
                    </path>
                </svg>
            </button>

            <button type="button" title="underline" @click="toggleUnderline"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                        d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z">
                    </path>
                </svg>
            </button>

            <button type="button" title="format left" @click="formatLeft"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M3 4H21V6H3V4ZM3 19H17V21H3V19ZM3 14H21V16H3V14ZM3 9H17V11H3V9Z"></path>
                </svg>
            </button>

            <button type="button" title="format center" @click="formatCenter"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M3 4H21V6H3V4ZM5 19H19V21H5V19ZM3 14H21V16H3V14ZM5 9H19V11H5V9Z"></path>
                </svg>
            </button>

            <button type="button" title="format right" @click="formatRight"
                class="disabled:cursor-default disabled:opacity-25 fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M3 4H21V6H3V4ZM7 19H21V21H7V19ZM3 14H21V16H3V14ZM7 9H21V11H7V9Z"></path>
                </svg>
            </button>


        </div>


    </div>
</template>