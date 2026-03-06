import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface N9PdfData {
  landlordName: string;
  tenantName: string;
  rentalAddress: string;
  terminationDate: string; // dd/mm/yyyy
  signatureFirstName: string;
  signatureLastName: string;
  phoneNumber: string;
  signatureDate: string; // dd/mm/yyyy
}

const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const PAGE_TOP = 750;
const LINE_HEIGHT = 15;

export async function generateN9Pdf(data: N9PdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = 612;
  const pageHeight = 792;
  const contentWidth = pageWidth - MARGIN_LEFT - MARGIN_RIGHT;

  // --- Page 1 ---
  const page1 = doc.addPage([pageWidth, pageHeight]);
  let y = PAGE_TOP;

  function draw(
    page: ReturnType<typeof doc.addPage>,
    text: string,
    opts: {
      font?: typeof fontRegular;
      size?: number;
      color?: ReturnType<typeof rgb>;
      x?: number;
    } = {}
  ) {
    const font = opts.font ?? fontRegular;
    const size = opts.size ?? 10;
    const color = opts.color ?? rgb(0, 0, 0);
    const x = opts.x ?? MARGIN_LEFT;
    page.drawText(text, { x, y, size, font, color });
    y -= LINE_HEIGHT;
  }

  function drawWrapped(
    page: ReturnType<typeof doc.addPage>,
    text: string,
    opts: { font?: typeof fontRegular; size?: number; maxWidth?: number } = {}
  ) {
    const font = opts.font ?? fontRegular;
    const size = opts.size ?? 10;
    const maxWidth = opts.maxWidth ?? contentWidth;
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        draw(page, line, { font, size });
        line = word;
      } else {
        line = test;
      }
    }
    if (line) draw(page, line, { font, size });
  }

  function drawHorizontalLine(page: ReturnType<typeof doc.addPage>) {
    page.drawLine({
      start: { x: MARGIN_LEFT, y: y + 8 },
      end: { x: pageWidth - MARGIN_RIGHT, y: y + 8 },
      thickness: 0.5,
      color: rgb(0.6, 0.6, 0.6),
    });
    y -= 6;
  }

  function gap(px = 12) {
    y -= px;
  }

  // Header
  draw(page1, "Tenant's Notice to End the Tenancy", { font: fontBold, size: 16 });
  gap(2);
  draw(page1, 'N9', { font: fontBold, size: 24 });
  gap(4);
  drawHorizontalLine(page1);
  gap(8);

  // To / From line
  draw(page1, `To:  ${data.landlordName}`, { font: fontBold, size: 11 });
  gap(2);
  draw(page1, `From:  ${data.tenantName}`, { font: fontBold, size: 11 });
  gap(8);

  // Address
  draw(page1, 'Address of the Rental Unit:', { font: fontBold, size: 11 });
  gap(2);
  drawWrapped(page1, data.rentalAddress, { size: 11 });
  gap(12);
  drawHorizontalLine(page1);
  gap(8);

  // Statement
  drawWrapped(page1, 'I am giving this notice because I want to move out of the rental unit.', {
    size: 11,
  });
  gap(12);

  // Termination date
  draw(page1, 'The last day of my tenancy will be:', { font: fontBold, size: 11 });
  gap(4);
  draw(page1, data.terminationDate, { font: fontBold, size: 14 });
  gap(2);
  draw(page1, 'This is the termination date.', { size: 10, font: fontItalic });
  gap(4);
  drawWrapped(
    page1,
    'I will move out of the rental unit on or before the termination date.',
    { size: 10 }
  );
  gap(16);
  drawHorizontalLine(page1);
  gap(8);

  // Important Information
  draw(page1, 'Important Information from the Landlord and Tenant Board', {
    font: fontBold,
    size: 11,
  });
  gap(6);

  draw(page1, 'The termination date', { font: fontBold, size: 9 });
  gap(2);
  drawWrapped(
    page1,
    'For most types of tenancies (including monthly tenancies) the termination date must be at least 60 days after the tenant gives the landlord this notice. Also, the termination date must be the last day of the rental period.',
    { size: 8 }
  );
  gap(6);

  draw(page1, 'Exceptions:', { font: fontBold, size: 9 });
  gap(2);
  drawWrapped(
    page1,
    'The termination date must be at least 28 days after notice if the tenancy is daily or weekly. The termination date must be the last day of the rental period.',
    { size: 8 }
  );
  gap(4);
  drawWrapped(
    page1,
    'A special rule allows less than 60 days notice in some situations. The tenant can give notice for the end of February no later than January 1st and notice for the end of March no later than February 1st.',
    { size: 8 }
  );
  gap(8);

  draw(page1, 'The landlord can apply to end the tenancy', { font: fontBold, size: 9 });
  gap(2);
  drawWrapped(
    page1,
    'The landlord can apply to the Board for an order to end the tenancy and evict the tenant as soon as the tenant gives the landlord this notice. However, the order will not require the tenant to move out any earlier than the termination date in this notice.',
    { size: 8 }
  );
  gap(16);

  // Footer page 1
  draw(page1, 'Page 1 of 2', {
    size: 8,
    color: rgb(0.5, 0.5, 0.5),
    x: pageWidth / 2 - 20,
  });

  // --- Page 2: Signature ---
  const page2 = doc.addPage([pageWidth, pageHeight]);
  y = PAGE_TOP;

  draw(page2, 'Signature', { font: fontBold, size: 16 });
  gap(4);
  drawHorizontalLine(page2);
  gap(12);

  // Signer type
  draw(page2, 'Signed by:    [X] Tenant    [ ] Representative', { size: 10 });
  gap(12);

  // Name fields
  draw(page2, 'First Name', { font: fontBold, size: 9 });
  gap(2);
  draw(page2, data.signatureFirstName, { size: 11 });
  gap(8);

  draw(page2, 'Last Name', { font: fontBold, size: 9 });
  gap(2);
  draw(page2, data.signatureLastName, { size: 11 });
  gap(8);

  // Phone
  draw(page2, 'Phone Number', { font: fontBold, size: 9 });
  gap(2);
  draw(page2, data.phoneNumber || 'N/A', { size: 11 });
  gap(12);
  drawHorizontalLine(page2);
  gap(8);

  // Signature + date
  draw(page2, 'Signature', { font: fontBold, size: 9 });
  gap(2);
  draw(page2, `${data.signatureFirstName} ${data.signatureLastName}`, {
    font: fontItalic,
    size: 12,
  });
  gap(8);

  draw(page2, 'Date (dd/mm/yyyy)', { font: fontBold, size: 9 });
  gap(2);
  draw(page2, data.signatureDate, { size: 11 });
  gap(16);
  drawHorizontalLine(page2);
  gap(8);

  // Generated-by footer
  draw(page2, 'This form was generated by ScrubHub in accordance with the Ontario Residential Tenancies Act, 2006.', {
    size: 7,
    color: rgb(0.5, 0.5, 0.5),
  });
  draw(page2, "Landlord and Tenant Board (LTB) -- Form N9: Tenant's Notice to End the Tenancy.", {
    size: 7,
    color: rgb(0.5, 0.5, 0.5),
  });
  gap(8);
  draw(page2, 'Page 2 of 2', {
    size: 8,
    color: rgb(0.5, 0.5, 0.5),
    x: pageWidth / 2 - 20,
  });

  return doc.save();
}
