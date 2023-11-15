export class JSONTransformer {
  /**
   * Transforms the object(s) / array(s) to an underscore case object (e.g. surfaceForms -> surface_forms) to conform to the API
   * @param obj
   */
  static transformFromCamelCase(obj: Record<string, any>): Record<string, any> {
    const transformedObj: Record<string, any> = {};

    function processArray(arr: any[]): any[] {
      return arr.map((item) => {
        if (typeof item === "object" && item !== null) {
          return JSONTransformer.transformFromCamelCase(item);
        }
        return item;
      });
    }

    function processObjectValue(value: any): any {
      if (Array.isArray(value)) {
        return processArray(value);
      } else if (typeof value === "object" && value !== null) {
        return JSONTransformer.transformFromCamelCase(value);
      } else {
        return value;
      }
    }

    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        const value = obj[key];

        if (key === "_id") {
          continue;
        }

        const transformedKey = key.replace(
          /[A-Z]/g,
          (match) => `_${match.toLowerCase()}`,
        );

        transformedObj[transformedKey] = processObjectValue(value);
      }
    }
    return transformedObj;
  }
}
