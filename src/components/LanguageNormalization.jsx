import { useState, useMemo } from 'react';
import { Languages, Check, X, ExternalLink, Filter, Grid3x3, LayoutList } from 'lucide-react';
import { normalizationCompanies, normalizationFeatures } from '../data/languageNormalizationData';
import InfoTooltip from './InfoTooltip';
import glossary from '../data/glossary';

// Map normalization feature ids → glossary keys
const featureGlossary = {
  itn:             glossary.itn,
  codeMixed:       glossary.codeMixed,
  indicLangs:      glossary.twentyTwoLangs,
  numbers:         glossary.numberNorm,
  dateTime:        glossary.dateTimeNorm,
  currency:        glossary.currencyNorm,
  pii:             glossary.piiRedaction,
  punctuation:     glossary.punctuationRestore,
  transliteration: glossary.transliteration,
  customVocab:     glossary.customVocab,
  profanity:       glossary.profanityFilter,
  disfluency:      glossary.disfluency,
};

const regionColors = {
  India:  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Global: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const featureCount = (company) =>
  Object.values(company.features).filter(Boolean).length;

const LanguageNormalization = () => {
  const [view, setView]     = useState('cards'); // 'cards' | 'matrix'
  const [region, setRegion] = useState('All');

  const filtered = useMemo(() => {
    const list = region === 'All'
      ? normalizationCompanies
      : normalizationCompanies.filter((c) => c.region === region);
    return [...list].sort((a, b) => featureCount(b) - featureCount(a));
  }, [region]);

  const stats = useMemo(() => {
    const total      = normalizationCompanies.length;
    const indianFocus = normalizationCompanies.filter((c) => c.region === 'India').length;
    const codeMixed  = normalizationCompanies.filter((c) => c.features.codeMixed).length;
    const piiCapable = normalizationCompanies.filter((c) => c.features.pii).length;
    return { total, indianFocus, codeMixed, piiCapable };
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-secondary border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Languages className="text-accent" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white">Language Normalization</h2>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl">
                Daily-read view for stakeholders: who normalizes speech / text in the market and exactly which capabilities each one ships.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-700 rounded">Updated May 2026</span>
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <StatTile label="Vendors Tracked"    value={stats.total}       color="text-accent"        bg="bg-accent/20" />
            <StatTile label="India-First"        value={stats.indianFocus} color="text-orange-400"    bg="bg-orange-500/20" />
            <StatTile label="Code-mixed Capable" value={stats.codeMixed}   color="text-success"       bg="bg-success/20" />
            <StatTile label="PII Redaction"      value={stats.piiCapable}  color="text-purple-400"    bg="bg-purple-500/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar */}
        <div className="bg-secondary p-4 rounded-xl border border-gray-700 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400 mr-2">Region:</span>
            {['All', 'India', 'Global'].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  region === r
                    ? 'bg-accent text-white'
                    : 'bg-primary text-gray-400 hover:text-white border border-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-primary rounded-lg border border-gray-700 p-1">
            <button
              onClick={() => setView('cards')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${
                view === 'cards' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutList size={13} />
              Cards
            </button>
            <button
              onClick={() => setView('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${
                view === 'matrix' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 size={13} />
              Matrix
            </button>
          </div>
        </div>

        {view === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <CompanyTile key={c.id} company={c} />
            ))}
          </div>
        ) : (
          <MatrixView companies={filtered} />
        )}
      </div>
    </div>
  );
};

// ───────────────────── sub-components ─────────────────────

const StatTile = ({ label, value, color, bg }) => (
  <div className="bg-primary rounded-xl p-4 border border-gray-700 flex items-center gap-3">
    <div className={`w-2 h-10 rounded-full ${bg.replace('/20', '')}`} />
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  </div>
);

const CompanyTile = ({ company }) => {
  const total   = normalizationFeatures.length;
  const covered = featureCount(company);
  const pct     = Math.round((covered / total) * 100);

  return (
    <div className="bg-secondary rounded-xl border border-gray-700 hover:border-accent transition-colors p-5 animate-fade-in flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center p-1.5 flex-shrink-0">
            <img
              src={company.logo}
              alt={company.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-xs font-bold text-gray-700">
              {company.name.charAt(0)}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white truncate">{company.name}</h3>
            <p className="text-xs text-gray-500 truncate">{company.org}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 text-xs rounded-full border ${regionColors[company.region]} flex-shrink-0`}>
          {company.region}
        </span>
      </div>

      {/* Specialty pill */}
      <div className="mb-3">
        <span className="inline-block px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded border border-accent/20">
          {company.specialty}
        </span>
      </div>

      {/* TL;DR */}
      <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3">
        {company.summary}
      </p>

      {/* Highlights — the part stakeholders skim */}
      <ul className="space-y-1.5 mb-4">
        {company.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
            <span className="text-accent mt-1 flex-shrink-0">▸</span>
            <span className="leading-snug">{h}</span>
          </li>
        ))}
      </ul>

      {/* Coverage bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Feature Coverage</span>
          <span className="text-white font-medium">{covered}/{total}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct >= 75 ? 'bg-success' : pct >= 50 ? 'bg-accent' : 'bg-warning'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Feature checks — compact 3-col grid */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        {normalizationFeatures.map((f) => {
          const has = company.features[f.id];
          return (
            <div
              key={f.id}
              title={`${f.label} — ${f.hint}`}
              className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] ${
                has ? 'bg-success/10 text-success' : 'bg-gray-700/40 text-gray-600'
              }`}
            >
              {has ? <Check size={9} /> : <X size={9} />}
              <span className="truncate">{f.label.replace(' Norm.', '').replace(' Removal', '').replace(' Restore', '')}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-gray-700/60 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">{company.pricing}</p>
          <p className="text-xs text-gray-400 truncate">Best for: {company.bestFor}</p>
        </div>
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1.5 bg-gray-700 text-gray-300 hover:bg-accent hover:text-white text-xs rounded transition-colors flex-shrink-0"
        >
          Visit
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
};

const MatrixView = ({ companies }) => (
  <div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary border-b border-gray-700">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider sticky left-0 bg-primary z-10 min-w-[180px]">
              Vendor
            </th>
            {normalizationFeatures.map((f) => (
              <th
                key={f.id}
                className="px-2 py-3 text-xs font-medium text-gray-400 text-center min-w-[88px]"
              >
                <div className="leading-tight inline-flex items-center justify-center">
                  {featureGlossary[f.id]
                    ? <InfoTooltip content={featureGlossary[f.id]} iconSize={10}>{f.label}</InfoTooltip>
                    : f.label}
                </div>
              </th>
            ))}
            <th className="px-3 py-3 text-xs font-semibold text-gray-400 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, idx) => {
            const covered = featureCount(c);
            return (
              <tr
                key={c.id}
                className={`border-b border-gray-700/50 hover:bg-primary/50 transition-colors ${
                  idx % 2 === 0 ? 'bg-secondary' : 'bg-primary/30'
                }`}
              >
                <td className="px-4 py-3 sticky left-0 bg-inherit z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-white flex items-center justify-center p-1 flex-shrink-0">
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-xs font-bold text-gray-700">
                        {c.name.charAt(0)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{c.name}</p>
                      <span className={`inline-block px-1.5 py-0 text-[10px] rounded border ${regionColors[c.region]}`}>
                        {c.region}
                      </span>
                    </div>
                  </div>
                </td>
                {normalizationFeatures.map((f) => (
                  <td key={f.id} className="px-2 py-3 text-center">
                    {c.features[f.id] ? (
                      <Check size={16} className="text-success mx-auto" />
                    ) : (
                      <span className="text-gray-700">—</span>
                    )}
                  </td>
                ))}
                <td className="px-3 py-3 text-center">
                  <span className={`text-sm font-bold ${
                    covered >= 9 ? 'text-success' : covered >= 6 ? 'text-accent' : 'text-warning'
                  }`}>
                    {covered}/{normalizationFeatures.length}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default LanguageNormalization;
