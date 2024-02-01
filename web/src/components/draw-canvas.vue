<template>
    <div class="flex flex-col  space-y-4  mt-[100px]">
        <div class="w-[600px] mx-auto  h-96  bg-white border border-gray-300">
            <div ref="canvasContainer" class="w-full h-full" :class="mode === 'eraser' ? 'cursor-none' : 'cursor-auto'">
            </div>
        </div>
        <div ref="eraserRef"
            class="absolute left-0 top-0 bg-[#FF7373] hidden rounded-full w-[50px] h-[50px] pointer-events-none ">
        </div>
        <div class="flex space-x-2">
            <button @click="setPencil" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Draw</button>
            <button @click="setEraser" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Erase</button>
            <button @click="setClear" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">clear</button>
            <button @click="onSave" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">save</button>
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

    const x = e.clientX - rect.left - 25 + canvasContainer.value.offsetLeft;
    const y = e.clientY - rect.top + 50;
    eraserRef.value.style.left = `${x}px`;
    eraserRef.value.style.top = `${y}px`;
    eraserRef.value.style.display = "block"
};


const onSave = async () => {

    if (!drawingTablet.value) return

    const image = drawingTablet.value.export(1260, 382)
    const result = await entryService.createEntry("this", image);
    console.log(result)

    router.push('/');
}

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


</script>

  
