declare module "../utils/DrawingTablet.js" {
    export type BrushType = "pencil" | "eraser" | "highlighter";

    export interface DrawingTabletOptions {
        width?: number;
        height?: number;
        size?: number;
        bg?: string;
        color?: string;
        brushSize?: number;
        logs?: boolean;
        fullSize?: boolean;
        fullWidth?: boolean;
        fullHeight?: boolean;
        fullscreen?: boolean;
        lineCap?: CanvasLineCap;
        lineJoin?: CanvasLineJoin;
        overflow?: string;
        scale?: number;
        autosave?: boolean;
    }

    export interface BrushOptions {
        color: string;
        bg: string;
        brushSize: number;
        lineCap: CanvasLineCap;
        lineJoin: CanvasLineJoin;
    }

    export class DrawingTablet {
        constructor(element: string | HTMLElement, opts?: DrawingTabletOptions);

        brushType: BrushType;

        set bg(color: string): void;
        set brushSize(size: number): void;
        get brushSize(): number;
        set brushColor(color: string): void;
        get brushColor(): string;
        get opts(): DrawingTabletOptions;
        get ctx(): CanvasRenderingContext2D;
        get canvas(): HTMLCanvasElement;

        pencil(): void;
        highlighter(size?: number): void;
        eraser(): void;
        redraw(): void;
        clearOnlyScreen(): void;
        clear(): void;
        undo(): void;
        redo(): void;
        save(): void;
        clearSaved(): void;
        drawFromSaved(): void;
        download(filename?: string): void;
    }

}