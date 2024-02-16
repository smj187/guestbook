import { Ref, onUnmounted } from "vue";

export function useClickOutside(
    elementRef: Ref<HTMLDivElement | null>,
    callback: () => void
) {
    const handleClickOutside = (event: MouseEvent) => {
        if (!elementRef.value) return;
        if (!elementRef.value.contains(event.target as Node)) {
            callback();
        }
    };

    window.addEventListener("click", handleClickOutside);
    onUnmounted(() => window.removeEventListener("click", handleClickOutside));
}