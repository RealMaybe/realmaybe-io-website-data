// command/lib/config.js

export const CONFIG = Object.freeze({
    // GitHub 信息
    userName: "RealMaybe",
    repoName: "realmaybe-io-website-data",
    branch: "main",

    // 路径配置
    docsDir: "documents", // 相对根目录
    outDir: "data",
    outFile: "data/docs.json",

    // 特殊条目配置
    specialEntries: {
        self: {
            slug: "self",
            title: "Document Index",
            description: "This JSON file contains all document metadata.",
            type: "system",
            path: "data/index.json",
        },
    },
});
