import { ok } from 'assert';

import { MongoIDGenerator } from '../../../../plugin/db/mongo';

const reg = /^[a-zA-Z0-9]{20,32}$/;

describe('src/plugin/db/mongo/id-generator.ts', (): void => {
    describe('.generate(): Promise<string>', (): void => {
        it('ok', async (): Promise<void> => {
            const res = await new MongoIDGenerator().generate();
            ok(
                reg.test(res)
            );
        });
    });
});