import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.mp3quran.net/api/v3/reciters?language=eng');
    const data = await response.json();
    
    if (data.reciters) {
      // Filter for English reciters or those with English translations
      const reciters = data.reciters
        .filter((reciter: any) => reciter.name.match(/^[A-Za-z\s]+$/))
        .map((reciter: any) => ({
          id: reciter.id,
          name: reciter.name,
          arabicName: reciter.arabic_name,
          format: 'audio'
        }));

      return NextResponse.json(reciters);
    } else {
      throw new Error('Failed to fetch reciters');
    }
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reciters' },
      { status: 500 }
    );
  }
} 