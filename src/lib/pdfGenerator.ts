import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { PatternGrid, StitchType, Instruction, FinishedSize, Gauge } from '@/types';
import { STITCH_LIBRARY } from '@/types';
import type { Language } from '@/lib/i18n';

export async function generatePDF(
  grid: PatternGrid,
  stitchMapping: Map<number, StitchType>,
  instructions: Instruction[],
  language: Language,
  projectName: string,
  finishedSize?: FinishedSize,
  gauge?: Gauge
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 612;
  const pageHeight = 792;

  const unitLabel = finishedSize?.unit === 'inch' ? 'in' : 'cm';

  const coverPage = pdfDoc.addPage([pageWidth, pageHeight]);

  let safeProjectName = projectName || 'Loomscape Pattern';
  safeProjectName = safeProjectName.replace(/[^\x20-\x7E]/g, 'Loomscape Pattern');
  if (!safeProjectName.trim()) safeProjectName = 'Loomscape Pattern';

  coverPage.drawText(safeProjectName, {
    x: 50,
    y: pageHeight - 100,
    size: 36,
    font: timesBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  const date = new Date().toLocaleDateString('en-US');
  coverPage.drawText(date, {
    x: 50,
    y: pageHeight - 140,
    size: 14,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });

  coverPage.drawText('Knitting Pattern', {
    x: 50,
    y: pageHeight - 180,
    size: 18,
    font: timesFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  if (finishedSize && gauge) {
    const infoY = pageHeight - 240;

    coverPage.drawText('Finished Size:', {
      x: 50,
      y: infoY,
      size: 14,
      font: timesBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    coverPage.drawText(
      `${finishedSize.width} x ${finishedSize.height} ${unitLabel}`,
      {
        x: 50,
        y: infoY - 20,
        size: 12,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      }
    );

    coverPage.drawText('Gauge:', {
      x: 50,
      y: infoY - 50,
      size: 14,
      font: timesBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    coverPage.drawText(
      `${gauge.stitchesPerUnit} sts x ${gauge.rowsPerUnit} rows / ${unitLabel}`,
      {
        x: 50,
        y: infoY - 70,
        size: 12,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      }
    );

    coverPage.drawText('Total Stitches:', {
      x: 50,
      y: infoY - 100,
      size: 14,
      font: timesBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    coverPage.drawText(
      `${grid.width} sts x ${grid.height} rows`,
      {
        x: 50,
        y: infoY - 120,
        size: 12,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      }
    );
  }

  const legendPage = pdfDoc.addPage([pageWidth, pageHeight]);
  legendPage.drawText('Legend', {
    x: 50,
    y: pageHeight - 50,
    size: 24,
    font: timesBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  let legendY = pageHeight - 100;
  const cellSize = 20;

  for (let i = 0; i < grid.palette.length; i++) {
    const color = grid.palette[i];
    const hexColor = color.slice(1);
    const r = parseInt(hexColor.slice(0, 2), 16) / 255;
    const g = parseInt(hexColor.slice(2, 4), 16) / 255;
    const b = parseInt(hexColor.slice(4, 6), 16) / 255;

    legendPage.drawRectangle({
      x: 50,
      y: legendY - cellSize,
      width: cellSize,
      height: cellSize,
      color: rgb(r, g, b),
    });

    const stitch = stitchMapping.get(i);
    let stitchName = '-';
    if (stitch) {
      const stitchInfo = STITCH_LIBRARY.find((s) => s.id === stitch);
      stitchName = stitchInfo?.name?.en || stitch;
    }
    legendPage.drawText(`Color ${i + 1}: ${stitchName}`, {
      x: 80,
      y: legendY - cellSize + 5,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0),
    });

    legendY -= cellSize + 10;
  }

  const patternPage = pdfDoc.addPage([pageWidth, pageHeight]);
  patternPage.drawText(
    'Pattern Grid',
    { x: 50, y: pageHeight - 50, size: 24, font: timesBold, color: rgb(0.1, 0.1, 0.1) }
  );

  const gridSize = Math.min(
    (pageWidth - 100) / grid.width,
    (pageHeight - 150) / grid.height
  );
  const startX = 50;
  const startY = pageHeight - 100;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const colorIndex = grid.cells[y][x];
      const color = grid.palette[colorIndex] || '#FFFFFF';
      const hexColor = color.slice(1);
      const r = parseInt(hexColor.slice(0, 2), 16) / 255;
      const g = parseInt(hexColor.slice(2, 4), 16) / 255;
      const b = parseInt(hexColor.slice(4, 6), 16) / 255;

      patternPage.drawRectangle({
        x: startX + x * gridSize,
        y: startY - (y + 1) * gridSize,
        width: gridSize,
        height: gridSize,
        color: rgb(r, g, b),
      });

      if (gridSize >= 6) {
        patternPage.drawRectangle({
          x: startX + x * gridSize,
          y: startY - (y + 1) * gridSize,
          width: gridSize,
          height: gridSize,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
        });
      }
    }
  }

  const chartPage = pdfDoc.addPage([pageWidth, pageHeight]);
  const chartBgColor = rgb(1, 0.97, 0.97);
  chartPage.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: chartBgColor,
  });

  chartPage.drawText(
    'Knitting Chart',
    { x: 50, y: pageHeight - 50, size: 24, font: timesBold, color: rgb(0.1, 0.1, 0.1) }
  );

  if (finishedSize && gauge) {
    const sizeText =
      `Size: ${finishedSize.width} x ${finishedSize.height} ${unitLabel}  |  Gauge: ${gauge.stitchesPerUnit} sts/${unitLabel} x ${gauge.rowsPerUnit} rows/${unitLabel}`;
    chartPage.drawText(sizeText, {
      x: 50,
      y: pageHeight - 75,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  const getStitchSymbol = (stitch: StitchType | undefined): string => {
    if (!stitch) return '';
    const stitchInfo = STITCH_LIBRARY.find((s) => s.id === stitch);
    if (!stitchInfo) return '';
    const safeSymbols: Record<string, string> = {
      '○': 'o',
      '+': '+',
      'T': 'T',
      '⊥': '^',
      '⊤': '~',
      '•': '.',
      '❀': '*',
      '◆': 'D',
      '∨': 'v',
      'V': 'V',
      'X': 'X',
      '⌒': ')',
      'o': 'o',
      '|': '|',
      '·': '.',
      '#': '#',
      '◇': 'O',
    };
    return safeSymbols[stitchInfo.symbol] || stitchInfo.symbol;
  };

  const chartCellSize = Math.min(
    (pageWidth - 150) / grid.width,
    (pageHeight - 200) / grid.height,
    12
  );
  const chartStartX = 70;
  const chartStartY = pageHeight - 100;

  const colStep = Math.max(1, Math.floor(grid.width / 10));
  for (let x = 0; x < grid.width; x++) {
    const colNum = grid.width - x;
    if (colNum % colStep === 0 || x === 0 || x === grid.width - 1) {
      chartPage.drawText(colNum.toString(), {
        x: chartStartX + x * chartCellSize + chartCellSize / 2 - 3,
        y: chartStartY + 8,
        size: 8,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
  }

  const rowStep = Math.max(1, Math.floor(grid.height / 10));
  for (let y = 0; y < grid.height; y++) {
    if ((y + 1) % rowStep === 0 || y === 0 || y === grid.height - 1) {
      chartPage.drawText((y + 1).toString(), {
        x: chartStartX - 25,
        y: chartStartY - (y + 1) * chartCellSize + chartCellSize / 2 - 3,
        size: 8,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
  }

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const colorIndex = grid.cells[y][x];
      const color = grid.palette[colorIndex] || '#FFFFFF';
      const hexColor = color.slice(1);
      const r = parseInt(hexColor.slice(0, 2), 16) / 255;
      const g = parseInt(hexColor.slice(2, 4), 16) / 255;
      const b = parseInt(hexColor.slice(4, 6), 16) / 255;
      const stitch = stitchMapping.get(colorIndex);
      const symbol = getStitchSymbol(stitch);

      chartPage.drawRectangle({
        x: chartStartX + x * chartCellSize,
        y: chartStartY - (y + 1) * chartCellSize,
        width: chartCellSize,
        height: chartCellSize,
        color: rgb(r, g, b),
        borderWidth: 0,
      });

      if (symbol && chartCellSize >= 8) {
        chartPage.drawText(symbol, {
          x: chartStartX + x * chartCellSize + chartCellSize / 2 - 2,
          y: chartStartY - (y + 1) * chartCellSize + chartCellSize / 2 - 3,
          size: chartCellSize * 0.6,
          font: helvetica,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
    }
  }

  const fineGridColor = rgb(0.53, 0.53, 0.53);
  const fineGridThickness = 0.75;
  for (let x = 0; x <= grid.width; x++) {
    chartPage.drawLine({
      start: { x: chartStartX + x * chartCellSize, y: chartStartY },
      end: { x: chartStartX + x * chartCellSize, y: chartStartY - grid.height * chartCellSize },
      thickness: fineGridThickness,
      color: fineGridColor,
    });
  }
  for (let y = 0; y <= grid.height; y++) {
    chartPage.drawLine({
      start: { x: chartStartX, y: chartStartY - y * chartCellSize },
      end: { x: chartStartX + grid.width * chartCellSize, y: chartStartY - y * chartCellSize },
      thickness: fineGridThickness,
      color: fineGridColor,
    });
  }

  const boldGridColor = rgb(0.33, 0.33, 0.33);
  const boldGridThickness = 1;
  const boldGridCountX = Math.ceil(grid.width / 10);
  const boldGridCountY = Math.ceil(grid.height / 10);
  for (let i = 0; i <= boldGridCountX; i++) {
    chartPage.drawLine({
      start: { x: chartStartX + i * 10 * chartCellSize, y: chartStartY },
      end: { x: chartStartX + i * 10 * chartCellSize, y: chartStartY - grid.height * chartCellSize },
      thickness: boldGridThickness,
      color: boldGridColor,
    });
  }
  for (let i = 0; i <= boldGridCountY; i++) {
    chartPage.drawLine({
      start: { x: chartStartX, y: chartStartY - i * 10 * chartCellSize },
      end: { x: chartStartX + grid.width * chartCellSize, y: chartStartY - i * 10 * chartCellSize },
      thickness: boldGridThickness,
      color: boldGridColor,
    });
  }

  chartPage.drawRectangle({
    x: chartStartX,
    y: chartStartY - grid.height * chartCellSize,
    width: grid.width * chartCellSize,
    height: grid.height * chartCellSize,
    borderColor: rgb(0, 0, 0),
    borderWidth: 2.5,
    color: undefined as any,
  });

  const chartLegendY = chartStartY - grid.height * chartCellSize - 40;
  chartPage.drawText(
    'Symbol Key:',
    { x: 50, y: chartLegendY, size: 12, font: timesBold, color: rgb(0.1, 0.1, 0.1) }
  );

  const legendItems = [
    { symbol: '', label: 'Empty = Knit' },
    { symbol: 'o', label: 'o = Purl' },
    { symbol: 'X', label: 'X = Lace / YO' },
    { symbol: '#', label: '# = Cable' },
  ];

  for (let i = 0; i < legendItems.length; i++) {
    const item = legendItems[i];
    const legendX = 50 + (i % 2) * 250;
    const legendRowY = chartLegendY - 20 - Math.floor(i / 2) * 20;
    chartPage.drawRectangle({
      x: legendX,
      y: legendRowY - 12,
      width: 16,
      height: 16,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 0.5,
      color: rgb(1, 1, 1),
    });
    if (item.symbol) {
      chartPage.drawText(item.symbol, {
        x: legendX + 4,
        y: legendRowY - 12 + 3,
        size: 10,
        font: helvetica,
        color: rgb(0.1, 0.1, 0.1),
      });
    }
    chartPage.drawText(item.label, {
      x: legendX + 24,
      y: legendRowY - 8,
      size: 10,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  const maxTextWidth = pageWidth - 100;
  const fontSize = 10;
  const lineHeight = 14;
  const rowLabelWidth = 70;
  const contentWidth = maxTextWidth - rowLabelWidth;

  function wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(', ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ', ' + word : word;
      const testWidth = helvetica.widthOfTextAtSize(testLine, fontSize);
      if (testWidth <= maxWidth || currentLine === '') {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let instructionY = pageHeight - 50;

  currentPage.drawText(
    'Knitting Instructions',
    { x: 50, y: instructionY, size: 24, font: timesBold, color: rgb(0.1, 0.1, 0.1) }
  );
  instructionY -= 50;

  const abbrevKey = 'Abbreviations: K=Knit, P=Purl, R=Rib, S=Seed, C=Cable, YO=Lace';
  currentPage.drawText(abbrevKey, {
    x: 50,
    y: instructionY,
    size: 9,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });
  instructionY -= 25;

  for (const instr of instructions) {
    const rowLabel = `Row ${instr.rowNumber}:`;
    const lines = wrapText(instr.stitches, contentWidth);
    const totalLines = lines.length;
    const blockHeight = totalLines * lineHeight;

    if (instructionY - blockHeight < 50) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      instructionY = pageHeight - 50;
    }

    currentPage.drawText(rowLabel, {
      x: 50,
      y: instructionY,
      size: fontSize,
      font: helvetica,
      color: rgb(0, 0, 0),
    });

    for (let i = 0; i < lines.length; i++) {
      currentPage.drawText(lines[i], {
        x: 50 + rowLabelWidth,
        y: instructionY - i * lineHeight,
        size: fontSize,
        font: helvetica,
        color: rgb(0, 0, 0),
      });
    }

    instructionY -= blockHeight + 4;
  }

  return pdfDoc.save();
}
