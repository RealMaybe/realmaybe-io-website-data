// command/lib/create-url.js

/**
 * 生成 GitHub raw 内容链接
 * @param { Object } options - 配置选项
 * @param { string } options.userName - GitHub 用户名
 * @param { string } options.repoName - 仓库名
 * @param { string } [options.branch="main"] - 分支名，默认为 "main"
 * @param { string } options.path - 文件在仓库中的路径（如 "data/index.json"）
 * @returns { string|null } 生成的 URL，参数无效时返回 null
 */
export const createUrl = ({
    userName, // GitHub 用户名
    repoName, // 仓库名
    branch = "main", // 默认分支
    path, // 文件路径
}) => {
    if (!userName || !repoName || !path) {
        console.error("createUrl 错误：缺少必要参数 (userName, repoName, path)");
        return null;
    }

    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `https://raw.githubusercontent.com/${userName}/${repoName}/${branch}/${normalizedPath}`;
};
