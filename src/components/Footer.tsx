import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Footer = () => {
  const footerSections = [
    {
      title: 'मंच सुविधाएं',
      links: [
        { name: 'कृत्रिम बुद्धि निदान', href: '#scanner' },
        { name: 'विशेषज्ञ सेवा', href: '#experts' },
        { name: 'कृषि बाज़ार', href: '#marketplace' },
        { name: 'मौसम अपडेट', href: '#weather' }
      ]
    },
    {
      title: 'सहायता केंद्र',
      links: [
        { name: 'उपयोग मार्गदर्शिका', href: '#guide' },
        { name: 'सामान्य प्रश्न', href: '#faq' },
        { name: 'वीडियो प्रशिक्षण', href: '#tutorials' },
        { name: 'तकनीकी सहायता', href: '#support' }
      ]
    },
    {
      title: 'संस्था जानकारी',
      links: [
        { name: 'हमारे बारे में', href: '#about' },
        { name: 'रोजगार अवसर', href: '#careers' },
        { name: 'समाचार एवं घटनाएं', href: '#news' },
        { name: 'साझेदार संस्थाएं', href: '#partners' }
      ]
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12 items-start">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-accent">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">हरित सहायक</h3>
                <p className="text-sm opacity-80">कृषि कृत्रिम बुद्धि सहायक</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              भारत का पहला कृत्रिम बुद्धि से संचालित फसल रोग निदान मंच। 
              किसानों के लिए, किसानों के साथ।
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-sm">support@haritsahayak.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-sm">+91 1800-HARIT (42748)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-sm">नई दिल्ली, भारत</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-primary-foreground/20 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/80">हमसे जुड़ें:</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-primary-foreground/80 order-2 md:order-1">
            <span>© 2024 हरित सहायक. सभी अधिकार सुरक्षित।</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-accent transition-colors">गोपनीयता नीति</a>
              <a href="#terms" className="hover:text-accent transition-colors">सेवा की शर्तें</a>
              <a href="#cookies" className="hover:text-accent transition-colors">कुकी नीति</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};