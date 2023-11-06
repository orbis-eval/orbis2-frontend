import { IColorPalette } from "~/lib/model/icolorpalette";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class ColorPalette implements IColorPalette {
  paletteId: number;
  name: string;
  colors: [number];

  constructor(colorPalette: IColorPalette) {
    this.paletteId = colorPalette.paletteId;
    this.name = colorPalette.name;
    this.colors = colorPalette.colors;
  }

  getHexadecimalColorValue(colorId: number) {
    return this.colors[colorId % this.colors.length].toString(16);
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { paletteId, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
