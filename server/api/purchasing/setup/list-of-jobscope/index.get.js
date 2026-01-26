import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { jbs_jobscope_code: { contains: searchTerm } },
        { jbs_job_name: { contains: searchTerm } },
        { jbs_job_type: { contains: searchTerm } },
      ];
    }

    if (query.smartFilter_Status) {
      whereClause.jbs_status = query.smartFilter_Status;
    }

    const jobscopes = await prisma.jobscope.findMany({
      where: whereClause,
      orderBy: {
        jbs_id: 'desc',
      },
    });

    // Get unique category codes to fetch descriptions
    const categoryCodes = [...new Set(jobscopes.map(j => j.jbc_category).filter(Boolean))];
    const categories = categoryCodes.length > 0 ? await prisma.jobscope_category.findMany({
      where: { jbc_category: { in: categoryCodes } },
      select: { jbc_category: true, jbc_desc: true },
    }) : [];

    const categoryMap = new Map(categories.map(c => [c.jbc_category, c.jbc_desc]));

    const data = jobscopes.map((job) => {
      const categoryDesc = job.jbc_category ? categoryMap.get(job.jbc_category) : null;
      const categoryDisplay = categoryDesc 
        ? `${job.jbc_category} - ${categoryDesc}` 
        : (job.jbc_category || '');

      return {
        jbs_id: job.jbs_id,
        Code: job.jbs_jobscope_code || '',
        Name: job.jbs_job_name || '',
        Level: job.jbs_level ? job.jbs_level.toString() : '',
        Type: job.jbs_job_type || '',
        Category: categoryDisplay,
        Parent: job.jbs_job_code_parent || '',
        Status: job.jbs_status || '',
        urlEdit: `/purchasing/setup/jobscope/edit/${job.jbs_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Jobscope list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching jobscope list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch jobscope list",
      error: error.message,
    };
  }
});
