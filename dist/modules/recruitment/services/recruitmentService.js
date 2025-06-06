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
exports.RecruitmentService = void 0;
const recruitementMode_1 = __importDefault(require("../model/recruitementMode"));
const JobReferral_1 = __importDefault(require("../model/JobReferral"));
class RecruitmentService {
    createRecruitment(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate required fields
            const { jobTitle, role, department, jobDescription, requirements, responsibilities, location, employmentType, salaryRange, applicationProcess, contactEmail, contactPhone, applicationDeadline, eligibility } = jobData;
            if (!jobTitle || !role || !department || !jobDescription || !requirements ||
                !responsibilities || !location || !employmentType || !salaryRange ||
                !applicationProcess || !contactEmail || !contactPhone ||
                !applicationDeadline || !eligibility) {
                throw new Error('All fields are required.');
            }
            // Create a new job post instance
            const newJobPost = new recruitementMode_1.default({
                jobTitle,
                role,
                department,
                jobDescription,
                requirements,
                responsibilities,
                location,
                employmentType,
                salaryRange,
                applicationProcess,
                contactEmail,
                contactPhone,
                applicationDeadline: new Date(applicationDeadline),
                eligibilityCriteria: eligibility,
            });
            // Save the job post to the database
            yield newJobPost.save();
            return { message: 'Job post created successfully', jobPost: newJobPost };
        });
    }
    listRecruitments() {
        return __awaiter(this, void 0, void 0, function* () {
            const listingReq = yield recruitementMode_1.default.find();
            if (!listingReq || listingReq.length === 0) {
                throw new Error('No Job Listing found');
            }
            return { listingData: listingReq };
        });
    }
    deleteRecruitment(listId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedData = yield recruitementMode_1.default.findByIdAndDelete(listId);
            if (!deletedData) {
                throw new Error('Unable to delete');
            }
            return { message: 'Deleted successfully' };
        });
    }
    referJob(referralData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, address, qualifications, portfolio, referer, jobId, resumeUrl } = referralData;
            // Create a new job referral entry in the database
            const jobReferral = new JobReferral_1.default({
                name,
                email,
                phone,
                address,
                qualifications,
                portfolio,
                referer,
                resume: resumeUrl,
                jobId
            });
            yield jobReferral.save();
            return { message: 'Job referred successfully' };
        });
    }
    listReferrals() {
        return __awaiter(this, void 0, void 0, function* () {
            const listData = yield JobReferral_1.default.find()
                .populate('referer')
                .populate('jobId');
            if (!listData || listData.length === 0) {
                throw new Error('No Job Listing found');
            }
            return { listData };
        });
    }
    getReferralDetails(reqId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listDetail = yield JobReferral_1.default.findById(reqId)
                .populate('jobId')
                .populate('referer');
            if (!listDetail) {
                throw new Error('No data found');
            }
            return { listDetail };
        });
    }
    deleteJobApplication(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const applicationData = yield JobReferral_1.default.findByIdAndDelete(applicationId);
            if (!applicationData) {
                throw new Error('No application found');
            }
            return { message: 'Application deleted successfully' };
        });
    }
    getJobDetails(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const listingData = yield recruitementMode_1.default.findById(jobId);
            if (!listingData) {
                throw new Error('Listing data not found');
            }
            return { listdata: listingData };
        });
    }
    updateJobListing(jobId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jobId) {
                throw new Error('Job ID is required');
            }
            const updatedJob = yield recruitementMode_1.default.findByIdAndUpdate(jobId, {
                jobTitle: updateData.jobTitle,
                role: updateData.role,
                department: updateData.department,
                jobDescription: updateData.jobDescription,
                requirements: updateData.requirements,
                responsibilities: updateData.responsibilities,
                location: updateData.location,
                employmentType: updateData.employmentType,
                salaryRange: updateData.salaryRange,
                applicationProcess: updateData.applicationProcess,
                contactEmail: updateData.contactEmail,
                contactPhone: updateData.contactPhone,
                applicationDeadline: updateData.applicationDeadline,
                eligibility: updateData.eligibility
            }, { new: true });
            if (!updatedJob) {
                throw new Error('Job not found');
            }
            return { message: 'Job updated successfully', job: updatedJob };
        });
    }
}
exports.RecruitmentService = RecruitmentService;
exports.default = new RecruitmentService();
