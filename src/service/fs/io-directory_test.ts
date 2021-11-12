import { deepStrictEqual, ok, strictEqual } from 'assert';
import { existsSync, mkdir, readFile, rmdir, writeFile, unlink } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { FSIOFactory } from '.';
import { IODirectory as Self } from './io-directory';

const ioFactory = new FSIOFactory();

describe('src/service/fs/io-directory.ts', (): void => {
    describe('.exists(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-exsits-ok');
            await promisify(mkdir)(dirPath);

            const res = await new Self(ioFactory, dirPath).exists();
            ok(res);

            await promisify(rmdir)(dirPath);
        });

        it('not exist', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-exsits-not-exist');
            const res = await new Self(ioFactory, dirPath).exists();
            strictEqual(res, false);
        });
    });

    describe('.copyTo(dstDirPath: string)', () => {
        it('ok', async () => {
            const srcPath = join(__dirname, 'directory-copyTo-src');
            await promisify(mkdir)(srcPath);

            const fileA = 'file-a.txt';
            await promisify(writeFile)(
                join(srcPath, fileA),
                'a',
            );

            const dstPath = join(__dirname, 'directory-copyTo-dst');

            let err: Error;
            let isSrcExist: boolean;
            let res: string;
            try {
                await new Self(ioFactory, srcPath).copyTo(dstPath);
            } catch (ex) {
                err = ex;
            } finally {
                isSrcExist = existsSync(
                    join(srcPath, fileA),
                );

                res = await promisify(readFile)(
                    join(dstPath, fileA),
                    'utf8',
                );

                await promisify(unlink)(
                    join(srcPath, fileA)
                );
                await promisify(rmdir)(srcPath);
                await promisify(unlink)(
                    join(dstPath, fileA)
                );
                await promisify(rmdir)(dstPath);
            }
            strictEqual(err, undefined);
            ok(isSrcExist);
            strictEqual(res, 'a');
        });
    });

    describe('.findDirectories(): Promise<OSDirectory[]>', (): void => {
        it('ok', async (): Promise<void> => {
            const dirPath = join(__dirname, 'childDirectories');
            await promisify(mkdir)(dirPath);

            const childDirA = join(dirPath, 'd-a');
            await promisify(mkdir)(childDirA);

            const childDirB = join(dirPath, 'd-b');
            await promisify(mkdir)(childDirB);

            const fileA = join(dirPath, 'f-a.txt');
            await promisify(writeFile)(fileA, 'a');

            const res = await new Self(ioFactory, dirPath).findDirectories();
            await promisify(rmdir)(childDirA);
            await promisify(rmdir)(childDirB);
            await promisify(unlink)(fileA);
            await promisify(rmdir)(dirPath);

            strictEqual(res.length, 2);
            deepStrictEqual(
                res.map((r): string => {
                    return r.name;
                }),
                ['d-a', 'd-b']
            );
        });
    });

    describe('.findFiles(): Promise<OSFile[]>', (): void => {
        it('ok', async (): Promise<void> => {
            const dirPath = join(__dirname, 'childFiles');
            await promisify(mkdir)(dirPath);

            const childDirA = join(dirPath, 'd-a');
            await promisify(mkdir)(childDirA);

            const childDirB = join(dirPath, 'd-b');
            await promisify(mkdir)(childDirB);

            const fileA = join(dirPath, 'f-a.txt');
            await promisify(writeFile)(fileA, 'a');

            const res = await new Self(ioFactory, dirPath).findFiles();

            await promisify(rmdir)(childDirA);
            await promisify(rmdir)(childDirB);
            await promisify(unlink)(fileA);
            await promisify(rmdir)(dirPath);

            strictEqual(res.length, 1);
            deepStrictEqual(
                res.map((r): string => {
                    return r.name;
                }),
                ['f-a.txt']
            );
        });
    });

    describe('.move(dstPath: string): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const srcPath = join(__dirname, 'directory-mv-src-path-ok-src');
            await promisify(mkdir)(srcPath);
            await promisify(writeFile)(join(srcPath, 'file.txt'), 'one');
            await promisify(mkdir)(join(srcPath, 'dir'));

            const dstPath = join(__dirname, 'directory-mv-src-path-ok-dst');
            await new Self(ioFactory, srcPath).move(dstPath);

            const dstFilePath = join(dstPath, 'file.txt');
            let isExist = existsSync(dstFilePath);
            ok(isExist);

            const fileContent = await promisify(readFile)(dstFilePath, 'utf8');
            strictEqual(fileContent, 'one');

            isExist = existsSync(join(dstPath, 'dir'));
            ok(isExist);

            await new Self(ioFactory, dstPath).remove();
        });
    });

    describe('.remove(): Promise<void>', (): void => {
        it('has file', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-rm-has-file');
            await promisify(mkdir)(dirPath);

            const filePath = join(dirPath, 'file-a.txt');
            await promisify(writeFile)(filePath, '');

            await new Self(ioFactory, dirPath).remove();

            let res = existsSync(filePath);
            strictEqual(res, false);

            res = existsSync(dirPath);
            strictEqual(res, false);
        });

        it('has dir and file', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-rm-has-file');
            await promisify(mkdir)(dirPath);

            const filePath = join(dirPath, 'file-a.txt');
            await promisify(writeFile)(filePath, '');

            const childDirPath = join(dirPath, 'dir');
            await promisify(mkdir)(childDirPath);

            const childFilePath = join(childDirPath, 'file-b.txt');
            await promisify(writeFile)(childFilePath, '');

            await new Self(ioFactory, dirPath).remove();

            let res = existsSync(childFilePath);
            strictEqual(res, false);

            res = existsSync(childDirPath);
            strictEqual(res, false);

            res = existsSync(filePath);
            strictEqual(res, false);

            res = existsSync(dirPath);
            strictEqual(res, false);
        });

        it('not exists', async (): Promise<void> => {
            const dirPath = join(__dirname, 'directory-rm-not-exists');
            let err: Error;
            try {
                await new Self(ioFactory, dirPath).remove();
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });
    });
});
