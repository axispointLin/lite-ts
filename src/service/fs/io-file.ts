import { createReadStream, createWriteStream, existsSync, readFile, unlink, writeFile } from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';

import { FSIOFactory } from '.';
import { IOFileBase } from '../..';

const readFileFunc = promisify(readFile);
const unlinkAction = promisify(unlink);
const writeFileAction = promisify(writeFile);

export class IOFile extends IOFileBase {
    public constructor(
        private m_IOFactory: FSIOFactory,
        paths: string[]
    ) {
        super(paths);
    }

    public async exists() {
        return existsSync(this.path);
    }

    public async copyTo(dstFilePath: string) {
        let isExist = await this.exists();
        if (!isExist)
            return;

        isExist = await this.m_IOFactory.buildFile(dstFilePath).exists();
        if (isExist)
            throw new Error(`文件已经存在: ${dstFilePath}`);

        await this.m_IOFactory.buildDirectory(
            dirname(dstFilePath)
        ).create();

        await new Promise<void>((s, f) => {
            createReadStream(this.path).on('err', f).on('end', s).pipe(
                createWriteStream(dstFilePath)
            );
        });
    }

    public async move(dstFilePath: string) {
        let isExist = await this.exists();
        if (!isExist)
            return;

        await this.copyTo(dstFilePath);

        await this.remove();
    }

    public async readJSON() {
        const content = await this.readString();
        return JSON.parse(content);
    }

    public async readString() {
        return await readFileFunc(this.path, 'utf8');
    }

    public async remove() {
        const isExist = await this.exists();
        if (isExist)
            await unlinkAction(this.path);
    }

    public async write(content: any) {
        if (typeof content != 'string')
            content = JSON.stringify(content, null, '\t');
        await writeFileAction(this.path, content);
    }
}
