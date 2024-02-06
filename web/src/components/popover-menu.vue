<template>
    <div class="relative" ref="popover">
        <button @click="togglePopover"
            class="fill-slate-600 bg-white hover:bg-slate-50 focus:ring-2 focus:outline-none focus:ring-slate-600 font-medium rounded text-sm p-2.5 text-center inline-flex items-center">
            {{ buttonName }}
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
import { ref, onMounted, onUnmounted, defineProps, defineEmits, Ref } from 'vue';

const { buttonName, formats } = defineProps<{
    buttonName: string;
    formats: {
        value: string;
        text: string;
        icon?: string;
    }[];
}>();

const emits = defineEmits(['applyFormat']);

const popover = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);

const togglePopover = () => {
    isOpen.value = !isOpen.value;
};

const applyAndClose = (value: string) => {
    emits('applyFormat', value);
    isOpen.value = false;
};

function useClickOutside(elementRef: Ref<HTMLDivElement | null>, callback: () => void) {
    const handleClickOutside = (event: MouseEvent) => {
        if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
            callback();
        }
    };

    onMounted(() => window.addEventListener('click', handleClickOutside));
    onUnmounted(() => window.removeEventListener('click', handleClickOutside));
}

useClickOutside(popover, () => isOpen.value = false);
</script>
  