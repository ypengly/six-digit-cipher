export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export const pad2 = (n: number) => String(n).padStart(2, '0');
export const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${pad2(sec % 60)}`;
export const todayUTC = (d = new Date()) => d.toISOString().slice(0, 10);
export const jsonParse = <T,>(s: string, fallback: T): T => { try { return JSON.parse(s) as T; } catch { return fallback; } };
