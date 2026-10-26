// Creates (or promotes) the first administrator. No default password exists anywhere in this project.
// Interactive:   npm run admin:create
// Non-interactive (CI):  ADMIN_EMAIL=you@example.com ADMIN_NAME="You" ADMIN_PASSWORD='...' npm run admin:create
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'node:readline';

const db = new PrismaClient();

function ask(q: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      (rl as any)._writeToOutput = (s: string) => { if (s.includes(q)) process.stdout.write(s); else process.stdout.write('*'); };
    }
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(a.trim()); });
  });
}

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? (await ask('Admin email: '))).toLowerCase();
  const name = process.env.ADMIN_NAME ?? (await ask('Display name: '));
  const pw = process.env.ADMIN_PASSWORD ?? (await ask('Password (min 12 chars): ', true));
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Invalid email');
  if (name.length < 2) throw new Error('Display name too short');
  if (pw.length < 12) throw new Error('Password must be at least 12 characters');
  const passwordHash = await bcrypt.hash(pw, 12);
  const u = await db.user.upsert({ where: { email }, update: { role: 'ADMIN', passwordHash, displayName: name }, create: { email, displayName: name, passwordHash, role: 'ADMIN' } });
  console.log(`Administrator ready: ${u.email}. Sign in at /admin/login`);
}
main().catch((e) => { console.error(e.message ?? e); process.exit(1); }).finally(() => db.$disconnect());
