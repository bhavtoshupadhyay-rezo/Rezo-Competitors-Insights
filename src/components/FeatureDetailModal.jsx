import { useState } from 'react';
import {
  X, ExternalLink, TrendingUp, Calendar, Building2, Sparkles,
  CheckCircle, Zap, Target, ArrowRight
} from 'lucide-react';

const FeatureDetailModal = ({ feature, company, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate feature description based on feature name
  const getFeatureDescription = (featureName) => {
    const descriptions = {
      'Conversational Pathways 2.0': 'Advanced flowchart-based scripting system enabling complex, branching conversation scenarios with dynamic response handling and contextual awareness.',
      'Enterprise SSO': 'Single Sign-On integration for enterprise customers supporting SAML 2.0, OAuth 2.0, and OpenID Connect protocols for secure authentication.',
      'Multilingual Support': 'Extended language capabilities supporting 30+ languages with native accent recognition and culturally-aware conversation handling.',
      'Squad Feature': 'Multi-agent collaboration system allowing multiple AI agents to work together on complex customer interactions.',
      'Custom LLM Integration': 'Bring-your-own-model capability supporting GPT-4, Claude, Llama, and custom fine-tuned models for specialized use cases.',
      'Batch Calling': 'High-volume outbound calling automation with intelligent scheduling, retry logic, and real-time analytics.',
      'VoiceAI Agents': 'Next-generation autonomous voice agents with human-like conversation capabilities and real-time decision making.',
      'Real-time Agent Assist': 'Live agent assistance providing real-time suggestions, compliance alerts, and knowledge base lookups during calls.',
      'GPT-4 Integration': 'Native integration with OpenAI GPT-4 for enhanced natural language understanding and generation.',
      'Custom Scorecards': 'Customizable performance metrics and evaluation frameworks for agent quality assessment.',
      'WhatsApp Business API': 'Official WhatsApp Business API integration for omnichannel customer engagement.',
      'Hindi Voice Support': 'Native Hindi language support with regional dialect recognition and natural conversation flow.',
      'YellowG LLM': 'Proprietary large language model optimized for customer experience and enterprise conversational AI.',
      'Voice AI Upgrade': 'Enhanced voice recognition with improved accuracy, reduced latency, and better noise cancellation.',
      'X-Platform Integration': 'Cross-platform connectivity enabling seamless integration with major enterprise systems and CRMs.',
      'Enterprise AI Suite': 'Comprehensive enterprise package including advanced analytics, custom workflows, and dedicated support.',
      'Conversational AI Agents': 'Fully autonomous AI agents capable of handling complex, multi-turn conversations with human-like understanding.',
      'Voice Cloning v2': 'Next-generation voice cloning technology with improved fidelity, faster processing, and multi-language support.',
      'AI Chatbot v2': 'Enhanced chatbot with improved context retention, multi-intent handling, and seamless escalation paths.',
      'WhatsApp Integration': 'Native WhatsApp messaging integration for customer support and engagement workflows.'
    };

    return descriptions[featureName] || `${featureName} is a new capability designed to enhance customer experience and operational efficiency. This feature represents the latest innovation from ${company?.name || 'the company'} in the conversational AI space.`;
  };

  // Get impact areas based on feature type
  const getImpactAreas = (featureName) => {
    const featureLower = featureName.toLowerCase();

    if (featureLower.includes('llm') || featureLower.includes('gpt') || featureLower.includes('ai')) {
      return ['Natural Language Understanding', 'Response Quality', 'Context Handling'];
    }
    if (featureLower.includes('voice') || featureLower.includes('calling')) {
      return ['Call Quality', 'Customer Satisfaction', 'Agent Efficiency'];
    }
    if (featureLower.includes('multilingual') || featureLower.includes('hindi') || featureLower.includes('language')) {
      return ['Market Reach', 'Customer Accessibility', 'Regional Support'];
    }
    if (featureLower.includes('enterprise') || featureLower.includes('sso') || featureLower.includes('integration')) {
      return ['Security', 'Scalability', 'Enterprise Adoption'];
    }
    if (featureLower.includes('analytics') || featureLower.includes('scorecard') || featureLower.includes('assist')) {
      return ['Performance Insights', 'Quality Assurance', 'Decision Making'];
    }
    return ['Operational Efficiency', 'Customer Experience', 'Competitive Edge'];
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-secondary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-accent/10 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/20 border border-accent/30">
                <TrendingUp size={24} className="text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                    Feature Launch
                  </span>
                  {feature.isNew && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/20 text-success border border-success/30 flex items-center gap-1">
                      <Sparkles size={10} />
                      NEW
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mt-2">{feature.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                  <Calendar size={14} />
                  {formatDate(feature.launchDate)}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Company Info */}
          {company && (
            <div className="flex items-center gap-3 p-4 bg-primary rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1">
                {company.logo && (company.logo.startsWith('http') || company.logo.startsWith('/')) ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                ) : (
                  <Building2 size={24} className="text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{company.name}</h3>
                <p className="text-sm text-gray-400">{company.category}</p>
              </div>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-xs hover:bg-gray-600 transition-colors"
                >
                  <ExternalLink size={12} />
                  Visit Website
                </a>
              )}
            </div>
          )}

          {/* Feature Description */}
          <div className="bg-primary p-5 rounded-xl border border-gray-700">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Zap size={16} className="text-accent" />
              About This Feature
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {feature.description || getFeatureDescription(feature.name)}
            </p>
          </div>

          {/* Impact Areas */}
          <div className="bg-primary p-5 rounded-xl border border-gray-700">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Target size={16} className="text-warning" />
              Key Impact Areas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {getImpactAreas(feature.name).map((area, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-secondary rounded-lg border border-gray-700 text-center"
                >
                  <CheckCircle size={16} className="text-success mx-auto mb-2" />
                  <span className="text-sm text-gray-300">{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Implications */}
          <div className="bg-warning/10 p-5 rounded-xl border border-warning/30">
            <h4 className="text-warning font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={16} />
              Competitive Implications
            </h4>
            <p className="text-gray-300 text-sm mb-3">
              This feature launch by {company?.name || 'the competitor'} may impact market positioning. Consider:
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <ArrowRight size={14} className="text-warning mt-0.5 flex-shrink-0" />
                Evaluate how this compares to Rezo.ai's current capabilities
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={14} className="text-warning mt-0.5 flex-shrink-0" />
                Identify potential customer segments that may be attracted to this feature
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={14} className="text-warning mt-0.5 flex-shrink-0" />
                Consider timeline for developing similar or superior functionality
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-700 bg-primary/30">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Close
            </button>
            {feature.url ? (
              <a
                href={feature.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                View Feature Details
              </a>
            ) : company?.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-accent text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                Visit {company.name}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailModal;
