# 中文独立博客 · Anubis / uBlacklist 列表

把 [timqian/chinese-independent-blogs](https://github.com/timqian/chinese-independent-blogs) 收录的中文独立博客，转换成 [Anubis](https://github.com/Bishop-V/anubis) 列表和 uBlacklist 规则集，由 GitHub Actions **每天自动同步**一次。

## 订阅

**Anubis 用户**（设置 → 列表 → 添加列表，或点一键订阅）：

- 订阅链接：`https://bishop-v.github.io/anubis/subscribe?url=<本仓库 raw 地址的 URL 编码>&name=中文独立博客`（TODO：发布后把 raw 地址填入）
- 或手动把列表地址粘贴进 **Settings → Lists → Add a list**：
  `https://raw.githubusercontent.com/<你的用户名>/<仓库名>/main/out/chinese-independent-blogs.anubis`

**uBlacklist 用户**：订阅 `out/chinese-independent-blogs.txt`（高亮规则）。

## 内容与反馈

- 列表内容全部来自源仓库 [timqian/chinese-independent-blogs](https://github.com/timqian/chinese-independent-blogs)（MIT 许可），本仓库只做格式转换与每日同步，**不审核、不增删任何博客**。
- 发现收录错漏（博客失效、信息错误、想新增博客），请到**源仓库**提 issue 或 PR，同步后这里次日自动更新。

## 机制

| 文件 | 说明 |
| --- | --- |
| `scripts/convert.mjs` | CSV → 两种格式的转换脚本 |
| `data/blogs-original.csv` | 上游 CSV 的同步快照 |
| `out/chinese-independent-blogs.anubis` | Anubis 列表（`tag=cn-blog`，只打标签不排名） |
| `out/chinese-independent-blogs.txt` | uBlacklist 规则集（`@1` 高亮） |
| `.github/workflows/update-list.yml` | 每日 03:17 UTC 拉取 → 转换 → 有变化才提交 |

反馈请前往[源仓库](https://github.com/timqian/chinese-independent-blogs)。
