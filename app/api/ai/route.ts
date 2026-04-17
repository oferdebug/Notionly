import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: NextRequest) {
	try {
		const { text, action } = await request.json();

		const prompts: Record<string, string> = {
			improve: `Improve the following text. Keep the same meaning but make it clearer and more professional. Return only the improved text, nothing else:\n\n${text}`,
			summarize: `Summarize the following text in 2-3 sentences. Return only the summary:\n\n${text}`,
			translate_he: `Translate the following text to Hebrew. Return only the translation:\n\n${text}`,
			translate_en: `Translate the following text to English. Return only the translation:\n\n${text}`,
			continue: `Continue writing the following text naturally. Write 2-3 more sentences that flow from the original. Return only the continuation:\n\n${text}`,
			fix_grammar: `Fix any grammar and spelling errors in the following text. Return only the corrected text:\n\n${text}`,
		};

		const prompt = prompts[action];
		if (!prompt) {
			return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
		}

		const completion = await groq.chat.completions.create({
			messages: [{ role: 'user', content: prompt }],
			model: 'llama-3.3-70b-versatile',
			temperature: 0.7,
			max_tokens: 1024,
		});

		const result = completion.choices[0]?.message?.content || '';

		return NextResponse.json({ result }, { status: 200 });
	} catch (error) {
		console.error('AI Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
