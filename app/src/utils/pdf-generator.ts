import jsPDF from 'jspdf'

interface PDFOptions {
	fullName?: string
	email?: string
	phone?: string
	companyName?: string
	position?: string
	signature?: string | null
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
	
	// Enhanced typography settings
	const headerFontSize = 11
	const bodyFontSize = 11
	const lineHeight = 6 // Increased for better readability
	const paragraphSpacing = 7 // Increased spacing between paragraphs
	
	let y = topMargin
	
	// Sender information (top left) - Standard business letter format with improved styling
	if (options.fullName || options.email || options.phone) {
		doc.setFontSize(headerFontSize)
		doc.setFont('helvetica', 'bold')
		doc.setTextColor(30, 30, 30) // Darker, more professional color
		
		if (options.fullName) {
			doc.text(options.fullName, leftMargin, y)
			y += lineHeight + 1.5
		}
		
		doc.setFont('helvetica', 'normal')
		doc.setTextColor(70, 70, 70) // Slightly lighter but still professional
		doc.setFontSize(10) // Slightly smaller for contact info
		
		if (options.email) {
			doc.text(options.email, leftMargin, y)
			y += lineHeight - 0.5
		}
		
		if (options.phone) {
			doc.text(options.phone, leftMargin, y)
			y += lineHeight - 0.5
		}
		
		// Reset text color and font size
		doc.setTextColor(0, 0, 0)
		doc.setFontSize(bodyFontSize)
		y += paragraphSpacing + 3
	}
	
