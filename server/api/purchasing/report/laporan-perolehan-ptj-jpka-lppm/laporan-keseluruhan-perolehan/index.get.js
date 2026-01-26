import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search;
    const updateddateFromRM = query.updateddateFromRM;
    const updateddateToRM = query.updateddateToRM;
    const updateddateFrom = query.updateddateFrom;
    const updateddateTo = query.updateddateTo;
    const acm_acct_desc = query.acm_acct_desc;
    const rqm_requisition_no = query.rqm_requisition_no;
    const pom_order_no = query.pom_order_no;
    const status = query.status;

    // Build where clause
    let whereClause = {};

    // Apply date filters for PRE
    if (updateddateFromRM || updateddateToRM) {
      // Filter by requisition_master updateddate when status is APPROVE
      // This will be handled in the query logic
    }

    // Apply date filters for POR
    if (updateddateFrom || updateddateTo) {
      // Filter by purchase_order_master updateddate when status is APPROVE
      // This will be handled in the query logic
    }

    // Apply account code filter
    if (acm_acct_desc) {
      whereClause.am_account_code = acm_acct_desc;
    }

    // Apply requisition no filter
    if (rqm_requisition_no) {
      whereClause.rqm_requisition_no = rqm_requisition_no;
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { am_account_code: { contains: searchTerm } },
        { rqm_requisition_no: { contains: searchTerm } },
      ];
    }

    // Try to fetch data
    let data = [];
    try {
      // Fetch purchase_order_details with joins
      const podList = await prisma.purchase_order_details.findMany({
        where: whereClause,
        include: {
          purchase_order_master: {
            include: {
              vend_customer_supplier: {
                select: {
                  vcs_bumi_status: true,
                },
              },
            },
          },
          requisition_master: {
            select: {
              rqm_requisition_no: true,
              rqm_requisition_title: true,
              rqm_status: true,
              updateddate: true,
            },
          },
          account_main: {
            select: {
              acm_acct_code: true,
              acm_acct_parent: true,
            },
          },
        },
        take: 1000,
      });

      // Get account parent descriptions
      const accountParents = [...new Set(podList.map(pod => pod.account_main?.acm_acct_parent).filter(Boolean))];
      const accountMainList = accountParents.length > 0 ? await prisma.account_main.findMany({
        where: { acm_acct_code: { in: accountParents } },
        select: {
          acm_acct_code: true,
          acm_acct_desc: true,
        },
      }) : [];

      const accountMap = new Map(accountMainList.map(am => [am.acm_acct_code, am]));

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

      // Group by account parent
      let groupedData = new Map();
      
      podList.forEach(pod => {
        const accountParent = pod.account_main?.acm_acct_parent || '';
        const accountDesc = accountMap.get(accountParent)?.acm_acct_desc || '';
        const vendorStatus = pod.purchase_order_master?.vend_customer_supplier?.vcs_bumi_status || '';
        const statusDesc = statusMap.get(vendorStatus) || '';
        const pomStatus = pod.purchase_order_master?.pom_order_status || '';
        const rqmStatus = pod.requisition_master?.rqm_status || '';
        const rqdId = pod.rqd_requisition_id || '';

        const key = `${accountParent}_${statusDesc}_${pomStatus}_${rqmStatus}_${rqdId}`;
        
        if (!groupedData.has(key)) {
          groupedData.set(key, {
            rqd_requisition_id: rqdId,
            acm_acct_parent: accountParent,
            acm_desc: accountDesc,
            vcs_bumi_status: statusDesc,
            pom_order_status: pomStatus,
            rqm_status: rqmStatus,
            rqm_requisition_no: [],
            pom_order_no: [],
            pod_total_amt: 0,
            pom_order_id: 0,
            pom_order_amt: 0,
            billPR: 0,
          });
        }

        const group = groupedData.get(key);
        if (pod.rqm_requisition_no && !group.rqm_requisition_no.includes(pod.rqm_requisition_no)) {
          group.rqm_requisition_no.push(pod.rqm_requisition_no);
        }
        if (pod.purchase_order_master?.pom_order_no && !group.pom_order_no.includes(pod.purchase_order_master.pom_order_no)) {
          group.pom_order_no.push(pod.purchase_order_master.pom_order_no);
        }
        group.pod_total_amt += parseFloat(pod.pod_total_amt?.toString() || '0');
        group.pom_order_amt += parseFloat(pod.purchase_order_master?.pom_order_amt?.toString() || '0');
        group.pom_order_id += 1;
        if (pod.rqm_requisition_no) {
          group.billPR += 1;
        }
      });

      // Filter by pom_order_no if provided
      if (pom_order_no) {
        const filteredGrouped = new Map();
        groupedData.forEach((item, key) => {
          if (item.pom_order_no.includes(pom_order_no)) {
            filteredGrouped.set(key, item);
          }
        });
        groupedData = filteredGrouped;
      }

      // Format data
      data = Array.from(groupedData.values()).map((item, index) => ({
        no: index + 1,
        rqd_requisition_id: item.rqd_requisition_id,
        "Kod Akaun": item.acm_acct_parent,
        "Jenis Perbelanjaan": item.acm_desc,
        "No PRE": item.rqm_requisition_no.join(','),
        "Bill PRE": item.billPR,
        "Amaun  PRE (RM)": item.pom_order_amt,
        "Status PRE": item.rqm_status,
        "No POR": item.pom_order_no.join(','),
        "Bill POR": item.pom_order_id,
        "Amaun POR (RM)": item.pod_total_amt,
        "Status POR": item.pom_order_status,
        "Status Pembekal": item.vcs_bumi_status,
      }));
    } catch (tableError) {
      console.log("Error fetching data:", tableError.message);
      return {
        statusCode: 200,
        message: "Laporan Keseluruhan Perolehan data fetched successfully",
        data: [],
        recordsFiltered: 0,
        footer: {
          pod_total_amt: 0,
          pom_order_id: 0,
          rqm_requisition_no: 0,
          pom_order_amt: 0,
        },
      };
    }

    // Calculate footer totals
    const footer = {
      pod_total_amt: data.reduce((sum, item) => sum + (parseFloat(item["Amaun POR (RM)"]?.toString() || '0')), 0),
      pom_order_id: data.reduce((sum, item) => sum + (parseInt(item["Bill POR"]?.toString() || '0')), 0),
      rqm_requisition_no: data.reduce((sum, item) => sum + (parseInt(item["Bill PRE"]?.toString() || '0')), 0),
      pom_order_amt: data.reduce((sum, item) => sum + (parseFloat(item["Amaun  PRE (RM)"]?.toString() || '0')), 0),
    };

    return {
      statusCode: 200,
      message: "Laporan Keseluruhan Perolehan data fetched successfully",
      data: data,
      recordsFiltered: data.length,
      footer: footer,
    };
  } catch (error) {
    console.error("Error fetching Laporan Keseluruhan Perolehan:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Laporan Keseluruhan Perolehan data",
      error: error.message,
    };
  }
});
