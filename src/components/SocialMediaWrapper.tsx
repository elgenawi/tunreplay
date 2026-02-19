// This is a Server Component
import { getSocialMedia } from '@/lib/api';
import SocialMediaList from './SocialMediaList'; // This can be a Client Component

export default async function SocialMediaWrapper() {
  const socialMedia = await getSocialMedia();
  
  return <SocialMediaList socialMedia={socialMedia} />;
} 