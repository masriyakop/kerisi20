import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause for filtering
    const where = {};
    
    // Search filter - searches across multiple fields
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      
      where.OR = [
        ...(isNaN(searchNum) ? [] : [{ vas_assessment_item_no: searchNum }]),
        { vas_assessment_item_code: { contains: searchTerm } },
        { vas_assessment_item_desc: { contains: searchTerm } },
        { vas_yn_flag: { contains: searchTerm } },
      ];
    }
    
    // Smart filter: Status (using vas_yn_flag)
    if (query.smartFilter_Status && query.smartFilter_Status.trim() !== '') {
      where.vas_yn_flag = query.smartFilter_Status.trim();
    }
    
    // Fetch assessment questions from database using Prisma ORM
    const assessmentQuestions = await prisma.vendor_assessment_setup.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      select: {
        vas_assessment_item_no: true,
        vas_assessment_item_code: true,
        vas_assessment_item_desc: true,
        vas_yn_flag: true,
      },
      orderBy: {
        vas_assessment_item_no: 'asc',
      },
    });
    
    // Format the response to match the page expectations
    const formattedData = assessmentQuestions.map((item) => ({
      id: item.vas_assessment_item_no,
      code: item.vas_assessment_item_code || '',
      description: item.vas_assessment_item_desc || '',
      status: item.vas_yn_flag || '',
      // Keep original fields for reference
      vas_assessment_item_no: item.vas_assessment_item_no,
      vas_assessment_item_code: item.vas_assessment_item_code,
      vas_assessment_item_desc: item.vas_assessment_item_desc,
      vas_yn_flag: item.vas_yn_flag,
    }));
    
    return {
      statusCode: 200,
      message: "Assessment questions fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch assessment questions",
      error: error.message,
    };
  }
});
