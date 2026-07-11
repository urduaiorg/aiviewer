export interface AffiliateProgram {
  merchant: string;
  url: string;
  network: string;
  verifiedAt: string;
}

// Only account-issued links that resolved successfully during the latest audit
// belong here. Reviews without an active entry fall back to the official site.
export const activeAffiliatePrograms: Record<string, AffiliateProgram> = {
  'anything-ai': {
    merchant: 'Anything',
    url: 'https://anything.link/qaisar-roonjha',
    network: 'Dub',
    verifiedAt: '2026-07-11',
  },
  'cal-com': {
    merchant: 'Cal.com',
    url: 'https://refer.cal.com/qaisar-roonjha-z9ag',
    network: 'Dub',
    verifiedAt: '2026-07-11',
  },
  'wispr-flow': {
    merchant: 'Wispr Flow',
    url: 'https://ref.wisprflow.ai/qaisar-roonjha',
    network: 'Dub',
    verifiedAt: '2026-07-11',
  },
};

export function getActiveAffiliateProgram(slug: string): AffiliateProgram | undefined {
  return activeAffiliatePrograms[slug];
}
