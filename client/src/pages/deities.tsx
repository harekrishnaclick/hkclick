import { useLocation } from 'wouter';
import { deityConfigs } from '@/lib/deityConfigs';
import type { Translations } from '@/lib/translations';
import { Link } from 'wouter';

interface DeityGalleryProps {
  t: Translations;
}

const deityTaglines: Record<string, string> = {
  krishna: "The Cosmic Enchanter",
  radha: "Divine Love Personified",
  rama: "The Eternal Guardian",
  shivji: "The Eternal Meditator",
  hanuman: "The Strength of Devotion",
  ganesh: "Remover of Obstacles",
  durga: "The Invincible Mother",
};

const deityIcons: Record<string, string> = {
  krishna: 'spa', radha: 'local_florist', rama: 'architecture',
  shivji: 'temple_hindu', hanuman: 'pets', ganesh: 'emoji_nature',
  durga: 'brightness_high',
};

const deityOrder = [
  'krishna','radha','rama','shivji','hanuman','ganesh',
  'durga',
];

export default function DeityGallery({ t }: DeityGalleryProps) {
  const [location] = useLocation();

  const routeKey = Object.keys(deityConfigs).find((k) => location === `/${k}`) || '';
  const lastDeity = typeof localStorage !== 'undefined'
    ? localStorage.getItem('cosmicMantra_lastDeity') || ''
    : '';
  const selectedKey = routeKey || lastDeity;

  return (
    <div className="min-h-screen px-4 pt-10 pb-8">
      <div className="mb-8">
        <p className="text-[#d0c6ab] text-xs tracking-[0.28em] uppercase mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}>Choose Your Path</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
          style={{ fontFamily: 'Sora, sans-serif' }}>Divine Gallery</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {deityOrder.map((key) => {
          const config = deityConfigs[key];
          if (!config) return null;
          const isSelected = selectedKey === key;
          const tagline = deityTaglines[key] || '';
          const icon = deityIcons[key] || 'spa';
          const primaryColor = config.colors.primary;

          return (
            <Link
              key={key}
              href={`/${key}`}
              className="block cursor-pointer relative overflow-hidden"
              style={{
                aspectRatio: '4 / 5',
                borderRadius: '1.25rem',
                border: isSelected
                  ? `2px solid ${primaryColor}90`
                  : '1px solid rgba(255,255,255,0.09)',
                boxShadow: isSelected
                  ? `0 0 28px ${primaryColor}45, 0 4px 32px rgba(0,0,0,0.55)`
                  : '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${config.deityImage || config.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  opacity: isSelected ? 0.82 : 0.62,
                  transition: 'opacity 0.3s ease',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${primaryColor}22 0%, rgba(13,18,40,0.1) 30%, rgba(13,18,40,0.85) 75%, rgba(13,18,40,0.97) 100%)`,
                }}
              />

              {isSelected && (
                <div
                  className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    background: `${primaryColor}28`,
                    border: `1px solid ${primaryColor}70`,
                    color: primaryColor,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  SELECTED
                </div>
              )}

              <div
                className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isSelected ? `${primaryColor}28` : 'rgba(255,255,255,0.08)',
                  border: isSelected ? `1.5px solid ${primaryColor}60` : '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="material-symbols-outlined text-xl"
                  style={{ color: isSelected ? primaryColor : '#d0c6ab' }}>
                  {icon}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-bold text-lg leading-tight mb-0.5"
                  style={{ fontFamily: 'Sora, sans-serif', color: isSelected ? primaryColor : '#fff6df' }}>
                  {t.deityNames[key] || key}
                </h3>
                <p className="text-xs leading-snug mb-2"
                  style={{ fontFamily: 'Inter, sans-serif', color: '#d0c6ab' }}>
                  {tagline}
                </p>
                <p className="text-[11px] font-semibold tracking-widest uppercase truncate"
                  style={{ fontFamily: 'Inter, sans-serif', color: isSelected ? primaryColor : 'rgba(255,255,255,0.32)' }}>
                  {t.deityTitles[key] || config.deityName}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {selectedKey && (
        <Link
          href={`/${selectedKey}`}
          className="hidden md:flex fixed bottom-8 right-[332px] z-40 items-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-sm shadow-2xl transition-all hover:scale-105 active:scale-95"
          style={{
            fontFamily: 'Sora, sans-serif',
            background: 'linear-gradient(135deg, #e9c400, #ffd700)',
            color: '#3a3000',
            boxShadow: '0 0 24px rgba(255,215,0,0.45), 0 4px 24px rgba(0,0,0,0.5)',
          }}
        >
          <span className="material-symbols-outlined text-xl">spa</span>
          Chant {t.deityNames[selectedKey] || selectedKey}
        </Link>
      )}
    </div>
  );
}
