import { ref, onMounted, onUnmounted } from 'vue';

export function useMousePosition() {
    const x = ref(0);
    const y = ref(0);

    // Update mouse coordinates
    const updateMousePosition = (event: MouseEvent) => {
        x.value = event.clientX;
        y.value = event.clientY;
    };

    // Lifecycle hooks to add and remove event listener
    onMounted(() => {
        window.addEventListener('mousemove', updateMousePosition);
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', updateMousePosition);
    });

    // Return reactive mouse coordinates
    return { x, y };
} 