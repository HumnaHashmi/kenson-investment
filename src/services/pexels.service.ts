// Pexels API — https://www.pexels.com/api/
// Get your free key at https://www.pexels.com/api/new/ and paste it below.
const PEXELS_API_KEY = '5TKwGgTtQz2LlKAC9TKABTx4SC0PuFwdVf0wYHmTDBBz8jAOzUvBQEzU';

const BASE = 'https://api.pexels.com/videos';

export interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  link: string;
  width: number;
  height: number;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;      // thumbnail
  video_files: PexelsVideoFile[];
}

interface SearchResponse {
  videos: PexelsVideo[];
  total_results: number;
  per_page: number;
}

/** Returns the best-quality mp4 link for a Pexels video. */
export function pickVideoUrl(video: PexelsVideo): string {
  const files = video.video_files.filter(f => f.file_type === 'video/mp4');
  // prefer hd, fall back to sd, then whatever is available
  const hd = files.find(f => f.quality === 'hd');
  const sd = files.find(f => f.quality === 'sd');
  return (hd ?? sd ?? files[0])?.link ?? '';
}

/** Search Pexels for videos matching `query`. Returns up to `perPage` results. */
export async function searchPexelsVideos(
  query: string,
  perPage = 6,
): Promise<PexelsVideo[]> {
  const url = `${BASE}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&size=medium&orientation=landscape`;

  const res = await fetch(url, {
    headers: { Authorization: PEXELS_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  const data: SearchResponse = await res.json();
  return data.videos;
}
