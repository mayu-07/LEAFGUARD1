import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Languages, Check, Globe } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

const languages: Language[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', region: 'North India' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Global' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'South India' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'South India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'West India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'East India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'West India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'South India' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'South India' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'East India' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'North India' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', region: 'Northeast India' },
];

const STORAGE_KEY = 'harit-sahayak-language';

interface EnhancedLanguageSwitcherProps {
  className?: string;
  onLanguageChange?: (language: Language) => void;
}

export const EnhancedLanguageSwitcher: React.FC<EnhancedLanguageSwitcherProps> = ({
  className,
  onLanguageChange
}) => {
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const savedLangCode = localStorage.getItem(STORAGE_KEY);
    if (savedLangCode) {
      const savedLang = languages.find(lang => lang.code === savedLangCode);
      if (savedLang) {
        setSelectedLang(savedLang);
      }
    }
  }, []);

  // Save language preference and notify parent
  const handleLanguageChange = useCallback(async (language: Language) => {
    if (language.code === selectedLang.code) return;

    setIsLoading(true);
    
    try {
      // Simulate language loading/switching
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSelectedLang(language);
      localStorage.setItem(STORAGE_KEY, language.code);
      setIsOpen(false);
      
      // Notify parent component
      onLanguageChange?.(language);
      
      // Show success message in the selected language
      const messages = {
        hi: `भाषा ${language.nativeName} में बदली गई`,
        en: `Language changed to ${language.nativeName}`,
        te: `భాష ${language.nativeName}కి మార్చబడింది`,
        ta: `மொழி ${language.nativeName} ஆக மாற்றப்பட்டது`,
        mr: `भाषा ${language.nativeName} मध्ये बदलली`,
        bn: `ভাষা ${language.nativeName} এ পরিবর্তিত হয়েছে`,
        gu: `ભાષા ${language.nativeName} માં બદલાઈ`,
        kn: `ಭಾಷೆ ${language.nativeName} ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ`,
        ml: `ഭാഷ ${language.nativeName} ആയി മാറ്റി`,
        or: `ଭାଷା ${language.nativeName} ରେ ପରିବର୍ତ୍ତିତ`,
        pa: `ਭਾਸ਼ਾ ${language.nativeName} ਵਿੱਚ ਬਦਲੀ`,
        as: `ভাষা ${language.nativeName} লৈ সলনি কৰা হ'ল`,
      };
      
      toast.success(messages[language.code as keyof typeof messages] || messages.en);
      
    } catch (error) {
      toast.error('भाषा बदलने में त्रुटि / Language change error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLang.code, onLanguageChange]);

  // Group languages by region
  const groupedLanguages = languages.reduce((acc, lang) => {
    if (!acc[lang.region]) {
      acc[lang.region] = [];
    }
    acc[lang.region].push(lang);
    return acc;
  }, {} as Record<string, Language[]>);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <EnhancedButton
          variant="outline"
          size="sm"
          className={`gap-2 ${className}`}
          disabled={isLoading}
          loading={isLoading}
          trackingAction="language_switcher_open"
          onKeyDown={handleKeyDown}
          aria-label={`वर्तमान भाषा: ${selectedLang.nativeName}। भाषा बदलने के लिए क्लिक करें`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">{selectedLang.nativeName}</span>
          <span className="sm:hidden text-lg">{selectedLang.flag}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </EnhancedButton>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-background border border-border shadow-medium z-50 max-h-96 overflow-y-auto"
        sideOffset={5}
        onKeyDown={handleKeyDown}
      >
        <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2">
          <Globe className="h-4 w-4" />
          <span className="font-semibold">भाषा चुनें / Select Language</span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {Object.entries(groupedLanguages).map(([region, regionLanguages]) => (
          <div key={region}>
            <DropdownMenuLabel className="px-3 py-1 text-xs text-muted-foreground font-medium">
              {region}
            </DropdownMenuLabel>
            
            {regionLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`
                  flex items-center gap-3 cursor-pointer px-3 py-2 text-sm
                  hover:bg-accent hover:text-accent-foreground 
                  focus:bg-accent focus:text-accent-foreground
                  ${selectedLang.code === lang.code ? 'bg-accent text-accent-foreground' : ''}
                `}
                role="menuitem"
                aria-selected={selectedLang.code === lang.code}
              >
                <span className="text-lg flex-shrink-0">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{lang.nativeName}</div>
                  <div className="text-xs text-muted-foreground truncate">{lang.name}</div>
                </div>
                {selectedLang.code === lang.code && (
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
          </div>
        ))}
        
        {/* Footer info */}
        <div className="px-3 py-2 text-xs text-muted-foreground border-t">
          <div className="flex items-center gap-1">
            <Languages className="h-3 w-3" />
            <span>12 भारतीय भाषाओं में उपलब्ध</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};