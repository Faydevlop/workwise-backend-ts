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
exports.getTasksByProject = exports.getProjectsByManager = exports.removeProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
const departmentModel_1 = __importDefault(require("../../Department/model/departmentModel"));
const taskModel_1 = __importDefault(require("../../TaskManagement/models/taskModel"));
const createProject = (projectData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, status, startDate, endDate, priority, description, sdepartment, } = projectData;
    // Check for existing project with the same name
    const existingProject = yield projectModel_1.default.findOne({ name });
    if (existingProject) {
        throw new Error('Duplicate Project is Found');
    }
    // Create the new project with proper type handling for department
    const departmentId = sdepartment
        ? typeof sdepartment === 'string'
            ? new mongoose_1.default.Types.ObjectId(sdepartment)
            : sdepartment
        : undefined;
    const newProject = new projectModel_1.default({
        name,
        status,
        startDate,
        endDate,
        priority,
        description,
        department: departmentId,
    });
    yield newProject.save();
    return { message: "Project created successfully" };
});
exports.createProject = createProject;
const getAllProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield projectModel_1.default.find();
    if (!projects || projects.length === 0) {
        throw new Error("No Project Found");
    }
    return projects;
});
exports.getAllProjects = getAllProjects;
const getProjectById = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const projectDetails = yield projectModel_1.default.findById(projectId).populate('department');
    if (!projectDetails) {
        throw new Error("Project details not found");
    }
    return projectDetails;
});
exports.getProjectById = getProjectById;
const updateProject = (projectId, projectData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, status, startDate, endDate, priority, description, sdepartment } = projectData;
    const projectDetails = yield projectModel_1.default.findById(projectId);
    if (!projectDetails) {
        throw new Error("Project not found");
    }
    projectDetails.name = name;
    projectDetails.status = status;
    projectDetails.startDate = startDate;
    projectDetails.endDate = endDate;
    projectDetails.priority = priority;
    projectDetails.description = description;
    // Handle the department assignment with type safety
    if (sdepartment) {
        // Cast the department field to any to bypass TypeScript's strict type checking
        // This is a workaround for the Mongoose type incompatibility
        projectDetails.department = typeof sdepartment === 'string'
            ? new mongoose_1.default.Types.ObjectId(sdepartment)
            : sdepartment;
    }
    yield projectDetails.save();
    return { message: "Project updated successfully" };
});
exports.updateProject = updateProject;
const removeProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const projectDetails = yield projectModel_1.default.findById(projectId);
    if (!projectDetails) {
        throw new Error("Project not found");
    }
    yield projectModel_1.default.findByIdAndDelete(projectId);
    return { message: "Project deleted successfully" };
});
exports.removeProject = removeProject;
const getProjectsByManager = (managerId) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert string to ObjectId if needed
    const managerIdObj = typeof managerId === 'string'
        ? new mongoose_1.default.Types.ObjectId(managerId)
        : managerId;
    const department = yield departmentModel_1.default.findOne({ headOfDepartMent: managerIdObj });
    if (!department) {
        throw new Error("Department Not found");
    }
    const projectDetails = yield projectModel_1.default.find({
        department: department._id
    }).populate('department');
    if (!projectDetails || projectDetails.length === 0) {
        throw new Error("Project details not found");
    }
    // Fetch tasks for each project
    const projectIds = projectDetails.map(p => p._id);
    const tasks = yield taskModel_1.default.find({
        projectId: { $in: projectIds }
    }).populate('projectId');
    return { projectDetails, tasks };
});
exports.getProjectsByManager = getProjectsByManager;
const getTasksByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert string to ObjectId if needed
    const projectIdObj = typeof projectId === 'string'
        ? new mongoose_1.default.Types.ObjectId(projectId)
        : projectId;
    const tasks = yield taskModel_1.default.find({ projectId: projectIdObj });
    if (!tasks || tasks.length === 0) {
        throw new Error("No tasks found");
    }
    return { tasks };
});
exports.getTasksByProject = getTasksByProject;
