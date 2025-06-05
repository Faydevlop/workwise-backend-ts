import Job from "../model/recruitementMode";
import JobReferral from "../model/JobReferral";

export class RecruitmentService {
  async createRecruitment(jobData: {
    jobTitle: string;
    role: string;
    department: string;
    jobDescription: string;
    requirements: string;
    responsibilities: string;
    location: string;
    employmentType: string;
    salaryRange: string;
    applicationProcess: string;
    contactEmail: string;
    contactPhone: string;
    applicationDeadline: string;
    eligibility: string;
  }) {
    // Validate required fields
    const {
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
      applicationDeadline,
      eligibility
    } = jobData;

    if (!jobTitle || !role || !department || !jobDescription || !requirements || 
        !responsibilities || !location || !employmentType || !salaryRange || 
        !applicationProcess || !contactEmail || !contactPhone || 
        !applicationDeadline || !eligibility) {
      throw new Error('All fields are required.');
    }

    // Create a new job post instance
    const newJobPost = new Job({
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
    await newJobPost.save();
    return { message: 'Job post created successfully', jobPost: newJobPost };
  }

  async listRecruitments() {
    const listingReq = await Job.find();
    
    if (!listingReq || listingReq.length === 0) {
      throw new Error('No Job Listing found');
    }
    
    return { listingData: listingReq };
  }

  async deleteRecruitment(listId: string) {
    const deletedData = await Job.findByIdAndDelete(listId);
    
    if (!deletedData) {
      throw new Error('Unable to delete');
    }
    
    return { message: 'Deleted successfully' };
  }

  async referJob(referralData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    qualifications: string;
    portfolio: string;
    referer: string;
    jobId: string;
    resumeUrl?: string;
  }) {
    const {
      name,
      email,
      phone,
      address,
      qualifications,
      portfolio,
      referer,
      jobId,
      resumeUrl
    } = referralData;

    // Create a new job referral entry in the database
    const jobReferral = new JobReferral({
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

    await jobReferral.save();
    return { message: 'Job referred successfully' };
  }

  async listReferrals() {
    const listData = await JobReferral.find()
      .populate('referer')
      .populate('jobId');
    
    if (!listData || listData.length === 0) {
      throw new Error('No Job Listing found');
    }
    
    return { listData };
  }

  async getReferralDetails(reqId: string) {
    const listDetail = await JobReferral.findById(reqId)
      .populate('jobId')
      .populate('referer');
    
    if (!listDetail) {
      throw new Error('No data found');
    }
    
    return { listDetail };
  }

  async deleteJobApplication(applicationId: string) {
    const applicationData = await JobReferral.findByIdAndDelete(applicationId);
    
    if (!applicationData) {
      throw new Error('No application found');
    }
    
    return { message: 'Application deleted successfully' };
  }

  async getJobDetails(jobId: string) {
    const listingData = await Job.findById(jobId);
    
    if (!listingData) {
      throw new Error('Listing data not found');
    }
    
    return { listdata: listingData };
  }

  async updateJobListing(jobId: string, updateData: {
    jobTitle: string;
    role: string;
    department: string;
    jobDescription: string;
    requirements: string;
    responsibilities: string;
    location: string;
    employmentType: string;
    salaryRange: string;
    applicationProcess: string;
    contactEmail: string;
    contactPhone: string;
    applicationDeadline: string;
    eligibility: string;
  }) {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
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
      },
      { new: true }
    );

    if (!updatedJob) {
      throw new Error('Job not found');
    }

    return { message: 'Job updated successfully', job: updatedJob };
  }
}

export default new RecruitmentService();