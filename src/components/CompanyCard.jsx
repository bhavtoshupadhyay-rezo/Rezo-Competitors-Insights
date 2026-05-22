import { TrendingUp, MapPin, DollarSign, Star, X } from 'lucide-react';
import InfoTooltip from './InfoTooltip';
import glossary from '../data/glossary';

const getCategoryColor = (category) => {
  const colors = {
    'Voice Bot Specialist': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Speech Analytics': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Omni Channel CX': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Contact Center Tech': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Core Tech & Models': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };
  return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

const CompanyCard = ({ company, onClick, onWatchlist, isWatched, canRemove, onRemove }) => {
  const flagshipProduct = company.products.find(p => p.flagship);

  return (
    <div
      onClick={onClick}
      className="bg-secondary p-6 rounded-xl border border-gray-700 hover:border-accent cursor-pointer transition-all hover:shadow-lg hover:shadow-accent/10 animate-fade-in group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-2 flex-shrink-0">
            {(company.logo.startsWith('http') || company.logo.startsWith('/')) ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <span className="text-2xl">{company.logo}</span>
            )}
            <div className="hidden w-full h-full items-center justify-center text-2xl font-bold text-gray-700">
              {company.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
              {company.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-sm text-gray-400">{company.hq}</span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-400">{company.founded}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove && onRemove(company.id);
              }}
              className="p-2 rounded-lg bg-danger/20 text-danger hover:bg-danger/30 transition-colors"
              title="Remove from list"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchlist();
            }}
            title={glossary.watchlist}
            className={`p-2 rounded-lg transition-colors ${
              isWatched
                ? 'bg-warning/20 text-warning'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Star size={18} fill={isWatched ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(company.category)}`}>
          {company.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {company.description}
      </p>

      {/* Flagship Product */}
      {flagshipProduct && (
        <div className="mb-4 p-3 bg-primary rounded-lg border border-gray-700">
          <p className="text-xs text-gray-500 mb-1">Flagship Product</p>
          <p className="text-sm font-medium text-white">{flagshipProduct.name}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-success" />
          <div>
            <p className="text-xs text-gray-500">Total Funding</p>
            <p className="text-sm font-semibold text-white">{company.totalFunding}</p>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <TrendingUp size={16} className="text-accent" />
          <div>
            <p className="text-xs text-gray-500 flex items-center">
              <InfoTooltip content={glossary.buzzScore} iconSize={10}>
                Buzz Score
              </InfoTooltip>
            </p>
            <p className="text-sm font-semibold text-white">{company.buzzScore}/100</p>
          </div>
        </div>
      </div>

      {/* Buzz Meter */}
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            company.buzzScore >= 80 ? 'bg-success' :
            company.buzzScore >= 60 ? 'bg-accent' :
            'bg-warning'
          }`}
          style={{ width: `${company.buzzScore}%` }}
        ></div>
      </div>

      {/* Agent AI Badge */}
      {company.agentAI && (
        <div className="mt-3 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full border border-accent/30">
            <InfoTooltip content={glossary.agentAI} iconSize={10}>
              Agent AI
            </InfoTooltip>
          </span>
        </div>
      )}

      {company.isNew && (
        <div className="mt-3 flex items-center justify-center">
          <span className="px-3 py-1 bg-warning/20 text-warning text-xs font-medium rounded-full border border-warning/30 animate-pulse">
            NEW ENTRANT
          </span>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
