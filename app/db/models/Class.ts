import mongoose from "mongoose";


// Define a schema for a Class
const classSchema = new mongoose.Schema({
    // Define a field 'name' of type String for the class's name
    name: {
        type: String,
        required: true,
    },
    // Define a field 'teacher' that will store ObjectId of the User model (who is a teacher)
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // For classes, a list of students enrolled in them. This list will store ObjectIds of the User model
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    // Optional: Any other information relevant to the class
});

// Export the Class model. If it already exists, use that; otherwise, create a new model using the classSchema
export default mongoose.models.Class || mongoose.model('Class', classSchema);


