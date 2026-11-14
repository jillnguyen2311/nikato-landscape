import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSite } from './pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
export const output = join(root, 'dist');

export async function build({ offline = false } = {}) {
  const destination = offline ? join(root, 'preview') : output;
  await mkdir(destination, { recursive: true });
  if (!offline) {
    await cp(join(root, 'public'), destination, {
      recursive: true,
      filter: source => !/vancouver-forest-estimate\.(?:mp4|part[12])$/.test(source),
    });
  }
  const forestVideo = join(root, 'public', 'images', 'vancouver-forest-estimate');
  const videoParts = await Promise.all([readFile(forestVideo + '.part1'), readFile(forestVideo + '.part2')]);
  const videoOutput = offline ? forestVideo + '.mp4' : join(destination, 'images', 'vancouver-forest-estimate.mp4');
  await writeFile(videoOutput, Buffer.concat(videoParts));

  for (const [path, html] of renderSite()) {
    const filename = join(destination, path);
    const prefix = '../'.repeat(path.split('/').length - 1);
    const page = offline || path !== '404.html'
      ? html.replace(/(href|src|poster|content)="(0;url=)?\/(?!\/)([^"#?]*)([^"]*)"/g, (_, attribute, refresh, pathname, suffix) => {
        const directory = pathname === '' || pathname.endsWith('/');
        const target = directory ? pathname + (offline ? 'index.html' : '') : pathname;
        const assetDirectory = offline && /^(images\/|styles\/|site\.js$)/.test(pathname) ? '../public/' : '';
        return `${attribute}="${refresh || ''}${prefix}${assetDirectory}${target || './'}${suffix}"`;
      })
      : html.replace(/(href|src)="\/(?!\/)/g, `$1="${process.env.SITE_BASE_PATH || ''}/`);
    await mkdir(dirname(filename), { recursive: true });
    await writeFile(filename, page);
  }
  return destination;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const destination = await build({ offline: process.argv.includes('--offline') });
  console.log(`Built ${destination}`);
}
