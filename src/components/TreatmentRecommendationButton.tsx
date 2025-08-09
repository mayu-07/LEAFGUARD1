import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Download, Share2 } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

interface TreatmentData {
  disease: string;
  confidence: number;
  severity: 'कम' | 'मध्यम' | 'अधिक';
  cropType: string;
  affectedArea: string;
  recommendations: string[];
  prevention: string[];
  medicines?: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
}

interface TreatmentRecommendationButtonProps {
  treatmentData: TreatmentData;
  className?: string;
}

export const TreatmentRecommendationButton: React.FC<TreatmentRecommendationButtonProps> = ({
  treatmentData,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'कम': return 'bg-success';
      case 'मध्यम': return 'bg-warning';
      case 'अधिक': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  // Copy to clipboard functionality
  const copyToClipboard = useCallback(async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} कॉपी किया गया`);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast.error('कॉपी करने में त्रुटि');
    }
  }, []);

  // Generate full report text
  const generateFullReport = useCallback(() => {
    const report = `
🌱 हरित सहायक - फसल रोग रिपोर्ट

📋 बीमारी की जानकारी:
• रोग: ${treatmentData.disease}
• सटीकता: ${treatmentData.confidence}%
• गंभीरता: ${treatmentData.severity}
• फसल: ${treatmentData.cropType}
• प्रभावित क्षेत्र: ${treatmentData.affectedArea}

💊 उपचार सुझाव:
${treatmentData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

🛡️ भविष्य में बचाव:
${treatmentData.prevention.map((prev, i) => `${i + 1}. ${prev}`).join('\n')}

${treatmentData.medicines ? `
💉 दवाइयाँ:
${treatmentData.medicines.map(med => `• ${med.name} - ${med.dosage} (${med.frequency})`).join('\n')}
` : ''}

📅 रिपोर्ट तारीख: ${new Date().toLocaleDateString('hi-IN')}
🔗 हरित सहायक द्वारा तैयार
    `.trim();
    
    return report;
  }, [treatmentData]);

  // Download report as text file
  const downloadReport = useCallback(() => {
    const report = generateFullReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `फसल-रिपोर्ट-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('रिपोर्ट डाउनलोड की गई');
  }, [generateFullReport]);

  // Share report
  const shareReport = useCallback(async () => {
    const report = generateFullReport();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'हरित सहायक - फसल रोग रिपोर्ट',
          text: report,
        });
        toast.success('रिपोर्ट साझा की गई');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(report, 'पूरी रिपोर्ट');
        }
      }
    } else {
      copyToClipboard(report, 'पूरी रिपोर्ट');
    }
  }, [generateFullReport, copyToClipboard]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  }, [isExpanded]);

  return (
    <div className={className}>
      {/* Main toggle button */}
      <EnhancedButton
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleKeyDown}
        trackingAction="treatment_recommendation_toggle"
        className="w-full justify-between"
        aria-expanded={isExpanded}
        aria-controls="treatment-details"
        aria-label={`उपचार सुझाव ${isExpanded ? 'छुपाएं' : 'देखें'}`}
      >
        <span className="flex items-center gap-2">
          <span className="font-medium">उपचार सुझाव देखें</span>
          <Badge variant="outline">{treatmentData.confidence}% सटीक</Badge>
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </EnhancedButton>

      {/* Expanded content */}
      {isExpanded && (
        <Card 
          id="treatment-details" 
          className="mt-4 animate-fade-in-up"
          role="region"
          aria-label="उपचार विवरण"
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>विस्तृत उपचार रिपोर्ट</span>
              <div className="flex gap-2">
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={downloadReport}
                  trackingAction="download_treatment_report"
                  aria-label="रिपोर्ट डाउनलोड करें"
                >
                  <Download className="h-4 w-4" />
                </EnhancedButton>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={shareReport}
                  trackingAction="share_treatment_report"
                  aria-label="रिपोर्ट साझा करें"
                >
                  <Share2 className="h-4 w-4" />
                </EnhancedButton>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Disease Information */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center justify-between">
                पहचानी गई बीमारी
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(
                    `रोग: ${treatmentData.disease}\nसटीकता: ${treatmentData.confidence}%\nगंभीरता: ${treatmentData.severity}`,
                    'बीमारी की जानकारी'
                  )}
                  trackingAction="copy_disease_info"
                  aria-label="बीमारी की जानकारी कॉपी करें"
                >
                  {copiedSection === 'बीमारी की जानकारी' ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </EnhancedButton>
              </h4>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-primary">{treatmentData.disease}</span>
                  <Badge variant="outline">{treatmentData.confidence}% सटीक</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">फसल: </span>
                    <span className="font-medium">{treatmentData.cropType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">प्रभावित क्षेत्र: </span>
                    <span className="font-medium">{treatmentData.affectedArea}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">गंभीरता:</span>
                  <Badge className={`${getSeverityColor(treatmentData.severity)} text-white`}>
                    {treatmentData.severity}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Treatment Recommendations */}
            <div>
              <h4 className="font-semibold mb-3 text-success flex items-center justify-between">
                🌱 उपचार सुझाव
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(
                    treatmentData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n'),
                    'उपचार सुझाव'
                  )}
                  trackingAction="copy_treatment_recommendations"
                  aria-label="उपचार सुझाव कॉपी करें"
                >
                  {copiedSection === 'उपचार सुझाव' ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </EnhancedButton>
              </h4>
              <ul className="space-y-2">
                {treatmentData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Medicines if available */}
            {treatmentData.medicines && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3 text-primary flex items-center justify-between">
                    💊 सुझाई गई दवाइयाँ
                    <EnhancedButton
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(
                        treatmentData.medicines!.map(med => `${med.name} - ${med.dosage} (${med.frequency})`).join('\n'),
                        'दवाइयाँ'
                      )}
                      trackingAction="copy_medicines"
                      aria-label="दवाइयों की सूची कॉपी करें"
                    >
                      {copiedSection === 'दवाइयाँ' ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </EnhancedButton>
                  </h4>
                  <div className="space-y-3">
                    {treatmentData.medicines.map((medicine, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg">
                        <div className="font-medium text-primary mb-1">{medicine.name}</div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">मात्रा:</span> {medicine.dosage} | 
                          <span className="font-medium ml-2">आवृत्ति:</span> {medicine.frequency}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Prevention Tips */}
            <div>
              <h4 className="font-semibold mb-3 text-primary flex items-center justify-between">
                🛡️ भविष्य में बचाव
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(
                    treatmentData.prevention.map((prev, i) => `${i + 1}. ${prev}`).join('\n'),
                    'बचाव के तरीके'
                  )}
                  trackingAction="copy_prevention_tips"
                  aria-label="बचाव के तरीके कॉपी करें"
                >
                  {copiedSection === 'बचाव के तरीके' ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </EnhancedButton>
              </h4>
              <ul className="space-y-2">
                {treatmentData.prevention.map((prev, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <EnhancedButton
                variant="hero"
                onClick={() => copyToClipboard(generateFullReport(), 'पूरी रिपोर्ट')}
                trackingAction="copy_full_report"
                className="flex-1"
              >
                {copiedSection === 'पूरी रिपोर्ट' ? (
                  <>
                    <Check className="h-4 w-4" />
                    कॉपी हो गया
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    पूरी रिपोर्ट कॉपी करें
                  </>
                )}
              </EnhancedButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};