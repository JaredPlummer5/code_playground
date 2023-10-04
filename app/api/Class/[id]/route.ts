import { NextRequest, NextResponse } from "next/server";
import User from "../../../db/models/User";
import Projects from "../../../db/models/project";
import Class from "../../../db/models/Class";
import mongoose from "mongoose";
const uri = process.env.MONGO_URI_DOCKER || '';

export async function POST(request: NextRequest, {params}:{params:{_id: string}}) {
    try {
        await mongoose.connect(uri);
    
        const { _id } = params;
    
        let { students } = await request.json();
    
        let classroom = await Class.findById({ _id });
    
        for (let i = 0; i < students.length; i++) {

            classroom.student.push(students[i]);
            await classroom.save();
        }
        NextResponse.json(classroom);
    }
    catch (error) {
        NextResponse.json(error);
    }
}

export async function GET(request: NextRequest, {params}:{params:{_id: string}}) {
    try {
        
        await mongoose.connect(uri);
        
        const { _id } = params;
        let classroom = await Class.findById({ _id });
        NextResponse.json(classroom);
    }
    catch (error) {
        NextResponse.json(error);
    }
        
}