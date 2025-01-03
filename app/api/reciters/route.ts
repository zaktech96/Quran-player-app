import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.mp3quran.net/api/v3/reciters?language=eng', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.reciters) {
      throw new Error('No reciters data found');
    }

    const reciters = data.reciters
      .filter((reciter: any) => reciter.name.match(/^[A-Za-z\s]+$/))
      .map((reciter: any) => ({
        id: reciter.id,
        name: reciter.name,
        arabicName: reciter.arabic_name,
        format: 'audio'
      }));

    return NextResponse.json(reciters);
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return NextResponse.json({ error: 'Failed to fetch reciters' }, { status: 500 });
  }
} 