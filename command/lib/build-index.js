// command/lib/build-index.js

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import matter from "gray-matter";
import dayjs from "dayjs";
import { createUrl } from "./create-url.js";

/**
 * 扫描文档目录，生成内容索引数组
 * @param { string } docsDir   文档根目录（绝对路径）
 * @param { object } config    包含 userName, repoName, branch 等信息
 * @returns { Promise<Array> } 索引数据数组
 */
export async function buildIndex(docsDir, config) {
    const { userName, repoName, branch } = config;
    const result = []; // 收集所有文档元数据

    // 统一转成 YYYY-MM-DD，无效输入返回空字符串
    const fmt = d => (d ? dayjs(d).format("YYYY-MM-DD") : "");

    /**
     * 递归遍历目录
     * @param { string } dir  当前要扫描的目录（绝对路径）
     * @param { string } base 初始根目录，用于计算相对路径
     */
    async function walk(dir, base = docsDir) {
        // 读取当前目录下的所有实体（文件+文件夹）
        const entries = await readdir(dir, { withFileTypes: true });

        for (const ent of entries) {
            const full = join(dir, ent.name); // 当前实体的绝对路径

            // 遇到子目录→递归往里走
            if (ent.isDirectory()) {
                await walk(full, base);
                continue;
            }

            // 只处理 .md 文件，且忽略可能已存在的 index.json
            if (!ent.name.endsWith(".md") || ent.name === "index.json") continue;

            // 生成 slug：相对于 docsDir 的 Unix 风格路径，去掉 .md 后缀
            const slug = relative(base, full).replace(/\.md$/, "").replace(/\\/g, "/"); // Windows 路径转 Unix

            // 拼出在仓库中的文件路径，供 createUrl 使用
            const filePath = `documents/${slug}.md`;

            // 生成 GitHub Raw 直链
            const link = createUrl({ userName, repoName, branch, path: filePath });

            // 读取文件内容并解析 front-matter
            const raw = await readFile(full, "utf8");
            const { data } = matter(raw); // gray-matter 解析 --- 区块

            // 组装一条记录，缺字段时给默认值
            result.push({
                slug,
                title: data.title ?? ent.name.replace(/\.md$/, ""),
                description: data.description ?? "",
                date: {
                    created: fmt(data.created),
                    updated: fmt(data.updated),
                    revisions: Number(data.revisions ?? 1),
                },
                tags: [].concat(data.tags ?? []),
                link,
            });
        }
    }

    // 启动递归
    await walk(docsDir);

    // 按创建日期降序（新 → 旧）
    return result.sort((a, b) => {
        const ac = a.date.created?.toString?.() || "0";
        const bc = b.date.created?.toString?.() || "0";
        return bc.localeCompare(ac); // 降序
    });
}
