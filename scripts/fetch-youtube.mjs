// Fetches the latest videos of the ensemble's YouTube channel (public RSS feed) at build time
// and writes them to src/youtube.json. If the fetch fails, the existing file is kept and the
// site falls back to embedding the channel's full "uploads" playlist.
import fs from 'fs';

const CHANNEL = 'UCKnjkzokNy3O1K2ccuJL1PA';
const OUT = new URL('../src/youtube.json', import.meta.url);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

try {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1],
    title: decode((e.match(/<title>([^<]*)<\/title>/) || [])[1] || ''),
    published: (e.match(/<published>([^<]+)<\/published>/) || [])[1] || '',
  })).filter((v) => v.id);
  if (!videos.length) throw new Error('no videos in feed');
  fs.writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), videos }, null, 2));
  console.log(`youtube: ${videos.length} videos`);
} catch (e) {
  console.warn(`youtube: feed not available (${e.message}) — keeping src/youtube.json`);
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, JSON.stringify({ updated: null, videos: [] }, null, 2));
}
