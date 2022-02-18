import { Inject, Service } from 'typedi';

import { enum_ } from '../../model';
import { EnumFacatoryBase, IApi } from '../../../../src';

/**
 * 枚举
 */
@Service()
export default class EnumApi implements IApi {
    /**
     * 枚举工厂
     */
    @Inject()
    public enumFactory: EnumFacatoryBase;

    public async call() {
        const res = await this.enumFactory.build(enum_.CityData).all();
        return res.map(r => {
            return r.data;
        });
    }
}