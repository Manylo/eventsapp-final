import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { IEvent } from '@/lib/database/models/event.model';
import { IUser } from '@/lib/database/models/user.model';

export async function generateTicket(event: IEvent, user: IUser) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const { width, height } = page.getSize();
  const fontSizeTitle = 24;
  const fontSizeContent = 14;
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Draw a border around the ticket
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1.5,
  });

  // Title
  page.drawText('Event Ticket', {
    x: width / 2 - 70,
    y: height - 50,
    size: fontSizeTitle,
    font: timesRomanFontBold,
    color: rgb(0, 0.53, 0.71),
  });

  // Event details
  const details = [
    `Event: ${event.title}`,
    `Organizer: ${event.organizer.firstName} ${event.organizer.lastName}`,
    `Location: ${event.location}`,
    `Date: ${new Date(event.startDateTime).toLocaleDateString()} - ${new Date(event.endDateTime).toLocaleDateString()}`,
    `Attendee: ${user.firstName} ${user.lastName}`,
  ];

  details.forEach((detail, idx) => {
    page.drawText(detail, {
      x: 50,
      y: height - 100 - (idx * 30),
      size: fontSizeContent,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
  });

  // Decorative lines
  page.drawLine({
    start: { x: 50, y: height - 70 },
    end: { x: width - 50, y: height - 70 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 50, y: 50 },
    end: { x: width - 50, y: 50 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
