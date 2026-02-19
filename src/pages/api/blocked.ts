import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Return a 403 Forbidden response
  res.status(403).json({
    error: 'Access blocked',
    message: 'This domain has been blocked for security reasons.'
  });
} 