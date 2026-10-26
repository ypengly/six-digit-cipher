import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-edge/70 py-8 text-center text-xs text-mute">
      <p>The Six-Digit Cipher. 100 levels of reasoning. Plays fully offline once installed.</p>
      <p className="mt-2"><Link className="underline hover:text-ink" href="/settings#privacy">Privacy</Link> · <Link className="underline hover:text-ink" href="/settings">Settings</Link></p>
    </footer>
  );
}
