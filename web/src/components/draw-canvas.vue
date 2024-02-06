<template>
    <div class="flex w-full justify-between items-center h-[3.5rem]">
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
    <div class="flex flex-col  space-y-4 ">
        <div class="w-[600px] mx-auto  h-[400px]  bg-white border border-gray-300">
            <div ref="canvasContainer" class="w-full h-full" :class="mode === 'eraser' ? 'cursor-none' : 'cursor-auto'">
            </div>
        </div>
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
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DrawingTablet } from "../utils/DrawingTablet"
import entryService from "../services/entryService";
import { useRouter } from 'vue-router';


const canvasContainer = ref<HTMLDialogElement | null>(null);
const drawingTablet = ref<DrawingTablet | null>(null)
const mode = ref<"pencil" | "eraser">("pencil")
const eraserRef = ref<HTMLDialogElement | null>(null)

const router = useRouter();

onMounted(() => {
    if (!canvasContainer.value) return
    drawingTablet.value = new DrawingTablet(canvasContainer.value, {
        fullscreen: true,
        bg: "#ffffff",
        autoSave: false,

    });

    drawingTablet.value.clear()

    canvasContainer.value.addEventListener('mousemove', updateEraserPosition);
    canvasContainer.value.addEventListener('mouseenter', updateEraserPosition);
    canvasContainer.value.addEventListener('mouseleave', () => {
        if (eraserRef.value) {
            eraserRef.value.style.display = 'none';
        }
    });
});


const setPencil = () => {
    if (!drawingTablet.value) return
    drawingTablet.value.pencil();
    mode.value = "pencil"


};

const setEraser = () => {
    if (!drawingTablet.value) return

    drawingTablet.value.eraser();
    mode.value = "eraser"
};

const setClear = () => {
    if (!drawingTablet.value) return
    drawingTablet.value.clear()
}

const updateEraserPosition = (e: MouseEvent) => {
    if (!eraserRef.value || mode.value !== 'eraser' || !drawingTablet.value || !canvasContainer.value) return;
    const rect = canvasContainer.value?.getBoundingClientRect();
    if (!rect) return;

    console.log(canvasContainer.value.offsetLeft)
    // TODO: ignore this for now
    const x = e.clientX - rect.left - 25 + canvasContainer.value.offsetLeft;
    const y = e.clientY - rect.top + 50;
    eraserRef.value.style.left = `${x}px`;
    eraserRef.value.style.top = `${y}px`;
    eraserRef.value.style.display = "block"
};


async function onSaveAsync() {

    if (!drawingTablet.value) return;

    const image = drawingTablet.value.export(1260, 382);
    const result = await entryService.createEntry("this", image);
    console.log(result);

    router.push('/');
}



</script>

  
