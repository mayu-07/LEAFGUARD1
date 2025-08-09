import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedLanguageSwitcher } from './EnhancedLanguageSwitcher';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'मुख्य पृष्ठ', href: '#home' },
    { name: 'सुविधाएं', href: '#features' },
    { name: 'कैसे काम करता है', href: '#how-it-works' },
    { name: 'संपर्क', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-hero">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">हरित सहायक</h1>
              <p className="text-xs text-muted-foreground">कृषि AI सहायक</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <EnhancedLanguageSwitcher />
            <EnhancedButton 
              variant="hero" 
              size="sm"
              trackingAction="header_start_diagnosis"
            >
              रोग निदान शुरू करें
            </EnhancedButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <EnhancedLanguageSwitcher />
            <EnhancedButton
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              trackingAction="mobile_menu_toggle"
              aria-label={isMenuOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </EnhancedButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <EnhancedButton 
                variant="hero" 
                size="sm" 
                className="mt-2"
                trackingAction="mobile_start_diagnosis"
              >
                रोग निदान शुरू करें
              </EnhancedButton>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};