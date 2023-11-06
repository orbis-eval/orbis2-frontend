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

        if (key === "id") {
          transformedObj._id = value;
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

  /**
   * Transforms the object(s) to a camel case object (e.g. surface_forms -> surfaceForms) to conform to the API
   * @param obj
   */
  static transformToCamelCase(obj: Record<string, any>): Record<string, any> {
    const transformedObj: Record<string, any> = {};

    function processArray(arr: any[]): any[] {
      return arr.map((item) => {
        if (typeof item === "object" && item !== null) {
          return JSONTransformer.transformToCamelCase(item);
        }
        return item;
      });
    }

    function processObjectValue(value: any): any {
      if (Array.isArray(value)) {
        return processArray(value);
      } else if (typeof value === "object" && value !== null) {
        return JSONTransformer.transformToCamelCase(value);
      } else {
        return value;
      }
    }

    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        const value = obj[key];

        if (key === "_id") {
          transformedObj.id = value;
          continue;
        }

        const transformedKey = key.replace(/_([a-z])/g, (_, p1) =>
          p1.toUpperCase(),
        );

        transformedObj[transformedKey] = processObjectValue(value);
      }
    }
    return transformedObj;
  }
}
