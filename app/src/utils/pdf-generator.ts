import jsPDF from 'jspdf'

interface PDFOptions {
	fullName?: string
	email?: string
	phone?: string
	companyName?: string
	position?: string
}

/**
 * Generates a professional PDF cover letter with proper formatting
 */
export function generatePDF(
	content: string,
	filename: string = 'cover-letter.pdf',
	options: PDFOptions = {}
): void {
	const doc = new jsPDF()
	const pageWidth = doc.internal.pageSize.getWidth()
	const pageHeight = doc.internal.pageSize.getHeight()
	
	// Professional margins (standard business letter format)
	const topMargin = 30
	const leftMargin = 25
	const rightMargin = 25
	const bottomMargin = 25
	const maxWidth = pageWidth - leftMargin - rightMargin
	
	// Typography settings
	const headerFontSize = 11
	const bodyFontSize = 11
	const lineHeight = 5.5
	const paragraphSpacing = 6
	
	let y = topMargin
	
	// Sender information (top left)
	if (options.fullName || options.email || options.phone) {
		doc.setFontSize(headerFontSize)
		doc.setFont('helvetica', 'bold')
		
		if (options.fullName) {
			doc.text(options.fullName, leftMargin, y)
			y += lineHeight + 1
		}
		
		doc.setFont('helvetica', 'normal')
		doc.setTextColor(60, 60, 60)
		
		if (options.email) {
			doc.text(options.email, leftMargin, y)
			y += lineHeight
		}
		
		if (options.phone) {
			doc.text(options.phone, leftMargin, y)
			y += lineHeight
		}
		
		// Reset text color
		doc.setTextColor(0, 0, 0)
		y += paragraphSpacing
	}
	
	// Date (right-aligned)
	const today = new Date()
	const dateStr = today.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	})
	
	doc.setFont('helvetica', 'normal')
	doc.setFontSize(bodyFontSize)
	const dateWidth = doc.getTextWidth(dateStr)
	doc.text(dateStr, pageWidth - rightMargin - dateWidth, topMargin)
	
	// Recipient information (if company name is available)
	if (options.companyName) {
		y += paragraphSpacing + 2
		doc.setFont('helvetica', 'normal')
		doc.setFontSize(bodyFontSize)
		doc.text(options.companyName, leftMargin, y)
		y += lineHeight
		doc.text('Hiring Manager', leftMargin, y)
		y += paragraphSpacing + 2
	} else {
		y += paragraphSpacing
	}
	
	// Process content with proper paragraph formatting
	doc.setFontSize(bodyFontSize)
	doc.setFont('helvetica', 'normal')
	
	// Split content into paragraphs (double newlines)
	const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim())
	
	paragraphs.forEach((paragraph, paraIndex) => {
		const lines = paragraph.split('\n').map(l => l.trim()).filter(l => l)
		
		lines.forEach((line) => {
			// Check if this is a closing line (Sincerely, Best regards, etc.)
			const closingPatterns = /^(Sincerely|Best regards|Regards|Yours sincerely|Yours truly|Respectfully),?$/i
			const isClosing = closingPatterns.test(line)
			
			if (isClosing) {
				// Add extra spacing before closing
				y += paragraphSpacing
			}
			
			// Wrap text to fit page width
			const wrappedLines = doc.splitTextToSize(line, maxWidth)
			
			wrappedLines.forEach((wrappedLine: string) => {
				// Check for page break
				if (y + lineHeight > pageHeight - bottomMargin) {
					doc.addPage()
					y = topMargin
				}
				
				doc.text(wrappedLine, leftMargin, y)
				y += lineHeight
			})
			
			// Add spacing after closing
			if (isClosing) {
				y += lineHeight * 2
			}
		})
		
		// Add spacing between paragraphs (except after last one)
		if (paraIndex < paragraphs.length - 1) {
			y += paragraphSpacing
		}
	})
	
	// Ensure signature space if name is in content but add it if missing
	const contentLower = content.toLowerCase()
	const nameLower = options.fullName?.toLowerCase() || ''
	const hasNameInContent = nameLower && contentLower.includes(nameLower)
	
	// If we have space and name wasn't added, add signature line
	if (options.fullName && !hasNameInContent && y < pageHeight - bottomMargin - lineHeight * 2) {
		if (y + lineHeight * 3 > pageHeight - bottomMargin) {
			doc.addPage()
			y = topMargin
		}
		doc.setFont('helvetica', 'normal')
		doc.text(options.fullName, leftMargin, y)
	}
	
	doc.save(filename)
}
