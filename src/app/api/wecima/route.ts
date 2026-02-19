import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const $ = cheerio.load(html);
    const serverElement = $('li.MyCimaServer.selected');
    
    if (!serverElement.length) {
      return NextResponse.json({ error: 'Could not find MyCimaServer element' }, { status: 404 });
    }
    
    const btnElement = serverElement.find('btn');
    if (!btnElement.length) {
      return NextResponse.json({ error: 'Could not find btn element' }, { status: 404 });
    }
    
    const embedUrl = btnElement.attr('data-url');
    if (!embedUrl) {
      return NextResponse.json({ error: 'Could not find data-url attribute' }, { status: 404 });
    }
    
    return NextResponse.json({ embedUrl });
  } catch (error) {
    console.error('Error extracting wecima embed URL:', error);
    return NextResponse.json({ error: 'Failed to extract embed URL' }, { status: 500 });
  }
} 