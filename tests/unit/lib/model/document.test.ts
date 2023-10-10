import {Document} from "~/lib/model/document";
import {describe, it, expect} from "vitest";

describe('Document.constructor()', () => {
    it('create new object with interface', () => {
        const jsonString = `{
              "content": "1234",
              "key": "abc",
              "run_id": null,
              "metadata": [],
              "done": false,
              "_id": 3804794706
            }`;
        const doc = new Document(JSON.parse(jsonString));
        expect(doc.content).toEqual("1234");
    });
});
