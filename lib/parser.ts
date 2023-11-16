import { TypedInternalResponse } from "nitropack";

export class Parser {
  /**
   * Takes a promise containing no body in response.
   * @param promise the promise delivering the response, which only contains a status code
   * @return Returns true if status code = 200 or an error if something went wrong.
   */
  static async parseEmptyResponse(
    promise: Promise<TypedInternalResponse<string>>,
  ): Promise<boolean> {
    await promise;
    return true;
  }

  /**
   * Takes a promise containing a response and parses it to a given type.
   * The type in which the response is parsed to (U) must be an extension of an interface (T),
   * and the data in the response must be of the same structure as T.
   * @param constructor the type (U) contains a constructor which takes the interface (T) as input
   * @param promise the promise delivering the response, which contains the data in form of the interface (T).
   * @return Returns a promise containing the data (U) or an error if something went wrong.
   */
  static async parse<T, U extends T>(
    constructor: new (data: T) => U,
    promise: Promise<TypedInternalResponse<string>>,
  ): Promise<U> {
    const data = await promise;

    if ((data as T) !== undefined) {
      return new constructor(data as T);
    }

    throw new Error(
      `Response in Promise is expected to be of type ${typeof data}`,
    );
  }

  /**
   * Takes a promise containing a response and parses it to a list of given types.
   * The type in which the response is parsed to (U) must be an extension of an interface (T),
   * and the data in the response must be of a list of objects with the same structure as T.
   * @param constructor the type (U) contains a constructor which takes the interface (T) as input
   * @param promise the promise delivering the response, which contains the data in form of the interface (T).
   * @return Returns a promise containing a list of the data (U) or an error if something went wrong.
   */
  static async parseList<T, U extends T>(
    constructor: new (data: T) => U,
    promise: Promise<TypedInternalResponse<string>>,
  ): Promise<U[]> {
    const response: any = await promise;

    if (Array.isArray(response)) {
      const result: U[] = [];
      for (const item of response) {
        result.push(new constructor(item));
      }
      return result;
    }

    throw new Error("Response in Promise is expected to be a list.");
  }
}
