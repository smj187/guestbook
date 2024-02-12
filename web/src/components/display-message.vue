<template>
    <div ref="containerRef" class=" aspect-square  relative">
        <template v-if="isLoaded">
            <div class="" :style="`width: ${containerWidth}px; height: ${containerHeight}px`">
                <template v-if="entry.message.startsWith('data:image')">
                    <img :src="entry.message" class="w-full h-full object-contain" />
                </template>
                <template v-else>
                    <div v-html="entry.message"></div>
                </template>
            </div>
        </template>
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GuestbookEntry } from '../types';

const { entry } = defineProps<{
    entry: GuestbookEntry;
}>();

const containerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const containerHeight = ref(0);

const isLoaded = ref(false)

onMounted(() => {
    if (!containerRef.value) return

    containerWidth.value = containerRef.value.offsetWidth;
    containerHeight.value = containerRef.value.offsetHeight;

    isLoaded.value = true

});
</script>