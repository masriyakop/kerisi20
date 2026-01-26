import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Build date filter
    let dateFilter = {};
    if (query.date_start && query.date_end) {
      // Convert DD/MM/YYYY to Date
      const [day, month, year] = query.date_start.split('/');
      const startDate = new Date(`${year}-${month}-${day}`);
      const [day2, month2, year2] = query.date_end.split('/');
      const endDate = new Date(`${year2}-${month2}-${day2}`);
      dateFilter = {
        pom_request_date: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else if (query.date_start) {
      const [day, month, year] = query.date_start.split('/');
      const startDate = new Date(`${year}-${month}-${day}`);
      dateFilter = {
        pom_request_date: {
          gte: startDate,
        },
      };
    } else if (query.date_end) {
      const [day, month, year] = query.date_end.split('/');
      const endDate = new Date(`${year}-${month}-${day}`);
      dateFilter = {
        pom_request_date: {
          lte: endDate,
        },
      };
    }

    // Build where clause for purchase_order_master
    let whereMaster = {};
    
    // Search filter
    if (query.search) {
      const searchTerm = query.search.trim();
      whereMaster.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
      ];
    }

    // Smart filter for PO No
    if (query.smartFilter_pom_order_no) {
      whereMaster.pom_order_no = { contains: query.smartFilter_pom_order_no };
    }

    // Smart filter for Vendor Code
    if (query.smartFilter_vcs_vendor_code) {
      whereMaster.vcs_vendor_code = { contains: query.smartFilter_vcs_vendor_code };
    }

    // Smart filter for PO Status
    if (query.smartFilter_pom_order_status) {
      whereMaster.pom_order_status = query.smartFilter_pom_order_status;
    }

    // Apply date filter
    if (Object.keys(dateFilter).length > 0) {
      whereMaster = { ...whereMaster, ...dateFilter };
    }

    // Fetch purchase orders with relations
    const purchaseOrders = await prisma.purchase_order_master.findMany({
      where: whereMaster,
      include: {
        purchase_order_details: true,
      },
      orderBy: {
        pom_order_id: 'asc',
      },
    });

    // Get all requisition numbers from purchase_order_details
    const requisitionNos = purchaseOrders.flatMap(po => 
      po.purchase_order_details.map(pod => pod.rqm_requisition_no).filter(Boolean)
    );

    // Fetch requisition_master records
    const requisitions = requisitionNos.length > 0 ? await prisma.requisition_master.findMany({
      where: {
        rqm_requisition_no: { in: requisitionNos },
      },
      select: {
        rqm_requisition_id: true,
        rqm_requisition_no: true,
      },
    }) : [];

    // Create a map for requisitions
    const requisitionMap = {};
    requisitions.forEach(req => {
      requisitionMap[req.rqm_requisition_no] = req;
    });

    // Get all vendor codes
    const vendorCodes = purchaseOrders.map(po => po.vcs_vendor_code).filter(Boolean);
    
    // Fetch vendor records
    const vendors = vendorCodes.length > 0 ? await prisma.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true,
      },
    }) : [];

    // Create a map for vendors
    const vendorMap = {};
    vendors.forEach(vendor => {
      vendorMap[vendor.vcs_vendor_code] = vendor;
    });

    // Get all PO numbers and PR numbers for bills lookup
    const poNumbers = purchaseOrders.map(po => po.pom_order_no).filter(Boolean);
    const prNumbers = purchaseOrders.flatMap(po => 
      po.purchase_order_details.map(pod => pod.rqm_requisition_no).filter(Boolean)
    );

    // Fetch bills_master records
    const bills = await prisma.bills_master.findMany({
      where: {
        OR: [
          { pom_order_no: { in: poNumbers } },
          { rqm_requisition_no: { in: prNumbers } },
        ],
      },
      select: {
        bim_bills_no: true,
        pom_order_no: true,
        rqm_requisition_no: true,
      },
    });

    // Create a map for bills lookup
    const billsMap = {};
    bills.forEach(bill => {
      if (bill.pom_order_no) {
        if (!billsMap[bill.pom_order_no]) {
          billsMap[bill.pom_order_no] = [];
        }
        billsMap[bill.pom_order_no].push(bill.bim_bills_no);
      }
      if (bill.rqm_requisition_no) {
        if (!billsMap[bill.rqm_requisition_no]) {
          billsMap[bill.rqm_requisition_no] = [];
        }
        billsMap[bill.rqm_requisition_no].push(bill.bim_bills_no);
      }
    });

    // Filter by PR No if specified
    let filteredOrders = purchaseOrders;
    if (query.smartFilter_rqm_requisition_no) {
      filteredOrders = purchaseOrders.filter(po => 
        po.purchase_order_details.some(pod => 
          pod.rqm_requisition_no?.includes(query.smartFilter_rqm_requisition_no)
        )
      );
    }

    // Flatten the data to match datatable format (one row per purchase_order_detail)
    const data = [];
    filteredOrders.forEach((po) => {
      po.purchase_order_details.forEach((pod) => {
        // Get bills_no from bills_master
        let billsNo = '';
        const poBills = billsMap[po.pom_order_no] || [];
        const prBills = billsMap[pod.rqm_requisition_no] || [];
        billsNo = (poBills[0] || prBills[0] || '');

        // Format request date
        const requestDate = po.pom_request_date 
          ? new Date(po.pom_request_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : '';

        const requisition = requisitionMap[pod.rqm_requisition_no] || null;
        const vendor = vendorMap[po.vcs_vendor_code] || null;

        data.push({
          no: data.length + 1,
          pom_order_id: po.pom_order_id,
          rqm_requisition_id: requisition?.rqm_requisition_id || null,
          'PO No': po.pom_order_no || '',
          'PR': pod.rqm_requisition_no || '',
          'Description': po.pom_description || '',
          'Request Date': requestDate,
          'Item Code': pod.itm_item_code || '',
          'Item Desc': pod.pod_item_spec || '',
          'PO Status': po.pom_order_status || '',
          'Vendor ID': po.vcs_vendor_code || '',
          'Vendor Name': vendor?.vcs_vendor_name || '',
          'Bill No': billsNo,
          'Action': '',
          // Keep original data for actions
          urlViewPO: `/purchasing/view-po/${po.pom_order_id}`,
          urlViewPR: requisition?.rqm_requisition_id 
            ? `/purchasing/view-pr/${requisition.rqm_requisition_id}` 
            : '',
        });
      });
    });

    return {
      statusCode: 200,
      message: 'Status PO & PR fetched successfully',
      data,
    };
  } catch (error) {
    console.error('Error in status-po-pr API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
