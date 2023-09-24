import { NextResponse } from "next/server";
import Student from "../../db/models/User";
import mongoose from "mongoose";
const uri = process.env.MONGO_URI_DOCKER || '';

export async function POST(request: Request) {
    try {
        await mongoose.connect(uri);

        const { studentEmail, teacherEmail, title, files, lab, languageId } = await request.json();
        
        // Find the student by email
        const student = await Student.findOne({ email: studentEmail });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Check if this teacher is already associated with the student
        const teacherExists = student.teachers.some(teacher => teacher.email === teacherEmail);
        if (!teacherExists) {
            return NextResponse.json({ error: 'Teacher is not associated with this student' }, { status: 403 });
        }

        // Add the new project to the student's projects array
        student.projects.push({ title, files, lab, languageId });
        await student.save();

        return NextResponse.json(student);

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error }, { status: 500 });
    } finally {
        // Make sure to disconnect from the database
        await mongoose.disconnect();
    }
}