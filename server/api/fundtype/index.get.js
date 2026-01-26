import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const fundTypes = await prisma.fund_type.findMany({
      orderBy: {
        fty_fund_type: 'asc',
      },
    });

    // Map database fields to frontend format
    const formattedData = fundTypes.map((item, index) => ({
      no: index + 1,
      fty_fund_id: item.fty_fund_id,
      fundType: item.fty_fund_type,
      descriptionMalay: item.fty_fund_desc,
      descriptionEnglish: item.fty_fund_desc_eng || "",
      typeBasis: item.fty_basis || "",
      status: (() => {
        const statusValue = item.fty_status;
        if (!statusValue) return "INACTIVE";
        const statusStr = String(statusValue).trim();
        return (statusStr === "1" || statusStr === "ACTIVE") ? "ACTIVE" : "INACTIVE";
      })(),
      remark: item.fty_remark || "",
      action: "", // Empty string for action column
    }));

    return {
      statusCode: 200,
      message: "Fund types fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching fund types:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching fund types",
      error: error.message,
    };
  }
});

