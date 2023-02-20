import { prisma } from "../db";

export async function getAccessToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId },
  });

  return account?.access_token;
}
