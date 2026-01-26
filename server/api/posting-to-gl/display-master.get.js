import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    if (!query.pmt_posting_id) {
      return {
        statusCode: 400,
        message: "pmt_posting_id is required",
      };
    }
    
    const postingId = parseInt(query.pmt_posting_id);
    
    // Fetch posting master details
    const postingMaster = await prisma.posting_master.findUnique({
      where: {
        pmt_posting_id: postingId,
      },
      select: {
        pmt_posting_id: true,
        pmt_total_amt: true,
        pmt_posting_no: true,
        pmt_system_id: true,
      },
    });
    
    if (!postingMaster) {
      return {
        statusCode: 404,
        message: "Posting master not found",
      };
    }
    
    // Format the response to match the original PHP structure
    return {
      statusCode: 200,
      message: "Posting master details fetched successfully",
      data: {
        SEQID: postingMaster.pmt_posting_id.toString(),
        AMOUNT: postingMaster.pmt_total_amt ? parseFloat(postingMaster.pmt_total_amt).toFixed(2) : "0.00",
        POSTINGNO: postingMaster.pmt_posting_no || "",
        SYSTEMID: postingMaster.pmt_system_id || "",
        count: 1,
      },
    };
  } catch (error) {
    console.error("Error fetching posting master details:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
});
