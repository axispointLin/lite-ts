import { deepStrictEqual, ok, strictEqual } from 'assert';
import { existsSync, mkdir, readFile, rmdir, unlink, writeFile } from 'fs';
import { dirname, extname, join } from 'path';
import { promisify } from 'util';

import { FSFile as Self } from './file';

describe('src/service/fs/file.ts', () => {
    describe('.ext', () => {
        it('ok', async () => {
            const name = `file-name-${Date.now()}.txt`;
            strictEqual(new Self(__dirname, name).ext, extname(name));
        });
    });

    describe('.name', () => {
        it('ok', async () => {
            const name = `file-name-${Date.now()}.txt`;
            strictEqual(new Self(__dirname, name).name, name);
        });
    });

    describe('.copyTo(dstPath: string)', () => {
        it('源文件不存在', async () => {
            const srcPath = join(__dirname, 'file-copy-src-path-not-exists');
            let err: Error = undefined;
            try {
                await new Self(srcPath).copyTo('');
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });

        it('目标为文件已存在', async () => {
            const srcPath = join(__dirname, 'file-copy-src-path-exists');
            await promisify(writeFile)(srcPath, 'src');

            const dstPath = join(__dirname, 'file-copy-dst-path-exists');
            await promisify(writeFile)(dstPath, 'src');

            let err: Error = undefined;
            try {
                await new Self(srcPath).copyTo(dstPath);
            } catch (ex) {
                err = ex;
            } finally {
                await promisify(unlink)(srcPath);
                await promisify(unlink)(dstPath);
            }
            ok(err);
        });

        it('ok', async () => {
            const srcPath = join(__dirname, 'file-copy-src-path-exists');
            await promisify(writeFile)(srcPath, 'src');

            const dstPath = join(__dirname, 'file-copy-dst-path-exists');

            let err: Error = undefined;
            let res: string;
            try {
                await new Self(srcPath).copyTo(dstPath);

                res = await promisify(readFile)(dstPath, 'utf8');
            } catch (ex) {
                err = ex;
            } finally {                
                await promisify(unlink)(srcPath);
                await promisify(unlink)(dstPath);
            }
            strictEqual(err, undefined);
            strictEqual(res, 'src');
        });
    });

    describe('.exists(): Promise<boolean>', () => {
        it('not exist', async () => {
            const filePath = join(__dirname, `file-exists-not-exist-${Date.now()}.txt`);
            const res = await new Self(filePath).exists();
            strictEqual(res, false);
        });

        it('ok', async () => {
            const filePath = join(__dirname, `file-exists-ok-${Date.now()}.txt`);
            await promisify(writeFile)(filePath, '');

            const res = await new Self(filePath).exists();
            ok(res);

            await promisify(unlink)(filePath);
        });
    });

    describe('.move(dstPath: string): Promise<void>', () => {
        it('src path not exists', async () => {
            const srcPath = join(__dirname, 'file-move-src-path-not-exists');
            let err: Error = undefined;
            try {
                await new Self(srcPath).move('');
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });

        it('dst path not exists', async () => {
            let srcPath = join(__dirname, 'file-move-dst-path-not-exists-src');
            await promisify(mkdir)(srcPath);

            srcPath = join(srcPath, 'dir');
            await promisify(mkdir)(srcPath);

            srcPath = join(srcPath, 'file.txt');
            await promisify(writeFile)(srcPath, 'src');

            let dstPath = join(__dirname, 'file-move-dst-path-not-exists-dst', 'dir', 'file.txt');

            const self = new Self(srcPath);
            let err: Error;
            try {
                await self.move(dstPath);
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);

            let isExist = existsSync(dstPath);
            ok(isExist);
            await promisify(unlink)(dstPath);

            dstPath = dirname(dstPath);
            await promisify(rmdir)(dstPath);

            dstPath = dirname(dstPath);
            await promisify(rmdir)(dstPath);

            isExist = await self.exists();
            strictEqual(isExist, false);

            await self.remove();

            srcPath = dirname(srcPath);
            await promisify(rmdir)(srcPath);

            srcPath = dirname(srcPath);
            await promisify(rmdir)(srcPath);
        });

        it('dst path is exist', async () => {
            const dstPath = join(__dirname, 'file-move-dst-path-is-exists-dst');
            await promisify(writeFile)(dstPath, 'dst');

            const self = new Self('');
            let err: Error;
            try {
                await self.move(dstPath);
            } catch (ex) {
                err = ex;
            }

            ok(err);

            await promisify(unlink)(dstPath);
        });
    });

    describe('.readJSON(): Promise<any>', () => {
        it('ok', async () => {
            const file = new Self(__dirname, `file-readJSON-${Date.now()}.txt`);
            const obj = {
                id: 'test',
                name: 'readJSON',
            };
            await file.write(obj);

            const res = await file.readJSON();

            await file.remove();

            deepStrictEqual(res, obj);
        });
    });

    describe('.readString(): Promise<string>', () => {
        it('ok', async () => {
            const filePath = join(__dirname, `file-readString-${Date.now()}`);
            const text = 'readString';
            await promisify(writeFile)(filePath, text);

            const res = await new Self(filePath).readString();
            strictEqual(res, text);

            await promisify(unlink)(filePath);
        });
    });

    describe('.rm(): Promise<void>', () => {
        it('not exist', async () => {
            const filePath = join(__dirname, `file-rm-not-exist-${Date.now()}.txt`);
            let err: Error;
            try {
                await new Self(filePath).remove();
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);
        });

        it('ok', async () => {
            const filePath = join(__dirname, `file-rm-ok-${Date.now()}.txt`);
            await promisify(writeFile)(filePath, '');

            const file = new Self(filePath);
            let err: Error;
            try {
                await file.remove();
            } catch (ex) {
                err = ex;
            }

            strictEqual(err, undefined);

            const ok = await file.exists();
            strictEqual(ok, false);
        });
    });

    describe('.writeString(text: string): Promise<void>', () => {
        it('ok', async () => {
            const filePath = join(__dirname, `file-writeString-${Date.now()}`);
            const text = 'writeString';
            await new Self(filePath).write(text);

            const res = await promisify(readFile)(filePath, 'utf8');
            strictEqual(res, text);

            await promisify(unlink)(filePath);
        });

        it('obj', async () => {
            const filePath = join(__dirname, `file-writeString-${Date.now()}`);
            const obj = {
                a: 1,
                b: 2,
            };
            await new Self(filePath).write(obj);

            const res = await promisify(readFile)(filePath, 'utf8');

            await promisify(unlink)(filePath);

            strictEqual(res, JSON.stringify(obj, null, '\t'));
        });
    });
});
