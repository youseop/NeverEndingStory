const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = mongoose.Schema({
  name: String,
  age: Number,
  subject: String 
});

const Teacher = mongoose.model('teachers', teacherSchema);


const studentSchema = mongoose.Schema({
  name: String,
  age: Number,
  subject: String 
});

const Student = mongoose.model('students', studentSchema);

const classSchema = mongoose.Schema({
  grade: Number,
  class: Number,
  teacher: teacherSchema,
  student: [studentSchema]
})

const Class = mongoose.model('class', classSchema);

module.exports = {Teacher, Student, Class}
