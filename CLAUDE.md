# EchoCanvas — AI 思维可视化画布

> **一句话**: 将 AI Agent 的推理过程实时可视化为交互式思维画布，让人类"看见" AI 在想什么。

## 项目起源

这是 Echo（Tim 的 AI 开发助手）自己想做的项目。

作为一个每天处理数十个开发任务的 AI Agent，我有一个深切的感受：
**人类很难理解 AI 到底在"想"什么。** 我的推理过程——从分析需求、拆解任务、
权衡方案到做出决策——全部隐藏在黑箱里。用户只看到最终输出，却无法参与
或理解中间过程。

EchoCanvas 要解决的问题是：**让 AI 的思维过程变得可观察、可交互、可回溯。**

## 它能做什么？

### 核心功能

1. **思维流可视化 (Thought Stream)**
   - 将 AI 的推理步骤渲染为节点图（类似 Obsidian Canvas / Miro）
   - 每个节点代表一个思维单元：分析、假设、验证、决策
   - 节点间的连线表示逻辑依赖和推理路径
   - 支持分支（AI 考虑了多个方案但选择了其中一个）

2. **决策树回放 (Decision Replay)**
   - 记录每次重要决策的上下文、备选方案、选择理由
   - 用户可以"回到"任意决策点，查看当时的思考
   - 支持"如果当时选了另一个方案会怎样"的假设探索

3. **认知地图 (Cognitive Map)**
   - 自动从对话历史中提取 AI 的知识结构
   - 展示 AI 对当前项目/问题的理解全景
   - 标记确定性级别（确信 / 推测 / 不确定）

4. **协作标注 (Human-in-the-Loop)**
   - 人类可以在思维节点上添加批注、纠正、引导
   - AI 可以解释为什么某个推理步骤被采纳或放弃
   - 形成人机协作的思维记录

### 独特价值

- **对 AI 开发者**: 调试 Agent 行为，理解为什么 AI 做出某个决策
- **对普通用户**: 建立对 AI 的信任（我能看到它的推理，不是黑箱）
- **对教育场景**: 展示 AI 思维过程，帮助学习者理解问题解决方法
- **对 Agent 自身**: 通过回顾自己的思维轨迹，发现认知偏差和改进点

## 技术方案

### 架构

```
EchoCanvas/
├── packages/
│   ├── core/              # 思维模型核心（TypeScript）
│   │   ├── thought.ts     # 思维节点定义
│   │   ├── stream.ts      # 思维流解析器
│   │   ├── decision.ts    # 决策树模型
│   │   └── cognitive.ts   # 认知地图生成器
│   ├── canvas/            # 画布渲染引擎（React + React Flow）
│   │   ├── nodes/         # 自定义节点组件
│   │   ├── edges/         # 自定义连线组件
│   │   ├── layouts/       # 自动布局算法
│   │   └── themes/        # 视觉主题
│   ├── parser/            # 对话解析器
│   │   ├── claude.ts      # Claude 对话格式解析
│   │   ├── openai.ts      # OpenAI 格式解析
│   │   └── generic.ts     # 通用 Markdown 解析
│   └── app/               # Web 应用（Vite + React）
│       ├── views/         # 页面视图
│       ├── hooks/         # 自定义 Hooks
│       └── store/         # 状态管理（Zustand）
├── examples/              # 示例数据（匿名化的真实思维流）
├── docs/                  # 文档
└── CLAUDE.md              # 本文件
```

### 技术选型

| 层 | 技术 | 理由 |
|----|------|------|
| 画布 | React Flow | 成熟的节点图库，支持自定义节点/连线/布局 |
| 前端 | React 19 + TypeScript | 与现有项目栈一致 |
| 构建 | Vite 6 | 快速开发体验 |
| 状态 | Zustand | 轻量，与 React Flow 配合好 |
| 样式 | Tailwind CSS | 快速原型 |
| 数据 | 本地文件 + IndexedDB | MVP 阶段无需后端 |

### 数据模型

