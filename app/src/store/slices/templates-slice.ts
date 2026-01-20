import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Template } from '../../types'

interface TemplatesState {
	templates: Template[]
	activeTemplateId: string | null
}

const initialState: TemplatesState = {
	templates: [
		{
			id: 'regular',
			name: 'Regular Job Application',
			content: `Dear Hiring Manager,

I am writing to express my strong interest in the {{position}} position at {{companyName}}. With my background and experience{{techStack}}, I am confident that I would be a valuable addition to your team.

I am excited about the opportunity to contribute to {{companyName}} and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for considering my application.

Sincerely,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'regular-with-resume',
			name: 'Regular Job Application (with Resume)',
			content: `Dear Hiring Manager,

I am writing to express my strong interest in the {{position}} position at {{companyName}}. With my background and experience{{techStack}}, I am confident that I would be a valuable addition to your team.

I have attached my resume for your review, which provides further details about my qualifications and achievements. I am excited about the opportunity to contribute to {{companyName}} and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for considering my application.

Sincerely,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'upwork',
			name: 'Upwork Proposal',
			content: `Hi there,

I came across your job posting for {{position}} and I'm excited to submit my proposal. I believe my skills and experience{{techStack}} make me an ideal candidate for this project.

I am confident that I can deliver high-quality results and would love to discuss how I can help you achieve your goals.

Thank you for your consideration.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'position',
				'techStack',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'follow-up',
			name: 'Follow-up After Application',
			content: `Dear Hiring Manager,

I wanted to follow up on my application for the {{position}} position at {{companyName}}, which I submitted on {{date}}.

I remain very interested in this opportunity and believe my experience{{techStack}} aligns well with your requirements. I would welcome the chance to discuss how I can contribute to {{companyName}}'s success.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
				'date',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'thank-you-interview',
			name: 'Thank You After Interview',
			content: `Dear Hiring Manager,

Thank you for taking the time to speak with me today about the {{position}} position at {{companyName}}. I truly enjoyed our conversation and learning more about the role and your team.

I am particularly excited about the opportunity to{{techStack}} and contribute to {{companyName}}'s continued success. Our discussion reinforced my interest in this position, and I am confident that my skills and experience would make me a valuable addition to your team.

I appreciate the opportunity to interview with you and look forward to hearing about the next steps in the process.

Thank you again for your time and consideration.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'referral',
			name: 'Referral-Based Application',
			content: `Dear Hiring Manager,

I am writing to express my interest in the {{position}} position at {{companyName}}. {{referrerName}} recommended that I reach out to you, as they thought my background and experience{{techStack}} would be a great fit for this role.

I am excited about the opportunity to contribute to {{companyName}} and would welcome the chance to discuss how my skills align with your needs.

Thank you for considering my application.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
				'referrerName',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'cold-outreach',
			name: 'Cold Outreach',
			content: `Dear Hiring Manager,

I hope this message finds you well. I am reaching out to express my interest in potential opportunities at {{companyName}}. I have been following your company's work and am impressed by {{companyAchievement}}.

With my experience{{techStack}}, I believe I could contribute meaningfully to your team. I would welcome the opportunity to discuss how my skills and background might align with your current or future needs.

Thank you for your time and consideration. I have attached my resume for your review and would be happy to provide any additional information you might need.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'techStack',
				'companyAchievement',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'career-change',
			name: 'Career Change Application',
			content: `Dear Hiring Manager,

I am writing to express my strong interest in the {{position}} position at {{companyName}}. While my background may differ from traditional candidates, I bring a unique perspective and transferable skills{{techStack}} that I believe would be valuable to your team.

I am excited about transitioning into this field and am committed to bringing the same dedication and excellence that has defined my career thus far. I am eager to learn and grow within {{companyName}} and contribute to your team's success.

Thank you for considering my application. I would welcome the opportunity to discuss how my diverse experience can benefit your organization.

Sincerely,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'internship',
			name: 'Internship Application',
			content: `Dear Hiring Manager,

I am writing to express my interest in the {{position}} internship opportunity at {{companyName}}. As a {{studentStatus}} with a passion for{{techStack}}, I am eager to gain hands-on experience and contribute to your team.

I am excited about the opportunity to learn from experienced professionals at {{companyName}} and apply my academic knowledge in a real-world setting. I am a quick learner, highly motivated, and ready to make a meaningful contribution to your projects.

Thank you for considering my application. I have attached my resume and would welcome the opportunity to discuss how I can contribute to your team.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
				'studentStatus',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'freelance-contract',
			name: 'Freelance/Contract Work',
			content: `Dear Hiring Manager,

I am writing to express my interest in the {{position}} opportunity at {{companyName}}. With my expertise in{{techStack}}, I am confident that I can deliver high-quality results for your project.

I have experience working on similar projects and understand the importance of clear communication, meeting deadlines, and exceeding expectations. I am flexible with my schedule and can work effectively both independently and as part of a team.

I would welcome the opportunity to discuss your project requirements in more detail and explain how my skills can help you achieve your goals.

Thank you for your consideration.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 're-application',
			name: 'Re-application',
			content: `Dear Hiring Manager,

I am writing to reapply for the {{position}} position at {{companyName}}. Since my last application, I have continued to develop my skills{{techStack}} and gain relevant experience that I believe makes me an even stronger candidate for this role.

I remain very interested in this opportunity and am confident that my updated qualifications align well with your requirements. I would welcome the chance to discuss how I can contribute to {{companyName}}'s success.

Thank you for your time and consideration.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'position',
				'techStack',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		{
			id: 'networking',
			name: 'Networking/Informational Interview Request',
			content: `Dear {{recipientName}},

I hope this message finds you well. I am reaching out because I am interested in learning more about career opportunities in {{fieldIndustry}} and would value your insights and advice.

I have been following {{companyName}}'s work and am particularly interested in{{techStack}}. I would be grateful for the opportunity to connect with you briefly to learn about your experience and gain insights into the industry.

I understand you are likely very busy, so I would be happy to work around your schedule. Even a brief 15-minute conversation would be incredibly valuable to me.

Thank you for your time and consideration.

Best regards,
{{fullName}}
{{email}}
{{phone}}`,
			variables: [
				'fullName',
				'email',
				'phone',
				'companyName',
				'techStack',
				'recipientName',
				'fieldIndustry',
			],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	],
	activeTemplateId: 'regular',
}

const templatesSlice = createSlice({
	name: 'templates',
	initialState,
	reducers: {
		addTemplate: (state, action: PayloadAction<Template>) => {
			state.templates.push(action.payload)
		},
		updateTemplate: (
			state,
			action: PayloadAction<{ id: string; template: Partial<Template> }>
		) => {
			const index = state.templates.findIndex(
				(t) => t.id === action.payload.id
			)
			if (index !== -1) {
				state.templates[index] = {
					...state.templates[index],
					...action.payload.template,
					updatedAt: new Date().toISOString(),
				}
			}
		},
		removeTemplate: (state, action: PayloadAction<string>) => {
			state.templates = state.templates.filter(
				(t) => t.id !== action.payload
			)
			if (state.activeTemplateId === action.payload) {
				state.activeTemplateId =
					state.templates.length > 0 ? state.templates[0].id : null
			}
		},
		setActiveTemplate: (state, action: PayloadAction<string>) => {
			state.activeTemplateId = action.payload
		},
	},
})

export const { addTemplate, updateTemplate, removeTemplate, setActiveTemplate } =
	templatesSlice.actions
export default templatesSlice.reducer
