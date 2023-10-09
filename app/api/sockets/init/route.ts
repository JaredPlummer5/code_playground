import { pusherServer } from '@/lib/pusher'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { username, projectId } = await req.json();
    pusherServer.trigger(`request-channel-${username}`, `project-request`, projectId)
    return NextResponse.json(username);
}