import { useState } from 'react';
import { Upload, Camera, Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const DiseaseScannerDemo = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const mockAnalysis = {
    disease: 'बैक्टीरियल ब्लाइट (Bacterial Blight)',
    confidence: 92,
    severity: 'मध्यम',
    cropType: 'धान (Rice)',
    affectedArea: '35%',
    recommendations: [
      'कॉपर सल्फेट का छिड़काव करें (2 ग्राम प्रति लीटर)',
      'खेत में जल निकासी सुनिश्चित करें',
      '15 दिन बाद दोबारा जाँच कराएं',
      'संक्रमित पत्तियों को हटा दें'
    ],
    prevention: [
      'बीज को गर्म पानी से ट्रीट करें',
      'क्रॉप रोटेशन करें',
      'उचित दूरी पर रोपाई करें'
    ]
  };

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'कम': return 'bg-success';
      case 'मध्यम': return 'bg-warning';
      case 'अधिक': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            कृत्रिम बुद्धि निदान प्रदर्शन
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            देखिए कैसे हमारी कृत्रिम बुद्धि आपकी फसल की बीमारी को पहचानती है
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Upload Section */}
            <Card className="h-fit sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  फोटो अपलोड करें
                </CardTitle>
                <CardDescription>
                  अपनी फसल की तस्वीर अपलोड करें या प्रदर्शन के लिए नीचे बटन दबाएं
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6 hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">यहाँ क्लिक करें या फोटो ड्रैग करें</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG, GIF - अधिकतम 10MB</p>
                </div>

                <div className="space-y-4">
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    onClick={startScan}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        कृत्रिम बुद्धि विश्लेषण जारी है...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        प्रदर्शन निदान शुरू करें
                      </>
                    )}
                  </Button>

                  {isScanning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>संसाधन जारी है...</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="h-fit sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  विश्लेषण रिपोर्ट
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!scanComplete ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>निदान शुरू करने के लिए बाएं तरफ प्रदर्शन बटन दबाएं</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in-up">
                    {/* Disease Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">पहचानी गई बीमारी</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-primary">{mockAnalysis.disease}</span>
                          <Badge variant="outline">{mockAnalysis.confidence}% सटीक</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">फसल: </span>
                            <span className="font-medium">{mockAnalysis.cropType}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">प्रभावित क्षेत्र: </span>
                            <span className="font-medium">{mockAnalysis.affectedArea}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">गंभीरता:</span>
                          <Badge className={`${getSeverityColor(mockAnalysis.severity)} text-white`}>
                            {mockAnalysis.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold mb-3 text-success">🌱 उपचार सुझाव</h4>
                      <ul className="space-y-2">
                        {mockAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* Prevention */}
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">🛡️ भविष्य में बचाव</h4>
                      <ul className="space-y-2">
                        {mockAnalysis.prevention.map((prev, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                            <span>{prev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full">
                      विस्तृत रिपोर्ट डाउनलोड करें
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};