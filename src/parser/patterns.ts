import type { ThoughtType, EdgeRelation } from '../core/types';

/**
 * Signal words/phrases that indicate a specific thought type.
 * Used by the parser to classify paragraphs in AI conversations.
 */
export const THOUGHT_SIGNALS: Record<ThoughtType, RegExp[]> = {
  analysis: [
    /(?:看到|发现|观察|读取|日志|错误|报错|stack trace|log shows|error|found that|examining|reading|the .+ shows)/i,
    /(?:分析|检查|查看|review|inspect|check|look at|observe)/i,
    /(?:当前状态|目前|现在的情况|the current|status is)/i,
  ],
  hypothesis: [
    /(?:可能|也许|推测|猜测|假设|perhaps|maybe|might be|could be|hypothesis|suspect)/i,
    /(?:如果|假如|假定|what if|suppose|assuming)/i,
    /(?:原因可能|一种可能|likely because|probably)/i,
  ],
  verification: [
    /(?:验证|测试|确认|运行|结果|通过|失败|verified|confirmed|test shows|result|pass|fail)/i,
    /(?:build|compile|run|execute|check.*(?:pass|fail|success|error))/i,
    /(?:证实|否定|排除|confirmed|ruled out|eliminated)/i,
  ],
  decision: [
    /(?:决定|选择|采用|确定|最终|方案|decided|choose|select|going with|the plan is)/i,
    /(?:权衡|比较|trade-?off|versus|vs\.|compared)/i,
    /(?:最佳|最好|optimal|best approach|recommended)/i,
  ],
  action: [
    /(?:修改|实现|提交|部署|创建|删除|commit|push|deploy|implement|create|fix|write)/i,
    /(?:完成|done|finished|shipped|merged|applied)/i,
    /(?:执行|运行|操作|execute|perform|apply|install)/i,
  ],
};

/**
 * Signal words that suggest edge relationships between thoughts.
 */
export const EDGE_SIGNALS: Record<EdgeRelation, RegExp[]> = {
  leads_to: [
    /(?:因此|所以|therefore|thus|hence|consequently|so|this means)/i,
    /(?:接下来|然后|下一步|next|then|moving on)/i,
  ],
  supports: [
    /(?:证实|支持|confirm|support|validate|consistent with)/i,
    /(?:进一步说明|reinforces|backs up|agrees with)/i,
  ],
  contradicts: [
    /(?:但是|然而|不过|矛盾|否定|however|but|contradicts|inconsistent|rules out)/i,
    /(?:排除|不是|并非|not the case|wrong|incorrect|disprove)/i,
  ],
  branches: [
    /(?:另一个|或者|备选|alternative|another option|or we could|on the other hand)/i,
    /(?:方案[A-Z]|option [A-Z]|plan [A-Z]|approach [A-Z])/i,
  ],
};

/** Confidence modifiers */
export const CONFIDENCE_BOOST: Array<{ pattern: RegExp; delta: number }> = [
  { pattern: /(?:确定|确信|definitely|certainly|clearly|obviously)/i, delta: 0.2 },
  { pattern: /(?:可能|也许|perhaps|maybe|might)/i, delta: -0.2 },
  { pattern: /(?:不确定|不清楚|uncertain|unclear|unsure|not sure)/i, delta: -0.3 },
  { pattern: /(?:验证|确认|confirmed|verified|tested|proved)/i, delta: 0.15 },
];