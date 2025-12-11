import ollama from 'ollama';

export async function generateCoachNotes(activityData: any): Promise<string> {
  const prompt = `Generate personalized running coaching notes based on this activity data: ${JSON.stringify(activityData)}. Focus on motivation, technique, and improvement suggestions. Keep it concise and encouraging.`;

  try {
    const response = await ollama.generate({
      model: 'llama3.2:1b',
      prompt: prompt,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    });

    return response.response;
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw new Error('Failed to generate AI coaching notes');
  }
}