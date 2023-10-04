import { NextRequest, NextResponse } from "next/server";
import User from "../../db/models/User";
import Projects from "../../db/models/project";
import Class from "../../db/models/Class";
import mongoose from "mongoose";
const uri = process.env.MONGO_URI_DOCKER || '';




export async function POST(request: Request) {
    try {
        await mongoose.connect(uri);
        let { name, teacherId } = await request.json();

        // Input validation
        if (!name || !teacherId) {
            return NextResponse.json({ error: "Name and teacherId are required" });
        }

        let teacher = await User.findById({_id: teacherId});

        // Check if teacher exists
        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" });
        }

        // Check if user is a teacher (optional)
        if (teacher.role !== 'Teacher') {
            return NextResponse.json({ error: "Specified user is not a teacher" });
        }

        let newClass = await Class.create({
            name: name,
            teacher: teacher,
            students: []
        });
        
        // Optional: You might also want to add this class to the teacher's classesTeaching array
        teacher.classesTeaching.push(newClass._id);
        await teacher.save();

        return NextResponse.json(newClass);
    }
    catch (error) {
        // Log the error for debugging purposes
        console.error(error);
        return NextResponse.json({ error: "An error occurred while creating the class" });
    }
}
