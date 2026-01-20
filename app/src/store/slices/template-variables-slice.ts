import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type TemplateVariable, FieldType } from '../../types'
import { TECH_STACK_OPTIONS } from '../../constants/tech-stack-options'

interface TemplateVariablesState {
	variables: TemplateVariable[]
}

const initialState: TemplateVariablesState = {
	variables: [
		{
			id: 'fullName',
			name: 'fullName',
			label: 'Full Name',
			fieldType: FieldType.TEXT,
			required: true,
			placeholder: '[Your Full Name]',
		},
		{
			id: 'email',
			name: 'email',
			label: 'Email',
			fieldType: FieldType.EMAIL,
			required: true,
			placeholder: '[your.email@example.com]',
		},
		{
			id: 'phone',
			name: 'phone',
			label: 'Phone',
			fieldType: FieldType.PHONE,
			placeholder: '[Your Phone Number]',
		},
		{
			id: 'companyName',
			name: 'companyName',
			label: 'Company Name',
			fieldType: FieldType.TEXT,
			required: true,
			placeholder: '[Company Name]',
		},
		{
			id: 'techStack',
			name: 'techStack',
			label: 'Relevant Tech Stack',
			fieldType: FieldType.MULTISELECT,
			options: TECH_STACK_OPTIONS,
			placeholder: '[Relevant Technologies]',
		},
		{
			id: 'position',
			name: 'position',
			label: 'Position Applied For',
			fieldType: FieldType.TEXT,
			required: true,
			placeholder: '[Job Position]',
		},
		{
			id: 'date',
			name: 'date',
			label: 'Date',
			fieldType: FieldType.DATE,
			placeholder: '[Date]',
		},
		{
			id: 'referrerName',
			name: 'referrerName',
			label: 'Referrer Name',
			fieldType: FieldType.TEXT,
			placeholder: '[Name]',
		},
		{
			id: 'companyAchievement',
			name: 'companyAchievement',
			label: 'Company Achievement/Aspect',
			fieldType: FieldType.TEXT,
			placeholder: '[specific achievement or aspect of the company]',
		},
		{
			id: 'studentStatus',
			name: 'studentStatus',
			label: 'Student Status',
			fieldType: FieldType.TEXT,
			placeholder: '[student/recent graduate]',
		},
		{
			id: 'recipientName',
			name: 'recipientName',
			label: 'Recipient Name',
			fieldType: FieldType.TEXT,
			placeholder: '[Name/Hiring Manager]',
		},
		{
			id: 'fieldIndustry',
			name: 'fieldIndustry',
			label: 'Field/Industry',
			fieldType: FieldType.TEXT,
			placeholder: '[field/industry]',
		},
	],
}

const templateVariablesSlice = createSlice({
	name: 'templateVariables',
	initialState,
	reducers: {
		addVariable: (state, action: PayloadAction<TemplateVariable>) => {
			state.variables.push(action.payload)
		},
		updateVariable: (
			state,
			action: PayloadAction<{ id: string; variable: Partial<TemplateVariable> }>
		) => {
			const index = state.variables.findIndex(
				(v) => v.id === action.payload.id
			)
			if (index !== -1) {
				state.variables[index] = {
					...state.variables[index],
					...action.payload.variable,
				}
			}
		},
		removeVariable: (state, action: PayloadAction<string>) => {
			state.variables = state.variables.filter((v) => v.id !== action.payload)
		},
	},
})

export const { addVariable, updateVariable, removeVariable } =
	templateVariablesSlice.actions
export default templateVariablesSlice.reducer
