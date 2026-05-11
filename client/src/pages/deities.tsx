import { Link, useLocation } from 'wouter';
import { deityConfigs } from '@/lib/deityConfigs';
import type { Translations } from '@/lib/translations';

interface DeityGalleryProps {
  t: Translations;
}

const deityTaglines: Record<string, string> = {
  krishna: 'The Cosmic Enchanter',
  radha: 'Divine Love Personified',
  rama: 'The Eternal Guardian',
  shivji: 'The Eternal Meditator',
  hanuman: 'The Strength of Devotion',
  ganesh: 'Remover of Obstacles',
  durga: 'The Invincible Mother',
  saibaba: 'The Divine Compassion',
  gurunanak: 'The Enlightened Guide',
  buddha: 'The Awakened One',
  mahavir: 'The Great Victor',
};

const deityIcons: Record<string, string> = {
  krishna: 'spa',
  radha: 'local_florist',
  rama: 'architecture',
  shivji: 'temple_hindu',
  hanuman: 'pets',
  ganesh: 'emoji_nature',
  durga: 'brightness_high',
  saibaba: 'self_improvement',
  gurunanak: 'flare',
  buddha: 'trip_origin',
  mahavir: 'filter_vintage',
};

const deityOrder = [
  'krishna', 'radha', 'rama', 'shivji', 'hanuman', 'ganesh',
  'durga', 'saibaba', 'gurunanak', 'buddha', 'mahavir',
];

export default function DeityGallery({ t }: DeityGalleryProps) {
  const [location] = useLocation();
  const activeKey =
    Object.keys(deityConfigs).find((k) => location === `/${k}`) || '';

  return (
    <div className="min-h-screen px-4 pt-10 pb-8">
      <div className="max-w-2xl mx-auto md:max-w-none md:mx-0">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-[#d0c6ab] text-xs tracking-[0.25em] uppercase mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Choose Your Deity
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#fff6df]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Divine Gallery
          </h1>
        </div>

        {/* Deity grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {deityOrder.map((key) => {
            const config = deityConfigs[key];
            if (!config) return null;
            const isActive = activeKey === key;
            const tagline = deityTaglines[key] || '';
            const icon = deityIcons[key] || 'spa';
            const primaryColor = config.colors.primary;
            const secondaryColor = config.colors.secondary;

            return (
              <Link
                key={key}
                href={`/${key}`}
                className="block cursor-pointer group relative overflow-hidden"
                  style={{
                    borderRadius: '1.5rem',
                    background: 'rgba(25,30,53,0.6)',
                    border: isActive
                      ? `2px solid ${primaryColor}80`
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isActive
                      ? `0 0 24px ${primaryColor}40, 0 4px 24px rgba(0,0,0,0.5)`
                      : '0 4px 20px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(16px)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease',
                  }}
              >
                  {/* Background image with colored gradient */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${config.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: isActive ? 0.25 : 0.12,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}30 0%, ${secondaryColor}15 100%)`,
                    }}
                  />

                  {/* Active badge */}
                  {isActive && (
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        background: `${primaryColor}30`,
                        border: `1px solid ${primaryColor}60`,
                        color: primaryColor,
                      }}
                    >
                      ACTIVE
                    </div>
                  )}

                  {/* Card content */}
                  <div className="relative z-10 p-5">
                    {/* Icon circle */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: isActive
                          ? `${primaryColor}25`
                          : 'rgba(255,255,255,0.06)',
                        border: isActive
                          ? `1.5px solid ${primaryColor}60`
                          : '1px solid rgba(255,255,255,0.12)',
                        boxShadow: isActive ? `0 0 16px ${primaryColor}40` : 'none',
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ color: isActive ? primaryColor : '#d0c6ab' }}
                      >
                        {icon}
                      </span>
                    </div>

                    {/* Name */}
                    <h3
                      className="font-bold text-base mb-1"
                      style={{
                        fontFamily: 'Sora, sans-serif',
                        color: isActive ? primaryColor : '#fff6df',
                      }}
                    >
                      {t.deityNames[key] || key}
                    </h3>

                    {/* Tagline */}
                    <p
                      className="text-[#d0c6ab] text-xs leading-snug"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {tagline}
                    </p>

                    {/* Mantra hint */}
                    <div
                      className="mt-3 text-[11px] font-semibold tracking-wider truncate"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        color: isActive ? primaryColor : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {t.deityTitles[key] || config.deityName}
                    </div>
                  </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
