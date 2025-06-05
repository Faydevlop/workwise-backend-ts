
import mongoose, { Types } from "mongoose";
import User from "../../employee/models/userModel";
import Department from "../model/departmentModel";
import Project from '../../admin/models/projectModel';

interface DepartmentData {
  departmentName: string;
  headOfDepartment: mongoose.Types.ObjectId | string | null;
  description: string;
  email: string;
  phone: number;
  teamMembers: string[] | Types.ObjectId[];
}

export const findNonDepartmentEmployees = async () => {
  const users = await User.find({ department: null, position: 'Employee' });
  if (!users || users.length === 0) {
    throw new Error('Users not found without department');
  }
  return users;
};

export const findManagers = async () => {
  const admins = await User.find({ department: null, position: 'Manager' });
  if (!admins || admins.length === 0) {
    throw new Error('Admins not found');
  }
  return admins;
};

export const createDepartment = async (departmentData: DepartmentData) => {
  const { departmentName, headOfDepartment, description, email, phone, teamMembers } = departmentData;

  // Create a new department
  const newDepartment = new Department({
    departmentName,
    // Fixed property name to match the schema
    headOfDepartMent: headOfDepartment === 'null' ? null : headOfDepartment,
    description,
    email,
    phone,
    // Fixed property name to match the schema
    TeamMembers: teamMembers || [],
  });

  // Save the department to the database
  const savedDepartment = await newDepartment.save();

  // Update the head of department
  if (headOfDepartment && headOfDepartment !== 'null') {
    await User.updateOne(
      { _id: headOfDepartment },
      { $set: { department: savedDepartment._id } }
    );
  }

  // Update team members
  if (teamMembers && teamMembers.length > 0) {
    await User.updateMany(
      { _id: { $in: teamMembers } },
      { $set: { department: savedDepartment._id } }
    );
  }

  return savedDepartment;
};

export const getAllDepartments = async () => {
  const departments = await Department.find().populate('headOfDepartMent');
  if (!departments) {
    throw new Error('Departments not found');
  }
  return departments;
};

export const removeDepartment = async (departmentId: string | Types.ObjectId) => {
  const deletedDepartment = await Department.findById(departmentId);
  
  if (!deletedDepartment) {
    throw new Error('Department not found');
  }

  // Update the head of department
  if (deletedDepartment.headOfDepartMent) {
    await User.updateOne(
      { _id: deletedDepartment.headOfDepartMent },
      { $set: { department: null } }
    );
  }

  // Update team members
  if (deletedDepartment.TeamMembers && deletedDepartment.TeamMembers.length > 0) {
    await User.updateMany(
      { _id: { $in: deletedDepartment.TeamMembers } },
      { $set: { department: null } }
    );
  }

  await Department.findByIdAndDelete(departmentId);
  return { message: 'Department deleted successfully' };
};

export const getDepartmentDetails = async (departmentId: string | Types.ObjectId) => {
  const departmentDetails = await Department.findById(departmentId)
    .populate('headOfDepartMent')
    .populate('TeamMembers');

  if (!departmentDetails) {
    throw new Error('Department Not Found');
  }

  const projectDetails = await Project.find({ department: departmentId });
  
  return { department: departmentDetails, projects: projectDetails };
};

export const updateDepartmentDetails = async (departmentId: string | Types.ObjectId, departmentData: DepartmentData) => {
  const { departmentName, headOfDepartment, description, email, phone, teamMembers } = departmentData;
  
  const departmentDetails = await Department.findById(departmentId);
  
  if (!departmentDetails) {
    throw new Error('Department is not found');
  }

  departmentDetails.departmentName = departmentName;
  // Fixed property name to match the schema
  departmentDetails.headOfDepartMent = headOfDepartment as mongoose.Schema.Types.ObjectId | null;
  departmentDetails.description = description;
  departmentDetails.email = email;
  departmentDetails.phone = phone;
  // Fixed property name to match the schema
  departmentDetails.TeamMembers = teamMembers.map(member => new mongoose.Types.ObjectId(member.toString()) as unknown as mongoose.Schema.Types.ObjectId);

  if (teamMembers && teamMembers.length > 0) {
    await User.updateMany(
      { _id: { $in: teamMembers } }, 
      { $set: { department: departmentId } }
    );
  }

  await departmentDetails.save();
  return { message: 'Department updated successfully' };
};

export const removeTeamMember = async (departmentId: string | Types.ObjectId, teamMemberId: string | Types.ObjectId) => {
  const departmentDetails = await Department.findById(departmentId);
  
  if (!departmentDetails) {
    throw new Error('Department is not found');
  }

  // Convert teamMemberId to string for comparison
  const teamMemberIdStr = teamMemberId.toString();
  
  // Find the index by comparing string representations
  const memberIndex = departmentDetails.TeamMembers.findIndex(
    member => member.toString() === teamMemberIdStr
  );

  if (memberIndex === -1) {
    throw new Error('Team member not found in this department');
  }

  // Remove the team member from the array
  departmentDetails.TeamMembers.splice(memberIndex, 1);

  // Save the updated department details
  await departmentDetails.save();

  // Update the user to remove the department association
  await User.findByIdAndUpdate(
    teamMemberId,
    { $set: { department: null } }, // Changed from $unset to $set with null
    { new: true }
  );

  return { message: 'Team member removed successfully', departmentDetails };
};