import { beforeAll } from 'vitest';

const globalAny: any = global;

beforeAll(() => {
    globalAny.useRuntimeConfig = () => {
        return {
            public: {
                orbisApiBase: "http://localhost:63012/",
                orbisBaseUrl: "http://localhost:63012"
            },
        };
    }
});