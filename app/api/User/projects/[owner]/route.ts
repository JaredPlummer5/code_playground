import { NextResponse } from "next/server";
import Project from "../../../../db/models/project";
import mongoose from "mongoose";
const uri = process.env.MONGO_URI_DOCKER || '';
mongoose.connect(uri);
//get a project
export async function GET(request: Request, { params }: { params: { owner: string } }) {
    const { owner } = params;
    try {
        const project = await Project.find({owner});
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(request: Request, { params }: { params: { owner: string } }) {
    const { owner } = params;
    try {
        const { title, files, lab, languageId, description } = await request.json();
        let project = await Project.create({ title, files, lab, languageId, owner, description });
        return NextResponse.json(project);
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error }, { status: 500 });
    }
}
