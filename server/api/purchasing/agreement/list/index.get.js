import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build where clause
    let whereClause = {};

    // Search filter
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { agr_agreement_no: { contains: searchTerm } },
        { agr_agreement_ref: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { agr_description: { contains: searchTerm } },
        { agr_status: { contains: searchTerm } },
      ];
    }

    // Smart filter for Status
    if (query.smartFilter_Status) {
      whereClause.agr_status = query.smartFilter_Status;
    }

    // Smart filter for Vendor Code
    if (query.smartFilter_VendorCode) {
      whereClause.vcs_vendor_code = { contains: query.smartFilter_VendorCode };
    }

    // Smart filter for Start Date
    if (query.smartFilter_StartDate) {
      const [day, month, year] = query.smartFilter_StartDate.split('/');
      const startDate = new Date(`${year}-${month}-${day}`);
      whereClause.agr_start_date = {
        ...(whereClause.agr_start_date || {}),
        gte: startDate,
      };
    }

    // Smart filter for End Date
    if (query.smartFilter_EndDate) {
      const [day, month, year] = query.smartFilter_EndDate.split('/');
      const endDate = new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.agr_end_date = {
        ...(whereClause.agr_end_date || {}),
        lte: endDate,
      };
    }

    // TODO: Update table name when agreement_master table is created
    // For now, return empty data as placeholder
    const agreements = [];
    
    /* Uncomment when table exists:
    const agreements = await prisma.agreement_master.findMany({
      where: whereClause,
      include: {
        vend_customer_supplier: {
          select: {
            vcs_vendor_code: true,
            vcs_vendor_name: true,
            vcs_address: true,
          },
        },
      },
      orderBy: {
        agr_agreement_id: 'desc',
      },
    });
    */

    // Process data
    const data = agreements.map((agr) => {
      const startDate = agr.agr_start_date
        ? new Date(agr.agr_start_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      const endDate = agr.agr_end_date
        ? new Date(agr.agr_end_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      return {
        AgreementID: agr.agr_agreement_id,
        AgreementNo: agr.agr_agreement_no || '',
        AgreementRef: agr.agr_agreement_ref || '',
        VendorCode: agr.vcs_vendor_code || '',
        VendorName: agr.vend_customer_supplier?.vcs_vendor_name || '',
        Address: agr.vend_customer_supplier?.vcs_address || '',
        Description: agr.agr_description || '',
        StartDate: startDate,
        EndDate: endDate,
        Amount: agr.agr_amount ? parseFloat(agr.agr_amount.toString()) : 0,
        AmountBalance: agr.agr_balance_amount ? parseFloat(agr.agr_balance_amount.toString()) : 0,
        AmountMonthly: agr.agr_monthly_amount ? parseFloat(agr.agr_monthly_amount.toString()) : 0,
        Duration: agr.agr_duration || '',
        Type: agr.agr_duration_type || '',
        Status: agr.agr_status || '',
        urlEdit: `/purchasing/agreement/edit/${agr.agr_agreement_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Agreements fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching agreements:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch agreements",
      error: error.message,
    };
  }
});
