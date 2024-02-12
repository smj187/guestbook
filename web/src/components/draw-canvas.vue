<template>
    <div ref="eraserRef" class="absolute bg-[#FF7373] rounded-full w-[50px] h-[50px] pointer-events-none hidden"></div>

    <div class="aspect-[4/3.5] bg-white overflow-hidden rounded-xl w-full max-w-3xl">
        <div ref="canvasContainer" class="w-full h-full" :class="mode === 'eraser' ? 'cursor-none' : 'cursor-auto'"></div>
    </div>

    <div class="h-16 px-9 rounded-lg bg-white mt-12 flex items-center justify-center space-x-6">
        <div class="flex space-x-4">
            <div class="transition-transform duration-300 mb-6 hover:scale-110 cursor-pointer"
                :class="mode === 'pencil' ? '-translate-y-3' : ''" @click="setPencil">
                <img src="../assets/pencil.svg" class="h-20" alt="Vue logo" />
            </div>

            <div class="transition-transform duration-300 mb-6 hover:scale-110 cursor-pointer"
                :class="mode === 'eraser' ? '-translate-y-3' : ''" @click="setEraser">
                <img src="../assets/eraser.png" class="h-20" alt="Vue logo" />
            </div>
        </div>
        <div class="h-full flex items-center justify-center">
            <div class="block h-8 w-px bg-slate-300" />
        </div>

        <div class="flex space-x-3">
            <div v-for="(color, index) in colors" :key="index" class="w-6 h-6 rounded-full cursor-pointer" :class="[
                color === activeColor
                    ? 'ring-2 ring-offset-2 ring-offset-slate-400 ' + activeColorClass
                    : '',
                '',
            ]" :style="{ backgroundColor: color }" @click="setActiveColor(color)"></div>
        </div>

        <div class="h-full flex items-center justify-center">
            <div class="block h-8 w-px bg-slate-300" />
        </div>

        <div class="flex">
            <button class="text-slate-800 rounded-full p-1.5 hover:text-slate-800" title="undo" @click="handleUndo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            </button>

            <button class="text-slate-800 rounded-full p-1.5 hover:text-slate-800" title="redo" @click="handleRedo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                </svg>
            </button>
        </div>

        <div class="h-full flex items-center justify-center">
            <div class="block h-8 w-px bg-slate-300" />
        </div>

        <div>
            <button @click="onSaveAsync" class="font-oswald tracking-wider text-slate-800 hover:text-slate-600 p-3">
                save
            </button>
        </div>
    </div>

    <!-- <div class="flex  justify-between items-center ">


        <div class="   bg-white border border-gray-300">
            <div ref="canvasContainer" class="" :class="mode === 'eraser' ? 'cursor-none' : 'cursor-auto'" />
        </div>

        <div class="flex space-x-1 py-2">


            <button type="button" :title="mode === 'pencil' ? 'drawing' : ''" @click="setPencil"
                :class="mode === 'pencil' ? 'bg-[hsl(80,47%,64%)] hover:bg-[hsl(80,47%,70%)] ' : 'text-slate-600 bg-white hover:bg-slate-50'"
                class="disabled:cursor-default disabled:opacity-25  focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                        d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z" />
                </svg>
            </button>

            <button type="button" :title="mode === 'eraser' ? 'erasing' : ''" @click="setEraser"
                :class="mode === 'eraser' ? 'bg-[hsl(80,47%,64%)] hover:bg-[hsl(80,47%,70%)] ' : 'text-slate-600 bg-white hover:bg-slate-50'"
                class="disabled:cursor-default disabled:opacity-25  focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                        d="M8.58564 8.85449L3.63589 13.8042L8.83021 18.9985L9.99985 18.9978V18.9966H11.1714L14.9496 15.2184L8.58564 8.85449ZM9.99985 7.44027L16.3638 13.8042L19.1922 10.9758L12.8283 4.61185L9.99985 7.44027ZM13.9999 18.9966H20.9999V20.9966H11.9999L8.00229 20.9991L1.51457 14.5113C1.12405 14.1208 1.12405 13.4877 1.51457 13.0971L12.1212 2.49053C12.5117 2.1 13.1449 2.1 13.5354 2.49053L21.3136 10.2687C21.7041 10.6592 21.7041 11.2924 21.3136 11.6829L13.9999 18.9966Z" />
                </svg>
            </button>

            <button type="button" title="clear canvas" @click="setClear"
                class="disabled:cursor-default disabled:opacity-25 text-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                        d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z">
                    </path>
                </svg>
            </button>
        </div>

    </div>
    <div class="flex flex-col justify-center items-center ">

        <div ref="eraserRef"
            class="absolute left-0 top-0 bg-[#FF7373] hidden rounded-full w-[50px] h-[50px] pointer-events-none ">
        </div>
        <div class="flex space-x-2">

            <button
                class="bg-[hsl(80,47%,44%)] hover:bg-[hsl(80,47%,35%)]  w-full text-white  inline-flex justify-center space-x-3 items-center text-lg font-semibold py-3 px-4 rounded shadow  focus:outline-none focus:ring-2 focus:ring-[hsl(80,47%,44%)] focus:ring-opacity-50"
                @click="onSaveAsync">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Save Entry</button>

        </div>
    </div> -->
