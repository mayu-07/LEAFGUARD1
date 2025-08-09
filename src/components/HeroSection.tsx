import { Camera, Upload, Scan, ArrowRight } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-agriculture.jpg';

export const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)]">
          {/* Content */}
          <div className="text-white animate-fade-in-up flex flex-col justify-center">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              आपकी फसल का
              <span className="block text-accent">कृत्रिम बुद्धि डॉक्टर</span>
            </h2>
            
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              फोटो खींचिए, बीमारी पहचानिए, इलाज पाइए। भारत का पहला कृत्रिम बुद्धि से संचालित 
              फसल रोग निदान मंच - 12 भारतीय भाषाओं में उपलब्ध।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <EnhancedButton 
                variant="hero" 
                size="xl" 
                className="group"
                trackingAction="hero_start_diagnosis"
              >
                <Camera className="h-5 w-5 mr-2" />
                अभी निदान करें
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="xl" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                trackingAction="hero_upload_photo"
              >
                <Upload className="h-5 w-5 mr-2" />
                फोटो अपलोड करें
              </EnhancedButton>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">50+</div>
                <div className="text-sm text-gray-300">फसल की किस्में</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">95%</div>
                <div className="text-sm text-gray-300">सटीकता</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">12</div>
                <div className="text-sm text-gray-300">भाषाएं</div>
              </div>
            </div>
          </div>

          {/* Quick Scan Demo */}
          <div className="animate-scale-in flex items-center justify-center">
            <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-full bg-gradient-accent mb-4">
                  <Scan className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">त्वरित निदान</h3>
                <p className="text-gray-300">अपनी फसल की तस्वीर अपलोड करें या कैमरा से जांच करें</p>
              </div>

              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 mb-2">यहाँ क्लिक करें या फोटो ड्रैग करें</p>
                <p className="text-sm text-white/60">JPG, PNG, GIF - अधिकतम 10MB</p>
              </div>

              <EnhancedButton 
                variant="hero" 
                className="w-full mt-6"
                trackingAction="hero_ai_analysis_start"
              >
                कृत्रिम बुद्धि विश्लेषण शुरू करें
              </EnhancedButton>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-accent/20 rounded-full animate-float hidden lg:block" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
};