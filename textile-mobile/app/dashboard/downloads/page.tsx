import React from 'react';
import { TierGate } from '../../../src/components/TierGate';
import { THEME } from '../../../src/constants/theme';
import { Download, Monitor, Smartphone, FileText, Lock } from 'lucide-react-native';

/**
 * DOWNLOAD CENTER
 * Pro/Elite restricted file distribution hub.
 */
export default function DownloadsPage() {
  const downloadItems = [
    {
      title: 'SENTINEL_PC_HUB_v11.5',
      version: '11.5.0-STABLE',
      type: 'DESKTOP_INSTALLER',
      icon: Monitor,
      fileName: 'noxis-sentinel-hub.exe',
      tier: 'pro' as const,
    },
    {
      title: 'SENTINEL_MOBILE_v11.5_APK',
      version: '11.5.0-RELEASE',
      type: 'ANDROID_APPLICATION',
      icon: Smartphone,
      fileName: 'noxis-sentinel-remote.apk',
      tier: 'elite' as const,
    },
    {
      title: 'RECOVERY_MANIFEST_DOC',
      version: '2026.Q2',
      type: 'SYSTEM_DOCUMENTATION',
      icon: FileText,
      fileName: 'sentinel-recovery-guide.pdf',
      tier: 'pro' as const,
    }
  ];

  return (
    <div className="min-h-screen bg-[#121417] p-8 font-mono">
      <header className="mb-12">
        <h1 className="text-2xl font-black text-white tracking-widest">DOWNLOAD_CENTER</h1>
        <p className="text-[#94A3B8] text-xs mt-2">SECURE_RESOURCES_DISTRIBUTION_v9.1</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {downloadItems.map((item) => (
          <TierGate 
            key={item.fileName} 
            required={item.tier}
            fallback={
              <div className="relative overflow-hidden bg-[#1A1D21] border border-[#272C33] p-6 rounded-xl group">
                <div className="flex items-center gap-4 mb-6 opacity-30">
                  <div className="p-3 bg-[#121417] rounded-lg">
                    <item.icon className="w-6 h-6 text-[#94A3B8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-[10px] text-[#94A3B8]">{item.type}</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                  <Lock className="w-8 h-8 text-[#C5A059] mb-3" />
                  <span className="text-[10px] font-black text-[#C5A059] tracking-widest">
                    REQUIRES_{item.tier.toUpperCase()}
                  </span>
                  <button className="mt-4 text-[9px] text-[#60A5FA] hover:underline">UPGRADE_TO_UNLOCK</button>
                </div>
              </div>
            }
          >
            <div className="bg-[#1A1D21] border border-[#272C33] p-6 rounded-xl hover:border-[#60A5FA]/50 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#121417] rounded-lg group-hover:bg-[#60A5FA]/10 transition-colors">
                  <item.icon className="w-6 h-6 text-[#60A5FA]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-[10px] text-[#94A3B8]">{item.type}</p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] text-[#94A3B8] block mb-1">STABLE_VERSION</span>
                  <span className="text-xs text-white font-bold">{item.version}</span>
                </div>
                
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-[#60A5FA] text-[#121417] text-[10px] font-black rounded-lg hover:bg-white transition-colors"
                >
                  <Download className="w-3 h-3" />
                  INITIATE_FETCH
                </button>
              </div>
            </div>
          </TierGate>
        ))}
      </div>
    </div>
  );
}
