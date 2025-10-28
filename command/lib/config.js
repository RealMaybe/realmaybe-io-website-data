// command/lib/config.js

const outFile = "data/docs.json"

export const CONFIG = Object.freeze({
    // GitHub 信息
    userName: "RealMaybe",
    repoName: "realmaybe-io-website-data",
    branch: "main",

    // 路径配置
    docsDir: "documents", // 相对根目录
    outDir: "data",
    outFile,

    // 特殊条目配置
    specialEntries: {
        self: {
            slug: "self",
            title: "Document Index",
            description: "This JSON file contains all document metadata.",
            type: "system",
            path: outFile,
        },
    },
});
