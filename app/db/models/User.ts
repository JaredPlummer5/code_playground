// Import the mongoose library to be used for database modeling
import mongoose from "mongoose";

// Define a schema for a User
const userSchema = new mongoose.Schema({
    // Define a field 'username' of type String which is required and unique for each user
    username: {
        type: String
        
    },
    // Define a field 'email' of type String which is required and unique for each user
    email: {
        type: String
    },

    // Define a field 'role' of type String which can only take one of the values 'student' or 'teacher'
    role: {
        type: String,
        enum: ['Student', 'Teacher', 'Regular User'],
        default: 'Student'
    },
    // For students, a list of teachers they are associated with. This list will store ObjectIds of the User model
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // For teachers, a list of students assigned to them. This list will store ObjectIds of the User model
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Define a field 'createdAt' of type Date which will have a default value of the current date and time
    createdAt: {
        type: Date,
        default: Date.now,
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
        // Description of the project
    description:{
        type: String
    }
    
});

// Export the User model. If the User model already exists, then use that, otherwise create a new model using the userSchema
export default mongoose.models.User || mongoose.model('User', userSchema);