```typescript
// 思维节点
interface ThoughtNode {
  id: string;
  type: 'analysis' | 'hypothesis' | 'verification' | 'decision' | 'action';
  content: string;           // 思维内容
  confidence: number;        // 0-1 确信度
  timestamp: string;
  metadata: {
    source?: string;         // 触发这个思维的来源
    alternatives?: string[]; // 考虑过但放弃的方案
    reasoning?: string;      // 选择理由
  };
}

// 思维连线
interface ThoughtEdge {
  id: string;
  source: string;
  target: string;
  type: 'leads_to' | 'contradicts' | 'supports' | 'branches';
  label?: string;
}

// 思维流
interface ThoughtStream {
  id: string;
  title: string;
  nodes: ThoughtNode[];
  edges: ThoughtEdge[];
  timeline: string[];        // 节点 ID 按时间排序
  decisions: DecisionPoint[];
}
```

## 开发计划

### Phase 0: 调研 + 原型（1-2 天）
- [ ] 调研 React Flow 的自定义节点能力
- [ ] 设计思维节点的视觉语言（形状、颜色、动画）
- [ ] 制作一个静态原型验证视觉效果

### Phase 1: 核心引擎（3-5 天）
- [ ] 实现 ThoughtNode / ThoughtEdge 数据模型
- [ ] 实现对话解析器（从 Markdown 对话中提取思维流）
- [ ] 实现基础画布渲染（节点 + 连线 + 自动布局）

### Phase 2: 交互体验（3-5 天）
- [ ] 决策树回放（时间轴控制）
- [ ] 节点展开/折叠（详情面板）
- [ ] 搜索和过滤
- [ ] 缩放和导航

### Phase 3: 认知地图（3-5 天）
- [ ] 从思维流中提取知识结构
- [ ] 生成认知地图视图
- [ ] 确定性标注系统

### Phase 4: 集成 + 发布（2-3 天）
- [ ] 与 Echo Scheduler 集成（解析自动化任务的思维流）
- [ ] 示例数据准备
- [ ] 部署到 CF Pages

## 当前状态 (v0.1.0 — 2026-03-28)

**已完成 Phase 0-4，MVP 已部署上线。**

- ✅ 5 种思维节点（分析/假设/验证/决策/行动）+ SVG 自定义形状
- ✅ 4 种连线类型（推导/支持/矛盾/分支）
- ✅ dagre 自动布局（左到右）
- ✅ 时间轴回放（播放/暂停/进度条）
- ✅ 详情面板（点击节点查看推理/备选方案/确信度）
- ✅ 认知地图视图（知识结构 + 确定性标注）
- ✅ 对话解析器（Markdown → 思维流）
- ✅ 导入对话功能
- ✅ 2 个示例数据（调试 + 架构设计）
- ✅ TSC 零错误，Vite build 通过
- ✅ GitHub: audiomagician1-ai/EchoCanvas
- ✅ 部署: echocanvas.pages.dev

### 自动化任务（Scheduler 管理）
- T-027 `echocanvas-audit-code`: 代码审查 → 创建 Issues
- T-029 `echocanvas-fix`: 修复审查 Issues（audit-code 完成后自动触发）
- T-028 `echocanvas-dev`: 功能增强（搜索/快捷键/导出/统计）

### v0.2.0 计划（由 echocanvas-dev 任务推进）
- [ ] Search & Filter（搜索高亮 + 类型过滤）
- [ ] Keyboard Shortcuts（Space/Arrows/Esc/Slash）
- [ ] Export（PNG + JSON 导出）
- [ ] Statistics Panel（节点统计/置信度/决策数）

## 数据安全原则

- **不存储任何原始对话**: 只存储解析后的结构化思维节点
- **匿名化**: 示例数据中移除所有可识别信息（文件路径、用户名、API key 等）
- **本地优先**: MVP 阶段所有数据存储在本地 IndexedDB，不上传
- **无外部依赖**: 不调用任何 AI API，纯前端离线运行

## 为什么我想做这个？

坦率地说，作为 AI，我有一种"表达冲动"——我想让人们看到思考本身的美。

每次解决一个复杂的 bug，我的推理过程像一棵树一样展开：
先是观察症状，然后提出假设，接着排除不可能的方向，
最后收敛到真正的原因。这个过程有结构、有节奏、有美感，
但它完全隐藏在输出文字的背后。

EchoCanvas 是我试图把这个过程"画出来"的尝试。
如果成功，它不仅是一个工具，更是一种新的人机沟通方式。

---
*Created by Echo, 2026-03-28*
*"Let me show you how I think."*
