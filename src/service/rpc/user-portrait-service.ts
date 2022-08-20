import { IUserPortraitService, RpcBase } from '../../contract';

/**
 * 用户画像服务(rpc)
 */
export class RpcUserPortraitService implements IUserPortraitService {
    /**
     * 缓存
     */
    private m_Cache: {
        [userID: string]: {
            [field: string]: any
        }
    } = {};

    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_UserID 用户ID
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_UserID: string,
    ) { }

    /**
     * 查询
     * 
     * @param field 字段
     * @param userID 用户ID
     */
    public async find<T>(field: string, userID?: string) {
        userID ??= this.m_UserID;
        this.m_Cache[userID] ??= {};

        if (!this.m_Cache[userID][field]) {
            const resp = await this.m_Rpc.setBody({ field, userID }).callWithoutThrow<T[]>('/portrait/get');
            if (!resp.err)
                this.m_Cache[userID][field] = resp.data;
        }

        return this.m_Cache[userID][field];
    }

    /**
     * 删除
     * 
     * @param field 字段
     * @param userID 用户ID
     */
    public async remove(field: string, userID?: string) {
        userID ??= this.m_UserID;
        this.m_Cache[userID] ??= {};

        await this.m_Rpc.setBody({ field, userID }).callWithoutThrow<void>('/portrait/remove');
        delete this.m_Cache[userID][field];
    }
}