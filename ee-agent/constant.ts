/**
 * 数据库地址
 */
export const DATABASE_URL = Deno.env.get('DATABASE_URL') ?? '';
if (!DATABASE_URL) {
  throw new TypeError('DATABASE_URL');
}
