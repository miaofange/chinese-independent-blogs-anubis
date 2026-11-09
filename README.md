# 中文独立博客 · Anubis / uBlacklist 列表

把 [timqian/chinese-independent-blogs](https://github.com/timqian/chinese-independent-blogs) 收录的中文独立博客，转换成 [Anubis](https://github.com/Bishop-V/anubis) 列表和 uBlacklist 规则集，由 GitHub Actions **每天自动同步**一次。

## 订阅

**Anubis 用户**（设置 → 列表 → 添加列表，或点一键订阅）：

- [一键订阅（Anubis）](https://bishop-v.github.io/anubis/subscribe?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmiaofange%2Fchinese-independent-blogs-anubis%2Fmain%2Fout%2Fchinese-independent-blogs.anubis&name=%E4%B8%AD%E6%96%87%E7%8B%AC%E7%AB%8B%E5%8D%9A%E5%AE%A2)
- 或手动把列表地址粘贴进 **Settings → Lists → Add a list**：
  https://raw.githubusercontent.com/miaofange/chinese-independent-blogs-anubis/main/out/chinese-independent-blogs.anubis

**uBlacklist 用户**：订阅 [out/chinese-independent-blogs.txt](https://raw.githubusercontent.com/miaofange/chinese-independent-blogs-anubis/main/out/chinese-independent-blogs.txt)（高亮规则）。

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
