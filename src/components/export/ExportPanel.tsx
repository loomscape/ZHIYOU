'use client';

import { usePatternStore } from '@/stores/patternStore';
import { useExportStore } from '@/stores/exportStore';
import { generatePDF } from '@/lib/pdfGenerator';
import { useInstructionGenerator } from '@/hooks/useInstructionGenerator';
import { useTranslation } from '@/hooks/useTranslation';
import { LANGUAGES } from '@/lib/i18n';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { clsx } from 'clsx';

export function ExportPanel() {
  const { grid, stitchMapping, finishedSize, gauge } = usePatternStore();
  const { language, setLanguage, isGenerating } = useExportStore();
  const { generateInstructions } = useInstructionGenerator();
  const { t } = useTranslation();

  const handleExport = async () => {
    if (!grid) return;

    const instructions = generateInstructions(grid, stitchMapping, language);
    const pdfBytes = await generatePDF(
      grid,
      stitchMapping,
      instructions,
      language,
      'Loomscape Pattern',
      finishedSize,
      gauge
    );

    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loomscape-pattern.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Panel title={t('exportPanel.title')}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-text-secondary mb-1">
          <FileText className="w-4 h-4" />
          <span className="text-xs font-semibold">{t('exportPanel.pdfExport')}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={clsx(
                'py-2 px-1 rounded-[12px] text-sm font-semibold transition-all flex flex-col items-center gap-1',
                language === lang.code
                  ? 'bg-sky-thread text-white shadow-sm'
                  : 'bg-soft-linen/50 text-text-secondary hover:bg-soft-linen'
              )}
              title={lang.name}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-[10px]">{lang.native}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={handleExport}
          disabled={!grid || isGenerating}
          className="w-full"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          {isGenerating ? t('exportPanel.exporting') : t('exportPanel.exportButton')}
        </Button>

        {grid && (
          <p className="text-[11px] text-text-secondary text-center">
            {t('exportPanel.exportSuccess')}
          </p>
        )}
      </div>
    </Panel>
  );
}
