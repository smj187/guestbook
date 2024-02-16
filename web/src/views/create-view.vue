<template>
  <div class="absolute top-3 left-3 lg:top-9 lg:left-9 z-50">
    <router-link to="/">
      <button
        class="flex z-50 items-center font-oswald tracking-wide text-slate-700 hover:text-slate-800 cursor-pointer p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4 mr-1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>
    </router-link>
  </div>

  <!-- the available modes a user can pick from -->
  <div
    ref="contentRef"
    class="absolute inset-0 flex items-center flex-col w-full h-full pt-16 lg:pt-36 px-3 pb-3"
  >
    <div class="p-6 flex">
      <button
        @click="() => setMode('text')"
        :class="
          mode === 'text'
            ? 'text-[hsl(0,0%,97%)] bg-[#92B648] hover:bg-[hsl(80,43%,47%)] border-[hsl(80,43%,48%)]'
            : 'text-[#6E5932] bg-[#DEDCCE] hover:bg-[hsl(53,20%,89%)] border-[hsl(39,18%,79%)]'
        "
        class="font-oswald text-xl font-medium w-[180px] lg:w-[200px] py-2 rounded-l-lg border-2 border-r-transparent"
      >
        Text Message
      </button>
      <button
        @click="() => setMode('draw')"
        :class="
          mode === 'draw'
            ? 'text-[hsl(0,0%,97%)] bg-[#92B648] hover:bg-[hsl(80,43%,47%)] border-[hsl(80,43%,48%)]'
            : 'text-[#6E5932] bg-[#DEDCCE] hover:bg-[hsl(53,20%,89%)] border-[hsl(39,18%,79%)]'
        "
        class="font-oswald border-2 border-l-transparent text-xl font-medium w-[180px] lg:w-[200px] py-2 rounded-r-lg"
      >
        Draw Message
      </button>
    </div>

    <!-- the actual content -->
    <template v-if="mode === 'draw'">
      <DrawCanvas />
    </template>
    <template v-else>
      <TextEditor />
    </template>
  </div>
</template>

<script setup lang="ts">
import DrawCanvas from "../components/draw-canvas.vue";
import TextEditor from "../components/text-editor.vue";

import { ref } from "vue";

// a user can switch between 2 modes using these 2 buttons
const mode = ref<"text" | "draw">("text");

// changes the currently active mode
function setMode(newMode: "text" | "draw") {
  mode.value = newMode;
}
</script>
