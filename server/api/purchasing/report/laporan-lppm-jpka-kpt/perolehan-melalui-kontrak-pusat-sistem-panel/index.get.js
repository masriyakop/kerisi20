import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search;
    const updateddateFromRM = query.updateddateFromRM;
    const updateddateToRM = query.updateddateToRM;
    const updateddateFrom = query.updateddateFrom;
    const updateddateTo = query.updateddateTo;
    const vendorName = query.vendorName;
    const status = query.status;
    const oun_code = query.oun_code;

    // Build where clause
    let whereClause = {};

    // Apply OU code filter
    if (oun_code) {
      whereClause.oun_code = oun_code;
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_agg_no: { contains: searchTerm } },
      ];
    }

    // Try to fetch data
    let data = [];
    try {
      // First fetch all purchase_order_details
      let podList = await prisma.purchase_order_details.findMany({
        where: whereClause,
        include: {
          purchase_order_master: {
            include: {
              vend_customer_supplier: {
                select: {
                  vcs_vendor_name: true,
                  vcs_bumi_status: true,
                  vcs_addr1: true,
                  vcs_addr2: true,
                  vcs_addr3: true,
                },
              },
            },
          },
          requisition_master: {
            select: {
              rqm_requisition_no: true,
              rqm_requisition_title: true,
              rqm_status: true,
              rqm_tender_type: true,
              rqm_agg_no: true,
              updateddate: true,
            },
          },
          item_main: {
            select: {
              itm_item_code: true,
              itm_item_desc: true,
            },
          },
        },
        take: 1000,
      });

      // Filter by vendor name and status if provided
      if (vendorName || status) {
        podList = podList.filter(pod => {
          const vendor = pod.purchase_order_master?.vend_customer_supplier;
          if (!vendor) return false;
          if (vendorName && vendor.vcs_vendor_name !== vendorName) return false;
          if (status && vendor.vcs_bumi_status !== status) return false;
          return true;
        });
      }

      // Apply search filter on fetched data
      if (search) {
        const searchTerm = search.toLowerCase().trim();
        podList = podList.filter(pod => {
          const searchableFields = [
            pod.purchase_order_master?.pom_order_no,
            pod.purchase_order_master?.pom_description,
            pod.purchase_order_master?.vend_customer_supplier?.vcs_vendor_name,
            pod.requisition_master?.rqm_tender_type,
          ].filter(Boolean).map(f => f.toString().toLowerCase());

          return searchableFields.some(field => field.includes(searchTerm));
        });
      }

      // Get vendor status descriptions
      const vendorStatuses = [...new Set(podList.map(pod => pod.purchase_order_master?.vend_customer_supplier?.vcs_bumi_status).filter(Boolean))];
      const lookupDetails = vendorStatuses.length > 0 ? await prisma.lookup_details.findMany({
        where: {
          lma_code_name: 'TARAF_VENDOR',
          lde_value: { in: vendorStatuses },
        },
        select: {
          lde_value: true,
          lde_description: true,
        },
      }) : [];

      const statusMap = new Map(lookupDetails.map(ld => [ld.lde_value, ld.lde_description]));

      // Format date helper
      const formatDate = (date) => {
        if (!date) return '';
        try {
          const d = new Date(date);
          return d.toLocaleDateString('en-GB');
        } catch {
          return '';
        }
      };

      // Format data
      data = podList.map((pod, index) => {
        const vendor = pod.purchase_order_master?.vend_customer_supplier;
        const vendorStatus = vendor?.vcs_bumi_status || '';
        const statusDesc = statusMap.get(vendorStatus) || '';
        const address = [vendor?.vcs_addr1, vendor?.vcs_addr2, vendor?.vcs_addr3].filter(Boolean).join(',');
        const item = pod.item_main ? `${pod.item_main.itm_item_code}-${pod.item_main.itm_item_desc}` : '';

        return {
          no: index + 1,
          "Item Kontrak": item,
          "No.Rujukan PRE": pod.rqm_requisition_no || '',
          "Tarikh Kelulusan PRE": formatDate(pod.requisition_master?.updateddate),
          "Perkara PRE": pod.requisition_master?.rqm_requisition_title || '',
          "Status Pembekal": statusDesc,
          "Jenis Pembelian": pod.requisition_master?.rqm_tender_type || '',
          "No. Perjanjian": pod.requisition_master?.rqm_agg_no || '',
          "Status PRE": pod.requisition_master?.rqm_status || '',
          "No.Rujukan POR": pod.purchase_order_master?.pom_order_no || '',
          "Tarikh Kelulusan POR": formatDate(pod.updateddate || pod.createddate),
          "Perkara POR": pod.purchase_order_master?.pom_description || '',
          "Amaun POR (RM)": pod.pod_total_amt ? parseFloat(pod.pod_total_amt.toString()) : 0,
          "Status POR": pod.purchase_order_master?.pom_order_status || '',
          "Nama Pembekal": vendor?.vcs_vendor_name || '',
          "Alamat Pembekal": address,
          "Amaun PRE (RM)": pod.purchase_order_master?.pom_order_amt ? parseFloat(pod.purchase_order_master.pom_order_amt.toString()) : 0,
          PTJ: pod.oun_code || '',
        };
      });
    } catch (tableError) {
      console.log("Error fetching data:", tableError.message);
      return {
        statusCode: 200,
        message: "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel data fetched successfully",
        data: [],
        recordsFiltered: 0,
        footer: {
          pom_order_amt: 0,
          pod_total_amt: 0,
        },
      };
    }

    // Calculate footer totals
    const footer = {
      pom_order_amt: data.reduce((sum, item) => sum + (parseFloat(item["Amaun PRE (RM)"]?.toString() || '0')), 0),
      pod_total_amt: data.reduce((sum, item) => sum + (parseFloat(item["Amaun POR (RM)"]?.toString() || '0')), 0),
    };

    return {
      statusCode: 200,
      message: "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel data fetched successfully",
      data: data,
      recordsFiltered: data.length,
      footer: footer,
    };
  } catch (error) {
    console.error("Error fetching Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel data",
      error: error.message,
    };
  }
});
