import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // For now, return common currency codes
    // In a real system, this would come from a currency_master table
    const currencyCodes = [
      {
        cym_currency_code: "MYR",
        cym_currency_desc: "Malaysian Ringgit",
        cyd_unit: "1",
        cyd_conversation_rate: 1.0,
      },
      {
        cym_currency_code: "USD",
        cym_currency_desc: "US Dollar",
        cyd_unit: "1",
        cyd_conversation_rate: 4.5, // Example rate
      },
      {
        cym_currency_code: "EUR",
        cym_currency_desc: "Euro",
        cyd_unit: "1",
        cyd_conversation_rate: 5.0, // Example rate
      },
    ];

    return {
      statusCode: 200,
      data: currencyCodes,
    };
  } catch (error) {
    console.error("Error fetching currency codes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch currency codes",
      error: error.message,
    };
  }
});

