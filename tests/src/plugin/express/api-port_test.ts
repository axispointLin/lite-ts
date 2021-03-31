import { deepStrictEqual } from 'assert';
import bent from 'bent';

import { APIBase, APIFactory, ExpressAPIPort, Mock } from '../../../../src';

describe('src/plugin/express/api-port.ts', () => {
    describe('.listen()', () => {
        it('ok', async () => {
            const mockAPIFactory = new Mock<APIFactory>();
            const port = 19999;
            const self = new ExpressAPIPort(mockAPIFactory.actual, 'project', port, '0.0.0');

            self.listen();

            const endpoint = 'ep';
            const api = 'a';
            const mockAPI = new Mock<APIBase>();
            mockAPIFactory.expectReturn(
                r => r.build(endpoint, api),
                mockAPI.actual
            );

            mockAPI.expectReturn(
                r => r.getResposne(),
                {
                    data: 'ok',
                    err: 0
                }
            );

            const post = bent(`http://localhost:${port}`, 'POST', 'json', 200);
            const res = await post(`/${endpoint}/${api}`, {});
            deepStrictEqual(res, {
                data: 'ok',
                err: 0
            });

            self.close();
        });
    });
});