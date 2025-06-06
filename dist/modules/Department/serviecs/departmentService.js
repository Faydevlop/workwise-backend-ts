"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTeamMember = exports.updateDepartmentDetails = exports.getDepartmentDetails = exports.removeDepartment = exports.getAllDepartments = exports.createDepartment = exports.findManagers = exports.findNonDepartmentEmployees = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const departmentModel_1 = __importDefault(require("../model/departmentModel"));
const projectModel_1 = __importDefault(require("../../admin/models/projectModel"));
const findNonDepartmentEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find({ department: null, position: 'Employee' });
    if (!users || users.length === 0) {
        throw new Error('Users not found without department');
    }
    return users;
});
exports.findNonDepartmentEmployees = findNonDepartmentEmployees;
const findManagers = () => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield userModel_1.default.find({ department: null, position: 'Manager' });
    if (!admins || admins.length === 0) {
        throw new Error('Admins not found');
    }
    return admins;
});
exports.findManagers = findManagers;
const createDepartment = (departmentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentName, headOfDepartment, description, email, phone, teamMembers } = departmentData;
    // Create a new department
    const newDepartment = new departmentModel_1.default({
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
    const savedDepartment = yield newDepartment.save();
    // Update the head of department
    if (headOfDepartment && headOfDepartment !== 'null') {
        yield userModel_1.default.updateOne({ _id: headOfDepartment }, { $set: { department: savedDepartment._id } });
    }
    // Update team members
    if (teamMembers && teamMembers.length > 0) {
        yield userModel_1.default.updateMany({ _id: { $in: teamMembers } }, { $set: { department: savedDepartment._id } });
    }
    return savedDepartment;
});
exports.createDepartment = createDepartment;
const getAllDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    const departments = yield departmentModel_1.default.find().populate('headOfDepartMent');
    if (!departments) {
        throw new Error('Departments not found');
    }
    return departments;
});
exports.getAllDepartments = getAllDepartments;
const removeDepartment = (departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedDepartment = yield departmentModel_1.default.findById(departmentId);
    if (!deletedDepartment) {
        throw new Error('Department not found');
    }
    // Update the head of department
    if (deletedDepartment.headOfDepartMent) {
        yield userModel_1.default.updateOne({ _id: deletedDepartment.headOfDepartMent }, { $set: { department: null } });
    }
    // Update team members
    if (deletedDepartment.TeamMembers && deletedDepartment.TeamMembers.length > 0) {
        yield userModel_1.default.updateMany({ _id: { $in: deletedDepartment.TeamMembers } }, { $set: { department: null } });
    }
    yield departmentModel_1.default.findByIdAndDelete(departmentId);
    return { message: 'Department deleted successfully' };
});
exports.removeDepartment = removeDepartment;
const getDepartmentDetails = (departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const departmentDetails = yield departmentModel_1.default.findById(departmentId)
        .populate('headOfDepartMent')
        .populate('TeamMembers');
    if (!departmentDetails) {
        throw new Error('Department Not Found');
    }
    const projectDetails = yield projectModel_1.default.find({ department: departmentId });
    return { department: departmentDetails, projects: projectDetails };
});
exports.getDepartmentDetails = getDepartmentDetails;
const updateDepartmentDetails = (departmentId, departmentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentName, headOfDepartment, description, email, phone, teamMembers } = departmentData;
    const departmentDetails = yield departmentModel_1.default.findById(departmentId);
    if (!departmentDetails) {
        throw new Error('Department is not found');
    }
    departmentDetails.departmentName = departmentName;
    // Fixed property name to match the schema
    departmentDetails.headOfDepartMent = headOfDepartment;
    departmentDetails.description = description;
    departmentDetails.email = email;
    departmentDetails.phone = phone;
    // Fixed property name to match the schema
    departmentDetails.TeamMembers = teamMembers.map(member => new mongoose_1.default.Types.ObjectId(member.toString()));
    if (teamMembers && teamMembers.length > 0) {
        yield userModel_1.default.updateMany({ _id: { $in: teamMembers } }, { $set: { department: departmentId } });
    }
    yield departmentDetails.save();
    return { message: 'Department updated successfully' };
});
exports.updateDepartmentDetails = updateDepartmentDetails;
const removeTeamMember = (departmentId, teamMemberId) => __awaiter(void 0, void 0, void 0, function* () {
    const departmentDetails = yield departmentModel_1.default.findById(departmentId);
    if (!departmentDetails) {
        throw new Error('Department is not found');
    }
    // Convert teamMemberId to string for comparison
    const teamMemberIdStr = teamMemberId.toString();
    // Find the index by comparing string representations
    const memberIndex = departmentDetails.TeamMembers.findIndex(member => member.toString() === teamMemberIdStr);
    if (memberIndex === -1) {
        throw new Error('Team member not found in this department');
    }
    // Remove the team member from the array
    departmentDetails.TeamMembers.splice(memberIndex, 1);
    // Save the updated department details
    yield departmentDetails.save();
    // Update the user to remove the department association
    yield userModel_1.default.findByIdAndUpdate(teamMemberId, { $set: { department: null } }, // Changed from $unset to $set with null
    { new: true });
    return { message: 'Team member removed successfully', departmentDetails };
});
exports.removeTeamMember = removeTeamMember;
