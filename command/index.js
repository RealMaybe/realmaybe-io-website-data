// command/index.js

import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { CONFIG } from "./lib/config.js";
import { buildIndex } from "./lib/build-index.js";
import { createUrl } from "./lib/create-url.js"; // 需要导入 createUrl

// 解析绝对路径
const ROOT = resolve();
const docsDir = join(ROOT, CONFIG.docsDir);
const outDir = join(ROOT, CONFIG.outDir);
const outFile = join(ROOT, CONFIG.outFile);

// 生成 GitHub raw 内容链接
const { self: selfConfig } = CONFIG.specialEntries;

// 主流程
async function main() {
    try {
        await mkdir(outDir, { recursive: true });

        // 1. 正常构建文档索引（返回排序后的数组）
        const documents = await buildIndex(docsDir, CONFIG);

        // 2. 构造特殊项

        // 👉 第0项：index.json 自身的链接
        const selfEntry = {
            ...selfConfig,
            link: createUrl({
                ...CONFIG,
                path: selfConfig.path,
            }),
        };

        // 3. 合并数组
        const finalIndex = [
            {
                ...selfEntry,
                generatedAt: Date.now(), // 添加时间戳
            },
            ...documents,
        ];

        // 4. 写入 JSON
        await writeFile(outFile, JSON.stringify(finalIndex, null, 4), "utf8");

        console.log(
            `✅ 已生成索引：${finalIndex.length} 项（包含 self + ${documents.length} 文档）`
        );
    } catch (error) {
        console.error("❌ 构建索引失败：", error);
        process.exit(1);
    }
}

// 执行主流程
main();
