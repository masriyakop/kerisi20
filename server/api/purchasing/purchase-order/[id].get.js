import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id'));
    
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: null,
      };
    }
    
    // Fetch purchase order master with related details
    const purchaseOrder = await prisma.purchase_order_master.findUnique({
      where: {
        pom_order_id: id,
      },
      include: {
        purchase_order_details: {
          orderBy: {
            pod_line_no: 'asc',
          },
        },
      },
    });
    
    if (!purchaseOrder) {
      return {
        statusCode: 404,
        message: "Purchase order not found",
        data: null,
      };
    }
    
    // Format the response
    const formattedData = {
      pom_order_id: purchaseOrder.pom_order_id,
      pom_order_no: purchaseOrder.pom_order_no || '',
      pom_requisition_no: purchaseOrder.pom_requisition_no || '',
      pom_retrieve_type: purchaseOrder.pom_retrieve_type || '',
      org_code: purchaseOrder.org_code || '',
      vcs_vendor_code: purchaseOrder.vcs_vendor_code || '',
      pom_deliver_address: purchaseOrder.pom_address || '',
      pom_request_by: purchaseOrder.pom_request_by || '',
      pom_estimate_delivery_date: purchaseOrder.pom_available_date ? purchaseOrder.pom_available_date.toISOString().split('T')[0] : '',
      pom_request_date: purchaseOrder.pom_request_date ? purchaseOrder.pom_request_date.toISOString().split('T')[0] : '',
      pom_document_no: purchaseOrder.pom_ref_doc || '',
      pom_description: purchaseOrder.pom_description || '',
      pom_document_received_date: purchaseOrder.pom_doc_receive_date ? purchaseOrder.pom_doc_receive_date.toISOString().split('T')[0] : '',
      pom_purchase_method: purchaseOrder.pom_method || '',
      pom_purchase_type: purchaseOrder.pom_order_type || '',
      pom_contact_person: purchaseOrder.pom_contact_person || '',
      pom_order_status: purchaseOrder.pom_order_status || 'DRAFT',
      pom_total_amount: purchaseOrder.pom_order_amt_rm ? parseFloat(purchaseOrder.pom_order_amt_rm.toString()) : 0,
      pom_discount_amount: purchaseOrder.pom_discount_amt ? parseFloat(purchaseOrder.pom_discount_amt.toString()) : 0,
      pom_gross_amt: purchaseOrder.pom_gross_amt ? parseFloat(purchaseOrder.pom_gross_amt.toString()) : 0,
      pom_order_amt: purchaseOrder.pom_order_amt ? parseFloat(purchaseOrder.pom_order_amt.toString()) : 0,
      pom_total_paid: purchaseOrder.pom_total_paid ? parseFloat(purchaseOrder.pom_total_paid.toString()) : 0,
      pom_total_invoiced: purchaseOrder.pom_total_invoiced ? parseFloat(purchaseOrder.pom_total_invoiced.toString()) : 0,
      pom_total_tax: purchaseOrder.pom_total_tax ? parseFloat(purchaseOrder.pom_total_tax.toString()) : 0,
      pom_currency_unit: purchaseOrder.pom_currency_unit ? parseFloat(purchaseOrder.pom_currency_unit.toString()) : 0,
      pom_currency_code: purchaseOrder.pom_currency_code || '',
      pom_conversion_rate: purchaseOrder.pom_conversion_rate ? parseFloat(purchaseOrder.pom_conversion_rate.toString()) : 0,
      pom_rate_type: purchaseOrder.pom_rate_type || '',
      pom_rate_date: purchaseOrder.pom_rate_date ? purchaseOrder.pom_rate_date.toISOString().split('T')[0] : '',
      pom_ent_amt: purchaseOrder.pom_ent_amt ? parseFloat(purchaseOrder.pom_ent_amt.toString()) : 0,
      pom_exchange_type_code: purchaseOrder.pom_exchange_type_code || '',
      pom_shipto_id: purchaseOrder.pom_shipto_id || null,
      pom_aggrement_no: purchaseOrder.pom_aggrement_no || '',
      pom_order_ref: purchaseOrder.pom_order_ref || '',
      cpa_project_no: purchaseOrder.cpa_project_no || '',
      pom_wflow_sts: purchaseOrder.pom_wflow_sts || '',
      pom_wflow_type: purchaseOrder.pom_wflow_type || '',
      pom_approve_by: purchaseOrder.pom_approve_by || '',
      pom_approve_date: purchaseOrder.pom_approve_date ? purchaseOrder.pom_approve_date.toISOString().split('T')[0] : '',
      pom_verify_by: purchaseOrder.pom_verify_by || '',
      pom_verify_date: purchaseOrder.pom_verify_date ? purchaseOrder.pom_verify_date.toISOString().split('T')[0] : '',
      pom_cancel_by: purchaseOrder.pom_cancel_by || '',
      pom_cancel_date: purchaseOrder.pom_cancel_date ? purchaseOrder.pom_cancel_date.toISOString().split('T')[0] : '',
      pom_cancel_remark: purchaseOrder.pom_cancel_remark || '',
      // Details
      purchase_order_details: purchaseOrder.purchase_order_details.map((detail) => ({
        pod_order_detl_id: detail.pod_order_detl_id,
        pod_line_no: detail.pod_line_no ? parseFloat(detail.pod_line_no.toString()) : 0,
        rqm_requisition_no: detail.rqm_requisition_no || '',
        bdg_budget_code: detail.bdg_budget_code || '',
        am_account_code: detail.am_account_code || '',
        itm_item_code: detail.itm_item_code || '',
        oun_code: detail.oun_code || '',
        pod_order_qty: detail.pod_order_qty ? parseFloat(detail.pod_order_qty.toString()) : 0,
        pod_unit_price: detail.pod_unit_price ? parseFloat(detail.pod_unit_price.toString()) : 0,
        pod_gross_amt: detail.pod_gross_amt ? parseFloat(detail.pod_gross_amt.toString()) : 0,
        pod_discount: detail.pod_discount ? parseFloat(detail.pod_discount.toString()) : 0,
        pod_total_amt: detail.pod_total_amt ? parseFloat(detail.pod_total_amt.toString()) : 0,
        pod_total_invoiced: detail.pod_total_invoiced ? parseFloat(detail.pod_total_invoiced.toString()) : 0,
        pod_total_paid: detail.pod_total_paid ? parseFloat(detail.pod_total_paid.toString()) : 0,
        pod_item_spec: detail.pod_item_spec || '',
        pod_status: detail.pod_status || '',
        pod_request_no: detail.pod_request_no || '',
        pod_received_qty: detail.pod_received_qty ? parseFloat(detail.pod_received_qty.toString()) : 0,
        pod_uom: detail.pod_uom || '',
        pod_crnote_amt: detail.pod_crnote_amt ? parseFloat(detail.pod_crnote_amt.toString()) : 0,
        pod_lib_seq: detail.pod_lib_seq || '',
        so_code: detail.so_code || '',
        cpa_project_no: detail.cpa_project_no || '',
        pod_pakej_no: detail.pod_pakej_no ? parseFloat(detail.pod_pakej_no.toString()) : 0,
        itm_item_no: detail.itm_item_no ? parseFloat(detail.itm_item_no.toString()) : 0,
        pod_brand: detail.pod_brand || '',
        cny_country_code: detail.cny_country_code || '',
        pod_taxcode: detail.pod_taxcode || '',
        pod_taxpct: detail.pod_taxpct ? parseFloat(detail.pod_taxpct.toString()) : 0,
        pod_taxamt: detail.pod_taxamt ? parseFloat(detail.pod_taxamt.toString()) : 0,
        ccr_costcentre: detail.ccr_costcentre || '',
        pod_ccr_costcentre_budget: detail.pod_ccr_costcentre_budget || '',
        fty_fund_type: detail.fty_fund_type || '',
        at_activity_code: detail.at_activity_code || '',
        pod_at_activity_code_budget: detail.pod_at_activity_code_budget || '',
        sbg_budget_id: detail.sbg_budget_id || null,
        pod_ent_amt: detail.pod_ent_amt ? parseFloat(detail.pod_ent_amt.toString()) : 0,
        pod_total_amtrm: detail.pod_total_amtrm ? parseFloat(detail.pod_total_amtrm.toString()) : 0,
        pod_req_no: detail.pod_req_no || '',
        rqd_requisition_id: detail.rqd_requisition_id || null,
        pod_flag_manual: detail.pod_flag_manual || '',
        pod_cn_amount_ent: detail.pod_cn_amount_ent ? parseFloat(detail.pod_cn_amount_ent.toString()) : 0,
        pod_cn_amount: detail.pod_cn_amount ? parseFloat(detail.pod_cn_amount.toString()) : 0,
      })),
    };
    
    return {
      statusCode: 200,
      message: "Purchase order fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching purchase order:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase order",
      error: error.message,
    };
  }
});
