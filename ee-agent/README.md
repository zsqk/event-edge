# fresh project

采用 [fresh]. 特点为:

1. fresh 不支持构建为前端项目, 目前只支持服务端渲染.
2. fresh 使用 Preact 而非 React.

[fresh]: https://fresh.deno.dev/

## Usage

Start the project:

```sh
deno task start
```

This will watch the project directory and restart as necessary.

## dev rules

项目要求, 而非完全等同于 fresh 要求.

1. 路由文件写在 `routes/` 文件夹内. 仅支持 `kebab-case` 命名方式.
2. 前端组件写在 `islands/` 文件夹内. 仅支持 `PascalCase` 命名方式.
3. 在 `islands/` 的前端组件必须有默认导出.
4. 在 `islands/` 的前端组件 props 必须是可被 JSON 序列化的.
5. 在 `routes/` 的路由文件内, 导出的 `handler` 会被自动执行.
6. 在 `routes/` 的路由文件可以有默认导出, 会被 handler 的第二个参数
   `ctx.render()` 渲染.
7. 在 `routes/` 的路由文件, 至少有默认导出或者 handler 导出中的一项, 可以都有.
