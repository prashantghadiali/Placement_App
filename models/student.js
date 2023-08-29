const { text } = require("body-parser");
const mongoose = require("mongoose");
const validator = require('validator');

// student Schema
const studentSchema = new mongoose.Schema({
    batch: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    college: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    dsa: {
        type: Number
    },
    webd: {
        type: Number
    },
    react: {
        type: Number
    },
    interview: [{
        comp: {
            type: String
        },
        date: {
            type: Date
        },
        result: {
            type: String
        }
      }]
},{
    timestamps: true
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

