import postgres from 'https://deno.land/x/postgresjs@v3.3.3/mod.js';
import { TransactionSql } from 'https://deno.land/x/postgresjs@v3.3.3/types/index.d.ts';
import { DATABASE_URL } from './constant.ts';

/**
 * 数据库连接基础 (并未真正执行连接)
 * @author Lian Zheren <lzr@zsqk.com.cn>
 */
export const sql = postgres(DATABASE_URL, {
  ssl: 'require',
  connection: { application_name: 'ee-agent' },
});

export type SQLClient = typeof sql;

export type SQLTransaction = TransactionSql;
