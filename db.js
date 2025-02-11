const { response } = require('express')
const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: 'localhost',
    database: "school_management",
    password: "88595",
    port: 5000,
});

const createTables = `
    -- Create students table
    CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
        grade VARCHAR(20),
        status VARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Graduated'))
    );

    -- Create attendance table
    CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(20) CHECK (status IN ('Present', 'Absent', 'Late'))
    );

    CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);

    -- Create events table
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL
    );

    -- Create finance table
    CREATE TABLE IF NOT EXISTS finance (
        id SERIAL PRIMARY KEY,
        income DECIMAL(10, 2) CHECK (income >= 0) NOT NULL,
        expense DECIMAL(10, 2) CHECK (expense >= 0) NOT NULL,
        date DATE NOT NULL
    );

    -- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50)
);

`;

pool.query(createTables)
  .then((Response) => {
    console.log("Database Created");
    console.log(Response);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = pool;