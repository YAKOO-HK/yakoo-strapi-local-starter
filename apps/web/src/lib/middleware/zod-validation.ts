import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function withBodyValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (req: NextRequest, body: z.infer<T>, ...args: any[]) => Promise<Response> | Response
) {
  return async function (req: NextRequest, ...args: any[]) {
    try {
      const json = await req.json();
      const body = await schema.parse(json);
      return await handler(req, body, ...args);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(error.issues, { status: 422 });
      }
      throw error;
    }
  };
}
