/** UNIX 时间戳 (秒) */
export type UnixTimestamp = number;

/** UNIX 时间戳 (毫秒) */
export type MillisTimestamp = number;

/** 毫秒 */
export type Millisecond = number;

/**
 * HTTP Status Code
 */
export type HTTPStatusCode = number;

export type SQLType = 'int' | 'bigint' | 'text' | 'jsonb' | 'text[]';

/**
 * 边缘处理事件 基础类型
 * @author Lian Zheren <lzr@zsqk.com.cn>
 */
interface EventEdgeBase {
  id: bigint;
  /** 事件类型, 枚举值 */
  type:
    | 'test'
    | 'webhook-zsqk'
    | 'postgresql-monitor'
    | 'https-monitor'
    | 'network-monitor'
    | 'exec';
  /** 事件代号 (全局唯一) */
  num: string;
  /** 在此时间之后执行, 最小时间 */
  afterAt?: UnixTimestamp;
  /** 在此时间之前执行, 最大时间 */
  beforeAt?: UnixTimestamp;
  /** 最大尝试次数, 需要尝试次数小于等于该次数 */
  maxRetry: bigint;
  /** 已经尝试次数 */
  hadRetry: bigint;
  /** 重复间隔时间, 单位毫秒, -1 为不重复 */
  interval: Millisecond;
  /** 事件内容 */
  payload: unknown;
  /** 事件执行结果 */
  result: unknown;
  createdAt: UnixTimestamp;
  updatedAt: UnixTimestamp;
  state: EventEdgeState;
  /** 事件处理者名称 */
  handler?: string;
}

export enum EventEdgeState {
  等待中 = 'pending',
  处理中 = 'processing',
  以成功结束 = 'success',
  以失败结束 = 'failed',
  以超时结束 = 'timeout',
}

export function isEventEdgeState(v: unknown): v is EventEdgeState {
  if (Object.values(EventEdgeState).includes(v as any)) {
    return true;
  }
  return false;
}

export function isEventEdgeType(v: unknown): v is EventEdge['type'] {
  if (
    v === 'test' ||
    v === 'network-monitor' ||
    v === 'postgresql-monitor' ||
    v === 'https-monitor' ||
    v === 'exec'
  ) {
    return true;
  }
  return false;
}

/**
 * 边缘处理事件
 * @author Lian Zheren <lzr@zsqk.com.cn>
 */
export type EventEdge =
  | TestEvent
  | NetMonitorEvent
  | PgMonitorEvent
  | HttpsMonitorEvent
  | ExecEvent;

export interface TestEvent extends EventEdgeBase {
  type: 'test';
  payload: { delay: number; unit?: 's' | 'ms' };
}

/**
 * 网络端口监控事件
 * @author Lian Zheren <lzr@zsqk.com.cn>
 */
export interface NetMonitorEvent extends EventEdgeBase {
  type: 'network-monitor';
  payload: { host: string; port: string; isClose?: boolean };
  result: {
    lastFailedAt: MillisTimestamp;
    lastSuccessAt: MillisTimestamp;
  };
}

/**
 * PostgreSQL 数据库监控事件
 * @author Lian Zheren <lzr@zsqk.com.cn>
 */
export interface PgMonitorEvent extends EventEdgeBase {
  type: 'postgresql-monitor';
  payload: {
    hostname: string;
    port: string;
    user: string;
    password: string;
    database: string;
  };
  result: {
    lastFailedAt: MillisTimestamp;
    lastSuccessAt: MillisTimestamp;
  };
}

/**
 * HTTPS 服务监控事件
 * (特地不做 HTTP 的监控, 只因为我们要在任何时候避免 HTTP)
 * @author Lian Zheren <lzr@zsqk.com.cn>
 */
export interface HttpsMonitorEvent extends EventEdgeBase {
  type: 'https-monitor';
  payload: {
    /** 要检查的 HTTPS 地址 */
    url: string;
    /** 预期的返回状态码 */
    status: HTTPStatusCode;
    /** 超时时间, 超过此时间即为失败 */
    timeout?: Millisecond;
  };
  result: {
    /** 最后失败时检查到的实际 HTTP 返回状态码 */
    lastFailedStatus: HTTPStatusCode;
    /** 最后失败时间 */
    lastFailedAt: MillisTimestamp;
    /** 最后成功时间 */
    lastSuccessAt: MillisTimestamp;
  };
}

/**
 * 命令执行事件
 *
 * 可用于:
 *
 * - deno cli 执行, 通过 `deno run -A some`
 * - 任意其他命令
 *
 * @author Lian Zheren <lzr@zsqk.com.cn>
 */
export interface ExecEvent extends EventEdgeBase {
  type: 'exec';
  payload: {
    /**
     * 仓库地址
     * 可以使用 HTTPS 或者 SSH 协议进行传输.
     */
    gitRepo: string;
    /**
     * SSH 密钥 (如果为 SSH 连接的话)
     *
     * 需要是完整的 text 内容.
     */
    gitKey?: string;
    /**
     * 相对目录
     *
     * 比如 `./somedir/`
     *
     * 作用例如用于 deno.json 的自动寻找.
     */
    dir?: string;
    /**
     * 需要运行的命令
     *
     * 比如 `deno run -A some.ts`
     */
    script: string[];
    /**
     * 运行时环境变量. 如果与已有环境变量重复, 则会覆盖.
     */
    env?: Record<string, string>;
  };
  result:
    | { success: true; res: unknown }
    | { success: false; code?: number; errMsg: string };
}
