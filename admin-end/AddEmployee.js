import dbConnect from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
import Employee from '../../models/Employee';

const dummyEmployee = [
  { name: 'John Doe', email: 'johndoe@example.com', password: 'password123' },
  { name: 'Jane Smith', email: 'janesmith@example.com', password: 'mypassword' },
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'alicepass' },
  { name: 'Bob Brown', email: 'bob@example.com', password: 'bobpassword' },
  { name: 'Fatima Zahra', email: 'fatima.zahra@gmail.com', password: 'fatimapass' },
  { name: 'Omar Farooq', email: 'omar.farooq@gmail.com', password: 'omarpass' },
  { name: 'Aisha Ibrahim', email: 'aisha.ibrahim@gmail.com', password: 'aishapass' },
  {name : 'Rida Zaidi', email: 'rida.batool008@gmail.com' , password:'123456'},
  { name: 'Ahmed Pervaiz', email: 'ahmed.pervaiz@gmail.com', password: 'ahmedper' },
];

export default async function handler(req, res) { 
  try {
    
    await dbConnect();

    for (let userData of dummyEmployee) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const employee = new Employee({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        });

        await employee.save();
        console.log(`User added successfully: ${employee.name}`);

      } catch (err) {
        console.error(`Error adding user ${employee.email}:`, err);
      }
    }
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}