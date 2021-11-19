import { EnumItem } from './enum-item';
import { DbFactoryBase, IEnum, IEnumItem, model } from '../..';

export class Enum<T> implements IEnum<T> {
    private m_Items: IEnumItem<T>[];

    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Name: string
    ) { }

    public async all() {
        if (!this.m_Items) {
            const rows = await this.m_DbFactory.db(model.global.Enum).query().where({
                id: this.m_Name
            }).toArray();
            if (rows.length) {
                this.m_Items = rows[0].items.map(r => {
                    return new EnumItem(r, this.m_Name);
                });
            } else {
                this.m_Items = [];
            }
        }

        return this.m_Items;
    }

    public async get(predicate: (data: T) => boolean) {
        const items = await this.all();
        return items.find(r => {
            return predicate(r.data);
        });
    }
}