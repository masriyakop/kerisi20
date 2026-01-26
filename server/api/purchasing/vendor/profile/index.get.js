import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    // Search filter - matches SQL CONCAT_WS pattern
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { vcs_vendor_code: { contains: searchTerm } },
        { vcs_vendor_name: { contains: searchTerm } },
        { vcs_registration_no: { contains: searchTerm } },
        { vcs_kk_regno: { contains: searchTerm } },
        { vcs_contact_person: { contains: searchTerm } },
      ];
    }

    // Smart filter - Status
    if (query.smartFilter_Status) {
      whereClause.vcs_vendor_status = query.smartFilter_Status;
    }

    // Use Prisma ORM to fetch vendors
    // We'll use select to get all fields, and handle date formatting in JavaScript
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
          vcs_unv_reg_date: true,
          vcs_unv_req_exp_date: true,
          vcs_bumi_status: true,
          vcs_company_category: true,
          vcs_authorize_capital: true,
          vcs_paid_up_capital: true,
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
      // If error is due to invalid dates, fetch without date fields and handle separately
      if (dateError.code === 'P2020' && dateError.meta?.details?.includes('datetime')) {
        console.log('Date parsing error detected, fetching without date fields...');
        // Fetch without problematic date fields first
        vendors = await prisma.vend_customer_supplier.findMany({
          where: whereClause,
          select: {
            vcs_id: true,
            vcs_vendor_code: true,
            vcs_vendor_name: true,
            vcs_address: true,
            vcs_registration_no: true,
            // Skip date fields that cause errors
            vcs_kk_regno: true,
            vcs_bumi_status: true,
            vcs_company_category: true,
            vcs_authorize_capital: true,
            vcs_paid_up_capital: true,
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
        // Set date fields to null since we couldn't fetch them
        vendors = vendors.map(v => ({
          ...v,
          vcs_reg_date: null,
          vcs_reg_exp_date: null,
          vcs_kk_expired_date: null,
          vcs_unv_reg_date: null,
          vcs_unv_req_exp_date: null,
        }));
      } else {
        throw dateError;
      }
    }
    
    console.log('Vendors query result:', vendors ? vendors.length : 0);

    // Get all vendor codes
    const vendorCodes = vendors.map(v => v.vcs_vendor_code).filter(Boolean);

    // Fetch active accounts (matching SQL: LEFT JOIN vend_supplier_account vsa on vcs.vcs_vendor_code = vsa.vcs_vendor_code and vsa.vsa_status = '1')
    const activeAccounts = vendorCodes.length > 0 ? await prisma.vend_supplier_account.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
        vsa_status: '1',
      },
    }) : [];

    // Create a map of vendor code to account (for DISTINCT handling)
    const accountMap = {};
    activeAccounts.forEach(acc => {
      // Only keep the first active account per vendor (for DISTINCT)
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

    // Date formatting function - handles Date objects and invalid dates
    const formatDate = (date) => {
      if (!date || date === null) {
        return '';
      }
      
      // If it's already a string in dd/mm/yyyy format, return as is
      if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        return date;
      }
      
      try {
        const d = new Date(date);
        // Check if date is valid
        if (isNaN(d.getTime())) {
          return '';
        }
        
        // Check for invalid dates (year 1900 or before, or invalid month/day)
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

    // Map data to match SQL SELECT output
    // MySQL returns field names as defined in SELECT (lowercase in our case)
    const data = vendors.map((vendor) => {
        const vcsId = vendor.vcs_id;
        const vcsVendorCode = vendor.vcs_vendor_code || '';
        const account = accountMap[vcsVendorCode];

        return {
          vcs_id: vcsId,
          vcs_vendor_code: vcsVendorCode,
          vcs_vendor_name: vendor.vcs_vendor_name || '',
          vcs_address: vendor.vcs_address || '',
          vcs_registration_no: vendor.vcs_registration_no || '',
          vcs_reg_date: formatDate(vendor.vcs_reg_date),
          vcs_reg_exp_date: formatDate(vendor.vcs_reg_exp_date),
          vcs_kk_regno: vendor.vcs_kk_regno || '',
          vcs_kk_expired_date: formatDate(vendor.vcs_kk_expired_date),
          vcs_unv_reg_date: formatDate(vendor.vcs_unv_reg_date),
          vcs_unv_req_exp_date: formatDate(vendor.vcs_unv_req_exp_date),
          vcs_bumi_status: tarafMap[vendor.vcs_bumi_status] || vendor.vcs_bumi_status || '',
          vcs_company_category: vendor.vcs_company_category || '',
          vcs_authorize_capital: vendor.vcs_authorize_capital ? Number(vendor.vcs_authorize_capital) : null,
          vcs_paid_up_capital: vendor.vcs_paid_up_capital ? Number(vendor.vcs_paid_up_capital) : null,
          vcs_tel_no: vendor.vcs_tel_no || '',
          vcs_fax_no: vendor.vcs_fax_no || '',
          vcs_contact_person: vendor.vcs_contact_person || '',
          vcs_tax_regno: vendor.vcs_tax_regno || '',
          vcs_iscreditor: vendor.vcs_iscreditor === 'Y' ? 'YES' : 'NO',
          vcs_isdebtor: vendor.vcs_isdebtor === 'Y' ? 'YES' : 'NO',
          vcs_vendor_status: statusMap[vendor.vcs_vendor_status] || vendor.vcs_vendor_status || '',
          vsa_status: account?.vsa_status === '1' ? 'ACTIVE' : '',
          urlEdit: `/purchasing/vendor/edit/${vcsId}?vcs_vendor_code=${vcsVendorCode}&mode=edit`,
          urlView: `/purchasing/vendor/edit/${vcsId}?vcs_vendor_code=${vcsVendorCode}&mode=view`,
        };
      });

    // Debug logging
    console.log('Vendors found:', vendors.length);
    console.log('Data mapped:', data.length);
    if (data.length > 0) {
      console.log('First item:', JSON.stringify(data[0], null, 2));
    }

    return {
      statusCode: 200,
      message: "Vendor profile list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching vendor profile list:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Failed to fetch vendor profile list",
      error: error.message || String(error),
      details: error.stack,
    };
  }
});
