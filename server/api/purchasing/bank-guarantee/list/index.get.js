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
        { vcs_vendor_code: { contains: searchTerm } },
        { cbg_issuer_bank: { contains: searchTerm } },
        { cbg_branch_name: { contains: searchTerm } },
        { cbg_bog_no: { contains: searchTerm } },
        { cbg_agreement_no: { contains: searchTerm } },
        { cbg_po_no: { contains: searchTerm } },
        { cbg_status: { contains: searchTerm } },
      ];
    }

    // Smart filter for Status
    if (query.smartFilter_Status) {
      whereClause.cbg_status = query.smartFilter_Status;
    }

    // Smart filter for Vendor Code
    if (query.smartFilter_VendorCode) {
      whereClause.vcs_vendor_code = { contains: query.smartFilter_VendorCode };
    }

    // Fetch bank guarantees
    const bankGuarantees = await prisma.ccontroller_bank_guarantee.findMany({
      where: whereClause,
      orderBy: {
        cbg_id: 'desc',
      },
    });

    // Get unique vendor codes
    const vendorCodes = [...new Set(bankGuarantees.map(bg => bg.vcs_vendor_code).filter(Boolean))];
    
    // Fetch vendors
    const vendors = vendorCodes.length > 0 ? await prisma.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true,
      },
    }) : [];

    // Create vendor map
    const vendorMap = new Map(vendors.map(v => [v.vcs_vendor_code, v]));

    // Process data
    const data = bankGuarantees.map((bg) => {
      const bgDate = bg.cbg_bog_date
        ? new Date(bg.cbg_bog_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      const bgExpired = bg.cbg_bog_expired
        ? new Date(bg.cbg_bog_expired).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      const poDate = bg.cbg_po_date
        ? new Date(bg.cbg_po_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      const agreementDate = bg.cbg_agreement_end_date
        ? new Date(bg.cbg_agreement_end_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      const vendor = vendorMap.get(bg.vcs_vendor_code);

      return {
        vcs_vendor_code: bg.vcs_vendor_code || '',
        vcs_vendor_name: vendor?.vcs_vendor_name || '',
        cbg_issuer_bank: bg.cbg_issuer_bank || '',
        cbg_branch_name: bg.cbg_branch_name || '',
        cbg_bog_no: bg.cbg_bog_no || '',
        cbg_bog_date: bgDate,
        cbg_bog_expired: bgExpired,
        cbg_agreement_no: bg.cbg_agreement_no || '',
        cbg_amount: bg.cbg_amount ? parseFloat(bg.cbg_amount.toString()) : 0,
        cbg_po_no: bg.cbg_po_no || '',
        cbg_po_date: poDate,
        cbg_agreement_end_date: agreementDate,
        cbg_status: bg.cbg_status || '',
        cbg_remark: bg.cbg_remark || '',
        urlEdit: `/purchasing/bank-guarantee/edit/${bg.cbg_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Bank guarantees fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching bank guarantees:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch bank guarantees",
      error: error.message,
    };
  }
});
