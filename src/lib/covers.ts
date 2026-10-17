import gdgCover from '../assets/images/gdg_runner_poster_cover_1792189082693.jpg';
import flappyCover from '../assets/images/game_flappy_bird_1792188188452.jpg';
import punkCover from '../assets/images/game_punk_jumper_1792188188557.jpg';
import nebulaCover from '../assets/images/game_nebula_vanguard_1792188188491.jpg';

const PRESETS = [
  { key: 'gdg_runner_poster_cover_1792189082693', url: gdgCover },
  { key: 'game_flappy_bird_1792188188452', url: flappyCover },
  { key: 'game_punk_jumper_1792188188557', url: punkCover },
  { key: 'game_nebula_vanguard_1792188188491', url: nebulaCover },
];

export const PRESET_COVERS = [
  { name: 'GDG Sketch Runner', url: gdgCover },
  { name: 'Flappy Margin Birds', url: flappyCover },
  { name: 'Punk Doodle Jumper', url: punkCover },
  { name: 'Nebula Space Vanguard', url: nebulaCover },
];

export function resolveCover(url: string): string {
  if (!url) return url;
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const match = PRESETS.find((p) => url.includes(p.key));
  return match ? match.url : url;
}
