CREATE TABLE "event_edge" (
    "id" SERIAL PRIMARY KEY,
    "type" text NOT NULL,
    "num" text NOT NULL UNIQUE,
    "after_at" bigint,
    "before_at" bigint,
    "max_retry" bigint NOT NULL,
    "had_retry" bigint NOT NULL DEFAULT 0,
    "interval" bigint NOT NULL,
    "payload" jsonb NOT NULL,
    "result" jsonb NOT NULL,
    "created_at" bigint NOT NULL,
    "updated_at" bigint NOT NULL,
    "state" text NOT NULL,
    "handler" text
);

COMMENT ON COLUMN "event_edge"."type" IS '事件类型, 枚举值';
COMMENT ON COLUMN "event_edge"."num" IS '事件代号';
COMMENT ON COLUMN "event_edge"."after_at" IS '开始时间, 在此之前不执行';
COMMENT ON COLUMN "event_edge"."before_at" IS '结束时间, 在此之后不执行';
COMMENT ON COLUMN "event_edge"."max_retry" IS '可尝试次数';
COMMENT ON COLUMN "event_edge"."had_retry" IS '已尝试次数';
COMMENT ON COLUMN "event_edge"."interval" IS '重复间隔时间, 单位毫秒, -1 为不重复';
COMMENT ON COLUMN "event_edge"."payload" IS '传入参数';
COMMENT ON COLUMN "event_edge"."result" IS '返回结果';
COMMENT ON COLUMN "event_edge"."state" IS '状态, 枚举值';
COMMENT ON COLUMN "event_edge"."handler" IS '当前处理者';