	// Date (below sender info, left-aligned for block style)
	const today = new Date()
	const dateStr = today.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	})
	
	doc.setFont('times', 'normal') // Use Times for body text (more professional)
	doc.setFontSize(bodyFontSize)
	doc.setTextColor(40, 40, 40) // Professional dark gray
	doc.text(dateStr, leftMargin, y)
	y += paragraphSpacing + 5
	
	// Recipient information (below date, standard format)
	// Note: We show company name only, salutation will be in content
	if (options.companyName) {
		doc.setFont('times', 'normal')
		doc.setFontSize(bodyFontSize)
		doc.setTextColor(40, 40, 40)
		doc.text(options.companyName, leftMargin, y)
		y += paragraphSpacing + 5
	} else {
		y += paragraphSpacing
	}
	
	// Clean content: remove duplicate contact information that's already in header
	let cleanedContent = content
	
	// Ensure proper salutation format (standard uses colon, not comma)
	// Don't remove salutation - it's required in standard format
	// But ensure it's properly formatted
	const lines = cleanedContent.split('\n')
	if (lines.length > 0) {
		const firstLine = lines[0].trim()
		const salutationPatterns = [
			/^Dear\s+(Hiring\s+Manager|Sir|Madam|Mr\.|Mrs\.|Ms\.|Dr\.)[,\s]*$/i,
			/^Dear\s+Hiring\s+Manager[,]?$/i,
			/^Hi\s+there[,]?$/i,
		]
		
		// If salutation exists but doesn't end with colon, fix it
		if (salutationPatterns.some(pattern => pattern.test(firstLine))) {
			if (!firstLine.endsWith(':')) {
				// Replace comma with colon for standard format
				lines[0] = firstLine.replace(/[,]?\s*$/, ':')
				cleanedContent = lines.join('\n')
			}
		} else if (options.companyName) {
			// If no salutation but we have recipient info, add standard salutation
			cleanedContent = 'Dear Hiring Manager:\n\n' + cleanedContent
		}
	}
	
	// Remove contact info from the end of content if it matches header info
	if (options.fullName || options.email || options.phone) {
		const lines = cleanedContent.split('\n')
		
		// Find the closing line (Sincerely, Best regards, etc.)
		let closingIndex = -1
		for (let i = 0; i < lines.length; i++) {
			const trimmed = lines[i].trim()
			const closingPatterns = /^(Sincerely|Best regards|Regards|Yours sincerely|Yours truly|Respectfully),?$/i
			if (closingPatterns.test(trimmed)) {
				closingIndex = i
				break
			}
		}
		
		// Remove contact info lines after closing
		if (closingIndex >= 0) {
			const beforeClosing = lines.slice(0, closingIndex + 1)
			const afterClosing = lines.slice(closingIndex + 1)
			
			// Filter out lines that match contact info (exact or contains)
			const filteredAfterClosing = afterClosing.filter(line => {
				const trimmed = line.trim()
				if (!trimmed) return false
				
				const trimmedLower = trimmed.toLowerCase()
				
				// Check against each contact field
				if (options.fullName) {
					const nameLower = options.fullName.toLowerCase()
					if (trimmedLower === nameLower || trimmedLower.includes(nameLower)) {
						return false
					}
				}
				
				if (options.email) {
					const emailLower = options.email.toLowerCase()
					if (trimmedLower === emailLower || trimmedLower.includes(emailLower)) {
						return false
					}
				}
				
				if (options.phone) {
					const phoneLower = options.phone.toLowerCase().replace(/\s+/g, '')
					const trimmedPhone = trimmedLower.replace(/\s+/g, '')
					if (trimmedPhone === phoneLower || trimmedPhone.includes(phoneLower) || phoneLower.includes(trimmedPhone)) {
						return false
					}
				}
				
				return true
			})
			
			cleanedContent = [...beforeClosing, ...filteredAfterClosing].join('\n')
		}
	}
	
	// Process content with proper paragraph formatting using Times font
	doc.setFontSize(bodyFontSize)
	doc.setFont('times', 'normal')
	doc.setTextColor(20, 20, 20) // Very dark, professional black
	
	// Split content into paragraphs (double newlines)
	const paragraphs = cleanedContent.split(/\n\s*\n/).filter(p => p.trim())
	
	paragraphs.forEach((paragraph, paraIndex) => {
		const lines = paragraph.split('\n').map(l => l.trim()).filter(l => l)
		
		lines.forEach((line) => {
			// Check if this is a salutation line
			const salutationPatterns = /^Dear\s+(.+?)[:,]?$/i
			const isSalutation = salutationPatterns.test(line)
			
			// Check if this is a closing line (Sincerely, Best regards, etc.)
			const closingPatterns = /^(Sincerely|Best regards|Regards|Yours sincerely|Yours truly|Respectfully),?$/i
			const isClosing = closingPatterns.test(line)
			
			if (isSalutation) {
				// Add spacing before salutation if needed
				if (paraIndex === 0) {
					y += paragraphSpacing * 0.5
				}
			}
			
			if (isClosing) {
				// Add extra spacing before closing
				y += paragraphSpacing + 2
			}
			
			// Wrap text to fit page width with better line breaking
			const wrappedLines = doc.splitTextToSize(line, maxWidth)
			
			wrappedLines.forEach((wrappedLine: string, lineIndex: number) => {
				// Check for page break
				if (y + lineHeight > pageHeight - bottomMargin) {
					doc.addPage()
					y = topMargin
					// Reset font settings on new page
					doc.setFont('times', 'normal')
					doc.setFontSize(bodyFontSize)
					doc.setTextColor(20, 20, 20)
				}
				
				// Use slightly different styling for salutations
				if (isSalutation && lineIndex === 0) {
					doc.setFont('times', 'normal')
					doc.setTextColor(30, 30, 30)
				}
				
				// Ensure placeholders are rendered in normal weight (not bold)
				// Check if the line contains placeholder text (text in brackets)
				const hasPlaceholder = /\[.*?\]/.test(wrappedLine)
				if (hasPlaceholder) {
					doc.setFont('times', 'normal') // Explicitly set to normal weight
					doc.setTextColor(100, 100, 100) // Lighter color for placeholders
				} else {
					// Reset to normal styling for regular content
					doc.setFont('times', 'normal')
					doc.setTextColor(20, 20, 20)
				}
				
				doc.text(wrappedLine, leftMargin, y)
				y += lineHeight
			})
			
			// Add spacing after closing
			if (isClosing) {
				y += lineHeight * 2.5
			}
		})
		
		// Add spacing between paragraphs (except after last one)
		if (paraIndex < paragraphs.length - 1) {
			y += paragraphSpacing + 1
		}
	})
	
	// Add signature block after closing (standard format: e-signature image, then typed name)
	// Check if there's already a signature in the cleaned content
	const cleanedContentLower = cleanedContent.toLowerCase()
	const nameLower = options.fullName?.toLowerCase() || ''
	const hasNameInContent = nameLower && cleanedContentLower.includes(nameLower)
	
	// Check if the last line was a closing
	const lastLines = cleanedContent.split('\n').filter(l => l.trim())
	const lastLine = lastLines[lastLines.length - 1]?.trim() || ''
	const closingPatterns = /^(Sincerely|Best regards|Regards|Yours sincerely|Yours truly|Respectfully),?$/i
	const hasClosing = closingPatterns.test(lastLine)
	
	// Add signature block if we have closing and name, and space available
	if (options.fullName && hasClosing && !hasNameInContent && y < pageHeight - bottomMargin - lineHeight * 3) {
		// Add spacing after closing
		if (y + lineHeight * 5 > pageHeight - bottomMargin) {
			doc.addPage()
			y = topMargin
		} else {
			y += lineHeight * 1.5
		}
		
		// Add e-signature image if available
		if (options.signature && typeof options.signature === 'string' && options.signature.trim()) {
			const signatureData = options.signature // Capture for TypeScript
			try {
				// Load image to get actual dimensions for autofit
				const img = new Image()
				img.src = signatureData
				
				// Max dimensions for signature in PDF
				const maxWidth = 100 // mm (about 4 inches - wide enough for signatures)
				const maxHeight = 30 // mm (about 1.2 inches - reasonable height)
				
				// If image is already loaded, calculate and add immediately
				if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
					const aspectRatio = img.naturalHeight / img.naturalWidth
					let signatureWidth = maxWidth
					let signatureHeight = signatureWidth * aspectRatio
					
					// If height exceeds max, scale down
					if (signatureHeight > maxHeight) {
						signatureHeight = maxHeight
						signatureWidth = signatureHeight / aspectRatio
					}
					
					// Ensure minimum readable size
					if (signatureWidth < 50) {
						signatureWidth = 50
						signatureHeight = signatureWidth * aspectRatio
					}
					
					doc.addImage(
						signatureData,
						'PNG',
						leftMargin,
						y,
						signatureWidth,
						signatureHeight
					)
					y += signatureHeight + lineHeight * 1.5
				} else {
					// Wait for image to load, then calculate dimensions
					img.onload = () => {
						const aspectRatio = img.naturalHeight / img.naturalWidth
						let finalWidth = maxWidth
						let finalHeight = finalWidth * aspectRatio
						
						if (finalHeight > maxHeight) {
							finalHeight = maxHeight
							finalWidth = finalHeight / aspectRatio
						}
						
						if (finalWidth < 50) {
							finalWidth = 50
							finalHeight = finalWidth * aspectRatio
						}
						
						doc.addImage(
							signatureData,
							'PNG',
							leftMargin,
							y,
							finalWidth,
							finalHeight
						)
					}
					
					// Use estimated dimensions (fallback if onload doesn't fire in time)
					// Estimate based on signature pad dimensions (200px height, ~4:1 aspect ratio)
					const estimatedAspectRatio = 200 / 800 // height/width estimate
					let estimatedWidth = maxWidth
					let estimatedHeight = estimatedWidth * estimatedAspectRatio
					
					if (estimatedHeight > maxHeight) {
						estimatedHeight = maxHeight
						estimatedWidth = estimatedHeight / estimatedAspectRatio
					}
					
					doc.addImage(
						signatureData,
						'PNG',
						leftMargin,
						y,
						estimatedWidth,
						estimatedHeight
					)
					y += estimatedHeight + lineHeight * 1.5
				}
			} catch (error) {
				console.error('Error adding signature to PDF:', error)
				// Fallback: use fixed dimensions
				doc.addImage(
					signatureData,
					'PNG',
					leftMargin,
					y,
					80,
					20
				)
				y += 20 + lineHeight * 1.5
			}
		} else {
			// No signature, add space for handwritten signature
			y += lineHeight * 2
		}
		
		// Add typed name below signature with improved styling
		doc.setFont('times', 'normal')
		doc.setFontSize(bodyFontSize)
		doc.setTextColor(30, 30, 30) // Professional dark color
		if (options.fullName && typeof options.fullName === 'string') {
			doc.text(options.fullName, leftMargin, y)
		}
	}
	
	doc.save(filename)
}

