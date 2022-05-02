import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { favoriteHomes: true },
  });

  // TODO: Retrieve home ID from request
  const { id } = req.query;

  // TODO: Add home to favorite
  if (req.method === 'PUT') {
    //...
  }
  // TODO: Remove home from favorite
  else if (req.method === 'DELETE') {
    //...
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}