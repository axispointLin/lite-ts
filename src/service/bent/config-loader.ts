import bent from 'bent';
import moment from 'moment';

import { ConfigLoaderBase } from '../../contract';
import { config } from '../../model';

/**
 * 配置加载器
 */
export class BentConfigLoader extends ConfigLoaderBase {
    /**
     * 负载
     */
    private m_LoadBalance: any;
    /**
     * 下次拉取时间
     */
    private m_NextPullOn: number;
    /**
     * 获取函数
     */
    private m_GetFunc: bent.RequestFunction<bent.Json>;

    /**
     * 构造函数
     * 
     * @param cdnUrl cdn地址
     */
    public constructor(
        cdnUrl: string
    ) {
        super();

        this.m_GetFunc = bent(cdnUrl, 'json', 'GET', 200);
        this.m_NextPullOn = 0;
    }

    /**
     * 加载
     * 
     * @param ctor 模型
     */
    public async load<T>(ctor: new () => T) {
        if (ctor.name != config.LoadBalance.name)
            return;

        const now = moment().unix();
        if (this.m_NextPullOn < now) {
            try {
                this.m_LoadBalance = await this.m_GetFunc(`/${ctor.name}.json`) as T;
            } catch { }
            this.m_NextPullOn = now + 60;
        }

        return this.m_LoadBalance;
    }
}