import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    // Search filter
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { vcs_vendor_code: { contains: searchTerm } },
        { vcs_vendor_name: { contains: searchTerm } },
        { vcs_address: { contains: searchTerm } },
        { vcs_registration_no: { contains: searchTerm } },
        { vcs_kk_regno: { contains: searchTerm } },
        { vcs_contact_person: { contains: searchTerm } },
      ];
    }

    // Fetch all vendors (matching SQL: FROM vend_customer_supplier vcs)
    let vendors;
    try {
      vendors = await prisma.vend_customer_supplier.findMany({
        where: whereClause,
        select: {
          vcs_id: true,
          vcs_vendor_code: true,
          vcs_vendor_name: true,
          vcs_address: true,
          vcs_registration_no: true,
          vcs_reg_date: true,
          vcs_reg_exp_date: true,
          vcs_kk_regno: true,
          vcs_kk_expired_date: true,
          vcs_bumi_status: true,
          vcs_company_category: true,
          vcs_tel_no: true,
          vcs_fax_no: true,
          vcs_contact_person: true,
          vcs_tax_regno: true,
          vcs_iscreditor: true,
          vcs_isdebtor: true,
          vcs_vendor_status: true,
        },
        orderBy: {
          vcs_id: 'desc',
        },
      });
    } catch (dateError) {
      // If error is due to invalid dates, fetch without date fields
      if (dateError.code === 'P2020' && dateError.meta?.details?.includes('datetime')) {
        console.log('Date parsing error detected, fetching without date fields...');
        vendors = await prisma.vend_customer_supplier.findMany({
          where: whereClause,
          select: {
            vcs_id: true,
            vcs_vendor_code: true,
            vcs_vendor_name: true,
            vcs_address: true,
            vcs_registration_no: true,
            vcs_kk_regno: true,
            vcs_bumi_status: true,
            vcs_company_category: true,
            vcs_tel_no: true,
            vcs_fax_no: true,
            vcs_contact_person: true,
            vcs_tax_regno: true,
            vcs_iscreditor: true,
            vcs_isdebtor: true,
            vcs_vendor_status: true,
          },
          orderBy: {
            vcs_id: 'desc',
          },
        });
        // Set date fields to null
        vendors = vendors.map(v => ({
          ...v,
          vcs_reg_date: null,
          vcs_reg_exp_date: null,
          vcs_kk_expired_date: null,
        }));
      } else {
        throw dateError;
      }
    }

    // Get all vendor codes
    const vendorCodes = vendors.map(v => v.vcs_vendor_code).filter(Boolean);

    // Fetch active accounts (matching SQL: LEFT JOIN vend_supplier_account vsa on vcs.vcs_vendor_code = vsa.vcs_vendor_code and vsa.vsa_status = '1')
    const activeAccounts = vendorCodes.length > 0 ? await prisma.vend_supplier_account.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
        vsa_status: '1',
      },
    }) : [];

    // Create a map of vendor code to account (for DISTINCT handling - only first active account per vendor)
    const accountMap = {};
    activeAccounts.forEach(acc => {
      if (!accountMap[acc.vcs_vendor_code]) {
        accountMap[acc.vcs_vendor_code] = acc;
      }
    });

    // Get lookup descriptions (matching SQL subqueries)
    const tarafVendorLookup = await prisma.lookup_details.findMany({
      where: {
        lma_code_name: 'TARAF_VENDOR',
      },
    });

    const vendorStatusLookup = await prisma.lookup_details.findMany({
      where: {
        lma_code_name: 'VENDORSTATUS',
      },
    });

    // Create lookup maps
    const tarafMap = {};
    tarafVendorLookup.forEach(item => {
      tarafMap[item.lde_value] = item.lde_description;
    });

    const statusMap = {};
    vendorStatusLookup.forEach(item => {
      statusMap[item.lde_value] = item.lde_description;
    });

    // Date formatting function (matching SQL DATE_FORMAT)
    const formatDate = (date) => {
      if (!date || date === null) {
        return '';
      }
      
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
          return '';
        }
        
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        
        if (year < 1900 || month === 0 || day === 0) {
          return '';
        }
        
        const dayStr = String(day).padStart(2, '0');
        const monthStr = String(month).padStart(2, '0');
        return `${dayStr}/${monthStr}/${year}`;
      } catch (e) {
        return '';
      }
    };

    // Handle DISTINCT - use Set to track unique vcs_id and vcs_vendor_code combinations
    const seen = new Set();
    const uniqueVendors = vendors.filter(vendor => {
      const key = `${vendor.vcs_id}_${vendor.vcs_vendor_code}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    // Map data to match SQL SELECT output
    const data = uniqueVendors.map((vendor) => {
      const account = accountMap[vendor.vcs_vendor_code];

      return {
        vcs_id: vendor.vcs_id,
        VendorId: vendor.vcs_id,
        VendorCode: vendor.vcs_vendor_code || '',
        VendorName: vendor.vcs_vendor_name || '',
        Address: vendor.vcs_address || '',
        RegistrationNoSSM: vendor.vcs_registration_no || '',
        RegistrationDateSSM: formatDate(vendor.vcs_reg_date),
        RegistrationExpiryDateSSM: formatDate(vendor.vcs_reg_exp_date),
        RegistrationNoMOF: vendor.vcs_kk_regno || '',
        RegistrationExpiryDateMOF: formatDate(vendor.vcs_kk_expired_date),
        vcs_bumi_status: tarafMap[vendor.vcs_bumi_status] || vendor.vcs_bumi_status || '',
        vcs_company_category: vendor.vcs_company_category || '',
        vcs_tel_no: vendor.vcs_tel_no || '',
        vcs_fax_no: vendor.vcs_fax_no || '',
        vcs_contact_person: vendor.vcs_contact_person || '',
        vcs_tax_regno: vendor.vcs_tax_regno || '',
        vcs_iscreditor: vendor.vcs_iscreditor === 'Y' ? 'YES' : 'NO',
        vcs_isdebtor: vendor.vcs_isdebtor === 'Y' ? 'YES' : 'NO',
        vcs_vendor_status: statusMap[vendor.vcs_vendor_status] || vendor.vcs_vendor_status || '',
        vsa_status: account?.vsa_status === '1' ? 'ACTIVE' : '',
        urlEdit: `/purchasing/vendor/edit/${vendor.vcs_id}?vcs_vendor_code=${vendor.vcs_vendor_code}&mode=edit`,
      };
    });

    return {
      statusCode: 200,
      message: "Vendors fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching vendors:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Failed to fetch vendors",
      error: error.message || String(error),
      details: error.stack,
    };
  }
});