</template>

<script setup lang="ts">
let drawingTabletInstance: DrawingTablet | null = null;

import { computed, onMounted, ref, watch } from "vue";
import { DrawingTablet } from "../utils/DrawingTablet";
import entryService from "../services/entryService";
import { useRouter } from "vue-router";
import { useMousePosition } from "../hooks/useMousePosition";

const canvasContainer = ref<HTMLDialogElement | null>(null);
const mode = ref<"pencil" | "eraser">("pencil");
const eraserRef = ref<HTMLDialogElement | null>(null);

const router = useRouter();

const activeColor = ref("#000000");
const colors = ref([
    "#000000",
    "#f24822",
    "#ffa629",
    "#ffcd29",
    "#14ae5c",
    "#0d99ff",
    "#9747ff",
]);

const setActiveColor = (color: string) => {
    if (!drawingTabletInstance) return;
    activeColor.value = color;

    drawingTabletInstance.brushColor = color;
};

const activeColorClass = computed(() => {
    const colorMap: { [key: string]: string } = {
        "#000000": "ring-custom-black",
        "#f24822": "ring-custom-orange",
        "#ffa629": "ring-custom-yellow",
        "#ffcd29": "ring-custom-light-yellow",
        "#14ae5c": "ring-custom-green",
        "#0d99ff": "ring-custom-blue",
        "#9747ff": "ring-custom-purple",
    };
    return colorMap[activeColor.value] || "ring-black";
});

const handleUndo = () => {
    if (!drawingTabletInstance) return;
    drawingTabletInstance.undo();
};

const handleRedo = () => {
    if (!drawingTabletInstance) return;
    drawingTabletInstance.redo();
};
const { x, y } = useMousePosition();

watch(
    [x, y, mode],
    ([newX, newY]) => {
        if (mode.value !== "eraser") return;
        if (eraserRef.value) {
            eraserRef.value.style.left = `${newX - 25}px`;
            eraserRef.value.style.top = `${newY - 25}px`;
        }
    },
    {
        immediate: true,
    }
);

onMounted(() => {
    if (!canvasContainer.value) return;
    drawingTabletInstance = new DrawingTablet(canvasContainer.value, {
        fullscreen: true,
        bg: "#ffffff",
        autoSave: false,
    });

    drawingTabletInstance.clear();

    canvasContainer.value.addEventListener("mouseenter", () => {
        if (eraserRef.value && mode.value === "eraser") {
            eraserRef.value.style.display = "block";
        }
    });

    canvasContainer.value.addEventListener("mouseleave", () => {
        if (eraserRef.value) {
            eraserRef.value.style.display = "none";
        }
    });
});

const setPencil = () => {
    if (!drawingTabletInstance || !eraserRef.value) return;
    drawingTabletInstance.pencil();
    mode.value = "pencil";
};

const setEraser = () => {
    if (!drawingTabletInstance || !eraserRef.value) return;

    drawingTabletInstance.eraser();
    mode.value = "eraser";
};

async function onSaveAsync() {
    if (!drawingTabletInstance || !canvasContainer.value) return;

    const { width, height } = canvasContainer.value.getBoundingClientRect();
    const image = drawingTabletInstance.export(width, height);
    console.log(width, height);
    const result = await entryService.createEntry("this", image);
    console.log(result);

    router.push("/");
}
</script>
