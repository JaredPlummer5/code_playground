import { pusherServer } from '@/lib/pusher'

export async function POST(req: Request) {
  const { newFile, projectId } = await req.json()
  pusherServer.trigger(projectId, 'file-change', newFile)
  return new Response(JSON.stringify({ success: true }))
}