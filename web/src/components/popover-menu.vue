<template>
    <div class="relative" ref="popover">
        <button @click="togglePopover"
            class=" text-slate-800 pl-5 pr-3 bg-white inline-flex space-x-2  focus:ring-2 focus:outline-none focus:ring-slate-600 font-oswald tracking-wide rounded  p-2.5 text-center items-center">


            <svg v-if="selectedFormat.icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2 text-slate-700">
                <path :d="selectedFormat.icon"></path>
            </svg>
            <svg v-if="staticIcon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2 text-slate-700">
                <path :d="staticIcon"></path>
            </svg>



            {{ selectedFormat.text }}

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="w-4 h-4 ml-2 text-slate-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>

        </button>
        <div v-show="isOpen" class="absolute z-10 bg-white rounded-md shadow-lg mt-2 p-2 w-56">
            <ul class="flex flex-col">
                <li v-for="format in formats" :key="format.value" @click="applyAndClose(format.value)"
                    class="flex items-center px-4 py-2 hover:bg-slate-100 cursor-pointer text-slate-700 rounded">
                    <svg v-if="format.icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        class="mr-3 h-5 w-5 text-slate-600">
                        <path :d="format.icon"></path>
                    </svg>
                    {{ format.text }}
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onUnmounted, defineProps, defineEmits, Ref } from 'vue';

const { selectedFormat, formats } = defineProps<{
    staticIcon?: string;
    selectedFormat: { value: string; text: string; icon?: string; };
    formats: {
        value: string;
        text: string;
        icon?: string;
    }[];
}>();

const emits = defineEmits(['applySelection']);
const popover = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);

const togglePopover = () => {
    isOpen.value = !isOpen.value;
};

const applyAndClose = (value: string) => {
    emits('applySelection', value);
    isOpen.value = false;
};

function useClickOutside(elementRef: Ref<HTMLDivElement | null>, callback: () => void) {
    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
            callback();
        }
    };

    window.addEventListener('click', handleClickOutside);
    onUnmounted(() => window.removeEventListener('click', handleClickOutside));
}

useClickOutside(popover, () => isOpen.value = false);
</script>
  