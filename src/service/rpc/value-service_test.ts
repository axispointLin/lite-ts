import { strictEqual } from 'assert';

import { RpcValueService as Self } from './value-service';
import { Mock, mockAny } from '../assert';
import { CustomError } from '../error';
import { IUserAssociateService, RpcBase } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/rpc/value-service.ts', () => {
    describe('.update(_: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockRpc = new Mock<RpcBase>();
            const self = new Self(mockAssociateService.actual, mockRpc.actual, {
                app: 'test',
                value: 1
            } as enum_.TargetTypeData, {
                no: 2
            } as global.UserTargetValue, null, null);

            mockAssociateService.expectReturn(
                r => r.find(`user-target-value-1`, mockAny),
                []
            );

            mockRpc.expectReturn(
                r => r.setBody({
                    no: 2,
                    values: [{
                        count: 1,
                        valueType: 11
                    }]
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.call('/test/ih/update-values-by-user-id'),
                {}
            );

            let err: CustomError;
            try {
                await self.update(null, [{
                    count: 1,
                    valueType: 11
                }]);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });
    });
});