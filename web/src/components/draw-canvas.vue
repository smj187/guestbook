<template>
  <div
    ref="eraserRef"
    class="absolute bg-[#FF7373] rounded-full w-[50px] h-[50px] pointer-events-none hidden"
  />

  <div
    class="aspect-[4/3.5] bg-white overflow-hidden rounded-xl w-full max-w-3xl"
  >
    <div
      ref="canvasContainer"
      class="w-full h-full"
      :class="mode === 'eraser' ? 'cursor-none' : 'cursor-auto'"
    />
  </div>

  <div class="flex flex-col">
    <div
      class="h-auto sm:h-16 pl-6 pr-3 rounded-lg bg-white mt-12 flex items-center justify-center space-x-6 flex-col sm:flex-row"
    >
      <div class="flex space-x-4">
        <div
          class="transition-transform duration-300 mb-6 hover:scale-110 cursor-pointer"
          :class="mode === 'pencil' ? '-translate-y-3' : ''"
          @click="setPencil"
        >
          <img src="../assets/pencil.svg" class="h-20" alt="Vue logo" />
        </div>

        <div
          class="transition-transform duration-300 mb-6 hover:scale-110 cursor-pointer"
          :class="mode === 'eraser' ? '-translate-y-3' : ''"
          @click="setEraser"
        >
          <img src="../assets/eraser.png" class="h-20" alt="Vue logo" />
        </div>
      </div>

      <div class="h-full sm:flex items-center justify-center hidden">
        <div class="block h-8 w-px bg-slate-300" />
      </div>

      <div class="flex space-x-3">
        <div
          v-for="(color, index) in availableColors"
          :key="index"
          class="w-6 h-6 rounded-full cursor-pointer"
          :class="[
            color === activeColor
              ? 'ring-2 ring-offset-2 ring-offset-slate-400 ' + activeColorClass
              : '',
            '',
          ]"
          :style="{ backgroundColor: color }"
          @click="setActiveColor(color)"
        />
      </div>

      <div class="h-full sm:flex items-center justify-center hidden">
        <div class="block h-8 w-px bg-slate-300" />
      </div>

      <div class="flex py-6 sm:py-0">
        <button
          class="text-slate-800 rounded-full p-1.5 hover:text-slate-800"
          title="undo"
          @click="handleUndo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>

        <button
          class="text-slate-800 rounded-full p-1.5 hover:text-slate-800"
          title="redo"
          @click="handleRedo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex space-x-3 justify-end mt-6">
      <input
        type="text"
        class="bg-white p-3 rounded-lg"
        placeholder="Your name"
        v-model="name"
      />
      <button
        @click="onSaveAsync"
        :disabled="name.trim().length === 0 || !hasDrawings"
        class="font-oswald tracking-wider text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:text-slate-600 bg-white rounded-lg py-2.5 px-5"
      >
        save
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// an instance of the canvas where we draw our message on
let CanvasInstance: DrawingTablet | null = null;

import { computed, onMounted, ref, watch } from "vue";
import { DrawingTablet } from "../utils/DrawingTablet";
import entryService from "../services/entryService";
import { useRouter } from "vue-router";
import { useMousePosition } from "../hooks/useMousePosition";

const canvasContainer = ref<HTMLDialogElement | null>(null);
// we support 2 different drawing modes, pencil and erase
const mode = ref<"pencil" | "eraser">("pencil");
const eraserRef = ref<HTMLDialogElement | null>(null);
const router = useRouter();
const name = ref("");
const hasDrawings = ref(false);

const activeColor = ref("#000000");
const availableColors = ref([
  "#000000",
  "#f24822",
  "#ffa629",
  "#ffcd29",
  "#14ae5c",
  "#0d99ff",
  "#9747ff",
]);

const { x, y } = useMousePosition();

onMounted(() => {
  if (!canvasContainer.value) return;

  // initializes the canvas instance
  CanvasInstance = new DrawingTablet(canvasContainer.value, {
    fullscreen: true,
    bg: "#ffffff",
    autoSave: false,
    fullWidth: true,
    fullHeight: true,
  });
  CanvasInstance.clear();

  // initialize event listeners for drawing interactions
  canvasContainer.value.addEventListener("mousedown", (event) => {
    if (!canvasContainer.value || mode.value !== "pencil") return;

    // register a drawing event once there is something on the canvas
    const target = event.target as Element;
    if (
      event.target === canvasContainer.value ||
      canvasContainer.value.contains(target)
    ) {
      hasDrawings.value = true;
    }
  });

  // make sure to show the eraser html element when hovering the canvas and the mode is active
  canvasContainer.value.addEventListener("mouseenter", () => {
    if (!eraserRef.value || mode.value !== "eraser") return;
    eraserRef.value.style.display = "block";
  });

  //hide the eraser html element if we leave the canvas
  canvasContainer.value.addEventListener("mouseleave", () => {
    if (!eraserRef.value) return;
    eraserRef.value.style.display = "none";
  });
});

// update the position of the eraser html element when we move the cursor
watch(
  [x, y, mode],
  ([newX, newY]) => {
    if (!eraserRef.value || mode.value !== "eraser") return;
    eraserRef.value.style.left = `${newX - 25}px`;
    eraserRef.value.style.top = `${newY - 25}px`;
  },
  {
    immediate: true,
  }
);

// Maps colors to custom tailwind classes for the ring indication
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

// Sets the active brush color and updates the DrawingTablet instance
function setActiveColor(color: string) {
  if (!CanvasInstance) return;
  activeColor.value = color;

  CanvasInstance.brushColor = color;
}

function handleUndo() {
  if (!CanvasInstance) return;
  CanvasInstance.undo();
}

function handleRedo() {
  if (!CanvasInstance) return;
  CanvasInstance.redo();
}

function setPencil() {
  if (!CanvasInstance || !eraserRef.value) return;
  CanvasInstance.pencil();
  mode.value = "pencil";
}

function setEraser() {
  if (!CanvasInstance || !eraserRef.value) return;

  CanvasInstance.eraser();
  mode.value = "eraser";
}

// saves the current canvas drawing and navigates to the overview
async function onSaveAsync() {
  if (!CanvasInstance || !canvasContainer.value) return;

  const { width, height } = canvasContainer.value.getBoundingClientRect();
  const image = CanvasInstance.export(width, height);
  await entryService.createEntryAsync(name.value, image);

  router.push("/");
}
</script>