/**
 * Generates a PDF with markdown-formatted content
 */
export function generateMarkdownPDF(
	content: string,
	filename: string = 'cover-letter.md.pdf',
	options: PDFOptions = {}
): void {
	const doc = new jsPDF()
	const pageWidth = doc.internal.pageSize.getWidth()
	const pageHeight = doc.internal.pageSize.getHeight()
	
	// Professional margins
	const topMargin = 30
	const leftMargin = 25
	const rightMargin = 25
	const bottomMargin = 25
	const maxWidth = pageWidth - leftMargin - rightMargin
	
	// Typography settings for markdown
	const headerFontSize = 12
	const bodyFontSize = 10
	const lineHeight = 5.5
	const paragraphSpacing = 6
	
	let y = topMargin
	
	// Sender information (top left)
	if (options.fullName || options.email || options.phone) {
		doc.setFontSize(headerFontSize)
		doc.setFont('helvetica', 'bold')
		doc.setTextColor(30, 30, 30)
		
		if (options.fullName) {
			doc.text(`**${options.fullName}**`, leftMargin, y)
			y += lineHeight + 1.5
		}
		
		doc.setFont('helvetica', 'normal')
		doc.setTextColor(70, 70, 70)
		doc.setFontSize(9)
		
		if (options.email) {
			doc.text(options.email, leftMargin, y)
			y += lineHeight - 0.5
		}
		
		if (options.phone) {
			doc.text(options.phone, leftMargin, y)
			y += lineHeight - 0.5
		}
		
		doc.setTextColor(0, 0, 0)
		doc.setFontSize(bodyFontSize)
		y += paragraphSpacing + 3
	}
	
	// Date
	const today = new Date()
	const dateStr = today.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	})
	
	doc.setFont('courier', 'normal') // Monospace for markdown feel
	doc.setFontSize(bodyFontSize)
	doc.setTextColor(40, 40, 40)
	doc.text(dateStr, leftMargin, y)
	y += paragraphSpacing + 5
	
	// Recipient information
	if (options.companyName) {
		doc.setFont('courier', 'normal')
		doc.setFontSize(bodyFontSize)
		doc.setTextColor(40, 40, 40)
		doc.text(options.companyName, leftMargin, y)
		y += paragraphSpacing + 5
	}
	
	// Clean content similar to regular PDF
	let cleanedContent = content
	const lines = cleanedContent.split('\n')
	if (lines.length > 0) {
		const firstLine = lines[0].trim()
		const salutationPatterns = [
			/^Dear\s+(Hiring\s+Manager|Sir|Madam|Mr\.|Mrs\.|Ms\.|Dr\.)[,\s]*$/i,
			/^Dear\s+Hiring\s+Manager[,]?$/i,
			/^Hi\s+there[,]?$/i,
		]
		
		if (salutationPatterns.some(pattern => pattern.test(firstLine))) {
			if (!firstLine.endsWith(':')) {
				lines[0] = firstLine.replace(/[,]?\s*$/, ':')
				cleanedContent = lines.join('\n')
			}
		} else if (options.companyName) {
			cleanedContent = 'Dear Hiring Manager:\n\n' + cleanedContent
		}
	}
	
	// Remove contact info from end if it matches header
	if (options.fullName || options.email || options.phone) {
		const contentLines = cleanedContent.split('\n')
		let closingIndex = -1
		for (let i = 0; i < contentLines.length; i++) {
			const trimmed = contentLines[i].trim()
			const closingPatterns = /^(Sincerely|Best regards|Regards|Yours sincerely|Yours truly|Respectfully),?$/i
			if (closingPatterns.test(trimmed)) {
				closingIndex = i
				break
			}
		}
		
		if (closingIndex >= 0) {
			const beforeClosing = contentLines.slice(0, closingIndex + 1)
			const afterClosing = contentLines.slice(closingIndex + 1)
			
			const filteredAfterClosing = afterClosing.filter(line => {
				const trimmed = line.trim()
				if (!trimmed) return false
				
				const trimmedLower = trimmed.toLowerCase()
				
				if (options.fullName) {
					const nameLower = options.fullName.toLowerCase()
					if (trimmedLower === nameLower || trimmedLower.includes(nameLower)) {
						return false
					}
				}
				
				if (options.email) {
					const emailLower = options.email.toLowerCase()
					if (trimmedLower === emailLower || trimmedLower.includes(emailLower)) {
						return false
					}
				}
				
				if (options.phone) {
					const phoneLower = options.phone.toLowerCase().replace(/\s+/g, '')
					const trimmedPhone = trimmedLower.replace(/\s+/g, '')
					if (trimmedPhone === phoneLower || trimmedPhone.includes(phoneLower) || phoneLower.includes(trimmedPhone)) {
						return false
					}
				}
				
				return true
			})
			
			cleanedContent = [...beforeClosing, ...filteredAfterClosing].join('\n')
		}
	}
	
	// Process content with markdown-style formatting
	doc.setFontSize(bodyFontSize)
	doc.setFont('courier', 'normal')
	doc.setTextColor(20, 20, 20)
	
	// Split content into paragraphs
	const paragraphs = cleanedContent.split(/\n\s*\n/).filter(p => p.trim())
	
	paragraphs.forEach((paragraph, paraIndex) => {
		const lines = paragraph.split('\n').map(l => l.trim()).filter(l => l)
		
		lines.forEach((line) => {
			const salutationPatterns = /^Dear\s+(.+?)[:,]?$/i
			const isSalutation = salutationPatterns.test(line)
			const closingPatterns = /^(Sincerely|Best regards|Regards|Yours sincerely|Yours truly|Respectfully),?$/i
			const isClosing = closingPatterns.test(line)
			
			if (isSalutation) {
				if (paraIndex === 0) {
					y += paragraphSpacing * 0.5
				}
			}
			
			if (isClosing) {
				y += paragraphSpacing + 2
			}
			
			// Wrap text
			const wrappedLines = doc.splitTextToSize(line, maxWidth)
			
			wrappedLines.forEach((wrappedLine: string, lineIndex: number) => {
				if (y + lineHeight > pageHeight - bottomMargin) {
					doc.addPage()
					y = topMargin
					doc.setFont('courier', 'normal')
					doc.setFontSize(bodyFontSize)
					doc.setTextColor(20, 20, 20)
				}
				
				// Style salutations and closings
				if (isSalutation && lineIndex === 0) {
					doc.setFont('courier', 'bold')
					doc.setTextColor(30, 30, 30)
				} else if (isClosing) {
					doc.setFont('courier', 'bold')
					doc.setTextColor(30, 30, 30)
				} else {
					doc.setFont('courier', 'normal')
					doc.setTextColor(20, 20, 20)
				}
				
				// Check for placeholders
				const hasPlaceholder = /\[.*?\]/.test(wrappedLine)
				if (hasPlaceholder) {
					doc.setFont('courier', 'normal')
					doc.setTextColor(100, 100, 100)
				}
				
				doc.text(wrappedLine, leftMargin, y)
				y += lineHeight
			})
			
			if (isClosing) {
				y += lineHeight * 2.5
			}
		})
		
		if (paraIndex < paragraphs.length - 1) {
			y += paragraphSpacing + 1
		}
	})
	
	// Add signature block
	const cleanedContentLower = cleanedContent.toLowerCase()
	const nameLower = options.fullName?.toLowerCase() || ''
	const hasNameInContent = nameLower && cleanedContentLower.includes(nameLower)
	
	const lastLines = cleanedContent.split('\n').filter(l => l.trim())
	const lastLine = lastLines[lastLines.length - 1]?.trim() || ''
	const closingPatterns = /^(Sincerely|Best regards|Regards|Yours sincerely|Yours truly|Respectfully),?$/i
	const hasClosing = closingPatterns.test(lastLine)
	
	if (options.fullName && hasClosing && !hasNameInContent && y < pageHeight - bottomMargin - lineHeight * 3) {
		if (y + lineHeight * 5 > pageHeight - bottomMargin) {
			doc.addPage()
			y = topMargin
		} else {
			y += lineHeight * 1.5
		}
		
		if (options.signature && typeof options.signature === 'string' && options.signature.trim()) {
			const signatureData = options.signature
			try {
				const img = new Image()
				img.src = signatureData
				
				const maxWidth = 100
				const maxHeight = 30
				
				if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
					const aspectRatio = img.naturalHeight / img.naturalWidth
					let signatureWidth = maxWidth
					let signatureHeight = signatureWidth * aspectRatio
					
					if (signatureHeight > maxHeight) {
						signatureHeight = maxHeight
						signatureWidth = signatureHeight / aspectRatio
					}
					
					if (signatureWidth < 50) {
						signatureWidth = 50
						signatureHeight = signatureWidth * aspectRatio
					}
					
					doc.addImage(
						signatureData,
						'PNG',
						leftMargin,
						y,
						signatureWidth,
						signatureHeight
					)
					y += signatureHeight + lineHeight * 1.5
				} else {
					img.onload = () => {
						const aspectRatio = img.naturalHeight / img.naturalWidth
						let finalWidth = maxWidth
						let finalHeight = finalWidth * aspectRatio
						
						if (finalHeight > maxHeight) {
							finalHeight = maxHeight
							finalWidth = finalHeight / aspectRatio
						}
						
						if (finalWidth < 50) {
							finalWidth = 50
							finalHeight = finalWidth * aspectRatio
						}
						
						doc.addImage(
							signatureData,
							'PNG',
							leftMargin,
							y,
							finalWidth,
							finalHeight
						)
					}
					
					const estimatedAspectRatio = 200 / 800
					let estimatedWidth = maxWidth
					let estimatedHeight = estimatedWidth * estimatedAspectRatio
					
					if (estimatedHeight > maxHeight) {
						estimatedHeight = maxHeight
						estimatedWidth = estimatedHeight / estimatedAspectRatio
					}
					
					doc.addImage(
						signatureData,
						'PNG',
						leftMargin,
						y,
						estimatedWidth,
						estimatedHeight
					)
					y += estimatedHeight + lineHeight * 1.5
				}
			} catch (error) {
				console.error('Error adding signature to PDF:', error)
				doc.addImage(
					signatureData,
					'PNG',
					leftMargin,
					y,
					80,
					20
				)
				y += 20 + lineHeight * 1.5
			}
		} else {
			y += lineHeight * 2
		}
		
		doc.setFont('courier', 'normal')
		doc.setFontSize(bodyFontSize)
		doc.setTextColor(30, 30, 30)
		if (options.fullName && typeof options.fullName === 'string') {
			doc.text(options.fullName, leftMargin, y)
		}
	}
	
	doc.save(filename)
}
