# 教室匹配管理原型

这是可直接部署到 GitHub Pages 的纯静态版本，无需安装依赖或执行构建命令。

## 文件说明

- `index.html`：站点入口。
- `prototype-app.css`：页面样式。
- `prototype-app.js`：页面数据与交互逻辑。
- `.nojekyll`：关闭 Jekyll 处理，按静态文件原样发布。
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动发布流程。

## 部署方法

1. 新建一个 GitHub 仓库，将本目录内的全部文件上传到仓库根目录。
2. 确认默认分支名称为 `main`。
3. 进入仓库的 `Settings` → `Pages`。
4. 在 `Build and deployment` 中，将 `Source` 选择为 `GitHub Actions`。
5. 推送代码后，等待仓库 `Actions` 页面中的发布任务完成。

发布地址通常为：

`https://你的GitHub用户名.github.io/仓库名称/`

## 使用说明

- 页面为交互原型，所有数据均为前端示例数据。
- 页面内产生的临时操作记录会在刷新页面后恢复为初始状态。
- GitHub Pages 网站通常可被公开访问，发布前请确认页面中不包含敏感信息。
