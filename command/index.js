// command/index.ts
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// 当前文件所在目录 → command
const __dirname = dirname(fileURLToPath(import.meta.url));
// 仓库根目录 → 往上退一层
const repoRoot = join(__dirname, "..");
// 目标文件
const outFile = join(repoRoot, "data", "docs.json");

// 假设要写的内容
const data = {
    list: [],
};

// 保证目录存在（Node 22 支持 recursive）
writeFileSync(outFile, JSON.stringify(data), "utf-8");
console.log("✅ 已写入 →", outFile);
