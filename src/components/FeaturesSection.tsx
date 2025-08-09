import { 
  Brain, 
  Languages, 
  Smartphone, 
  Users, 
  ShoppingCart, 
  CloudRain, 
  Leaf, 
  MessageSquare,
  Camera,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import aiAnalysisImage from '@/assets/ai-analysis.jpg';
import mobileScanImage from '@/assets/mobile-scan.jpg';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered विश्लेषण',
      description: '95% सटीकता के साथ 200+ बीमारियों की पहचान',
      color: 'bg-primary'
    },
    {
      icon: Languages,
      title: '12 भाषाओं में सपोर्ट',
      description: 'हिंदी, अंग्रेजी, तेलुगु, तमिल और अन्य भाषाओं में',
      color: 'bg-accent'
    },
    {
      icon: Smartphone,
      title: 'मोबाइल फ्रेंडली',
      description: 'कहीं भी, कभी भी - बस फोटो खींचें',
      color: 'bg-success'
    },
    {
      icon: Users,
      title: 'Expert Connect',
      description: 'कृषि विशेषज्ञों से सीधे बात करें',
      color: 'bg-warning'
    },
    {
      icon: ShoppingCart,
      title: 'मार्केटप्लेस',
      description: 'दवाइयाँ, बीज, उपकरण - सब एक जगह',
      color: 'bg-destructive'
    },
    {
      icon: CloudRain,
      title: 'मौसम अपडेट',
      description: 'स्थानीय मौसम और कृषि न्यूज़',
      color: 'bg-primary'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'फोटो अपलोड करें',
      description: 'अपनी फसल की तस्वीर खींचें या अपलोड करें'
    },
    {
      step: '02', 
      title: 'AI विश्लेषण',
      description: 'हमारा AI मॉडल बीमारी का विश्लेषण करता है'
    },
    {
      step: '03',
      title: 'रिपोर्ट प्राप्त करें',
      description: 'विस्तृत रिपोर्ट और उपचार सुझाव पाएं'
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Features Grid */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            शक्तिशाली फीचर्स
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            आधुनिक तकनीक से लैस, किसानों के लिए विशेष रूप से डिज़ाइन किया गया
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col">
                <CardHeader className="flex-1">
                  <div className={`inline-flex p-3 rounded-lg ${feature.color} text-white w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* How it Works */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-foreground mb-8">
              कैसे काम करता है?
            </h3>

            {processSteps.map((step, index) => (
              <div key={index} className="flex gap-4 mb-8 group items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}

            <Button variant="hero" size="lg" className="mt-6">
              <Camera className="h-5 w-5 mr-2" />
              अब कोशिश करें
            </Button>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <img
                src={aiAnalysisImage}
                alt="AI Analysis"
                className="rounded-lg shadow-strong w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-6">
                <div className="text-white">
                  <h4 className="text-lg font-semibold mb-2">AI विश्लेषण</h4>
                  <p className="text-sm opacity-90">तुरंत पता करें क्या समस्या है</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={mobileScanImage}
                alt="Mobile Scanning"
                className="rounded-lg shadow-strong w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-6">
                <div className="text-white">
                  <h4 className="text-lg font-semibold mb-2">मोबाइल स्कैनिंग</h4>
                  <p className="text-sm opacity-90">कहीं भी, कभी भी स्कैन करें</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};