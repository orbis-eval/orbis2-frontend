import {IColorPalette} from "~/lib/model/icolorpalette";

export class ColorPalette implements IColorPalette {
    palette_id: number;
    name: string;
    colors: [number]

    constructor(colorPalette: IColorPalette) {
        this.palette_id = colorPalette.palette_id;
        this.name = colorPalette.name;
        this.colors = colorPalette.colors;
    }
}
