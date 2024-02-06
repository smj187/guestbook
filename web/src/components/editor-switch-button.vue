<template>
    <div>
        <label class="relative inline-flex items-center cursor-pointer" @click="onToggleState">
            <!-- Bind the checked state to whether mode is 'draw' -->
            <input type="checkbox" class="sr-only peer" @click="onToggleState" :checked="mode === 'draw'">
            <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[hsl(80,47%,50%)] rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[hsl(80,47%,44%)]">
            </div>
            <span class="ms-3  text-slate-700">Canvas</span>
        </label>
    </div>
</template>
  
<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
    onToggleState: () => void;
    mode: 'text' | 'draw';
}

const { onToggleState } = defineProps<Props>();
</script>