import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id'));
    const body = await readBody(event);
    
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: null,
      };
    }
    
    // Check if purchase order exists
    const existingPO = await prisma.purchase_order_master.findUnique({
      where: {
        pom_order_id: id,
      },
    });
    
    if (!existingPO) {
      return {
        statusCode: 404,
        message: "Purchase order not found",
        data: null,
      };
    }
    
    // Get the current user from session (adjust based on your auth implementation)
    const user = event.context.user || { username: 'system' };
    
    // Update purchase order master
    const purchaseOrder = await prisma.purchase_order_master.update({
      where: {
        pom_order_id: id,
      },
      data: {
        pom_requisition_no: body.pom_requisition_no !== undefined ? body.pom_requisition_no : existingPO.pom_requisition_no,
        pom_retrieve_type: body.pom_retrieve_type !== undefined ? body.pom_retrieve_type : existingPO.pom_retrieve_type,
        org_code: body.org_code !== undefined ? body.org_code : existingPO.org_code,
        vcs_vendor_code: body.vcs_vendor_code !== undefined ? body.vcs_vendor_code : existingPO.vcs_vendor_code,
        pom_address: body.pom_deliver_address !== undefined ? body.pom_deliver_address : existingPO.pom_address,
        pom_request_by: body.pom_request_by !== undefined ? body.pom_request_by : existingPO.pom_request_by,
        pom_request_date: body.pom_request_date !== undefined ? (body.pom_request_date ? new Date(body.pom_request_date) : null) : existingPO.pom_request_date,
        pom_available_date: body.pom_estimate_delivery_date !== undefined ? (body.pom_estimate_delivery_date ? new Date(body.pom_estimate_delivery_date) : null) : existingPO.pom_available_date,
        pom_ref_doc: body.pom_document_no !== undefined ? body.pom_document_no : existingPO.pom_ref_doc,
        pom_description: body.pom_description !== undefined ? body.pom_description : existingPO.pom_description,
        pom_doc_receive_date: body.pom_document_received_date !== undefined ? (body.pom_document_received_date ? new Date(body.pom_document_received_date) : null) : existingPO.pom_doc_receive_date,
        pom_method: body.pom_purchase_method !== undefined ? body.pom_purchase_method : existingPO.pom_method,
        pom_order_type: body.pom_purchase_type !== undefined ? body.pom_purchase_type : existingPO.pom_order_type,
        pom_contact_person: body.pom_contact_person !== undefined ? body.pom_contact_person : existingPO.pom_contact_person,
        pom_order_status: body.pom_order_status !== undefined ? body.pom_order_status : existingPO.pom_order_status,
        pom_order_amt_rm: body.pom_total_amount !== undefined ? (body.pom_total_amount ? parseFloat(body.pom_total_amount) : null) : existingPO.pom_order_amt_rm,
        pom_discount_amt: body.pom_discount_amount !== undefined ? (body.pom_discount_amount ? parseFloat(body.pom_discount_amount) : null) : existingPO.pom_discount_amt,
        pom_gross_amt: body.pom_gross_amt !== undefined ? (body.pom_gross_amt ? parseFloat(body.pom_gross_amt) : null) : existingPO.pom_gross_amt,
        pom_order_amt: body.pom_order_amt !== undefined ? (body.pom_order_amt ? parseFloat(body.pom_order_amt) : null) : existingPO.pom_order_amt,
        pom_total_paid: body.pom_total_paid !== undefined ? (body.pom_total_paid ? parseFloat(body.pom_total_paid) : null) : existingPO.pom_total_paid,
        pom_total_invoiced: body.pom_total_invoiced !== undefined ? (body.pom_total_invoiced ? parseFloat(body.pom_total_invoiced) : null) : existingPO.pom_total_invoiced,
        pom_total_tax: body.pom_total_tax !== undefined ? (body.pom_total_tax ? parseFloat(body.pom_total_tax) : null) : existingPO.pom_total_tax,
        pom_currency_unit: body.pom_currency_unit !== undefined ? (body.pom_currency_unit ? parseFloat(body.pom_currency_unit) : null) : existingPO.pom_currency_unit,
        pom_currency_code: body.pom_currency_code !== undefined ? body.pom_currency_code : existingPO.pom_currency_code,
        pom_conversion_rate: body.pom_conversion_rate !== undefined ? (body.pom_conversion_rate ? parseFloat(body.pom_conversion_rate) : null) : existingPO.pom_conversion_rate,
        pom_rate_type: body.pom_rate_type !== undefined ? body.pom_rate_type : existingPO.pom_rate_type,
        pom_rate_date: body.pom_rate_date !== undefined ? (body.pom_rate_date ? new Date(body.pom_rate_date) : null) : existingPO.pom_rate_date,
        pom_ent_amt: body.pom_ent_amt !== undefined ? (body.pom_ent_amt ? parseFloat(body.pom_ent_amt) : null) : existingPO.pom_ent_amt,
        pom_exchange_type_code: body.pom_exchange_type_code !== undefined ? body.pom_exchange_type_code : existingPO.pom_exchange_type_code,
        pom_shipto_id: body.pom_shipto_id !== undefined ? body.pom_shipto_id : existingPO.pom_shipto_id,
        pom_aggrement_no: body.pom_aggrement_no !== undefined ? body.pom_aggrement_no : existingPO.pom_aggrement_no,
        pom_order_ref: body.pom_order_ref !== undefined ? body.pom_order_ref : existingPO.pom_order_ref,
        cpa_project_no: body.cpa_project_no !== undefined ? body.cpa_project_no : existingPO.cpa_project_no,
        pom_wflow_sts: body.pom_wflow_sts !== undefined ? body.pom_wflow_sts : existingPO.pom_wflow_sts,
        pom_wflow_type: body.pom_wflow_type !== undefined ? body.pom_wflow_type : existingPO.pom_wflow_type,
        updatedby: user.username || 'system',
        updateddate: new Date(),
      },
    });
    
    // Update purchase order details if provided
    if (body.purchase_order_details && Array.isArray(body.purchase_order_details)) {
      // Delete existing details
      await prisma.purchase_order_details.deleteMany({
        where: {
          pom_order_id: id,
        },
      });
      
      // Create new details if provided
      if (body.purchase_order_details.length > 0) {
        const detailsData = body.purchase_order_details.map((detail) => ({
          pom_order_id: id,
          rqm_requisition_no: detail.rqm_requisition_no || null,
          bdg_budget_code: detail.bdg_budget_code || '',
          am_account_code: detail.am_account_code || '',
          pod_line_no: detail.pod_line_no ? parseFloat(detail.pod_line_no) : 0,
          itm_item_code: detail.itm_item_code || null,
          oun_code: detail.oun_code || null,
          pod_order_qty: detail.pod_order_qty ? parseFloat(detail.pod_order_qty) : null,
          pod_unit_price: detail.pod_unit_price ? parseFloat(detail.pod_unit_price) : null,
          pod_gross_amt: detail.pod_gross_amt ? parseFloat(detail.pod_gross_amt) : null,
          pod_discount: detail.pod_discount ? parseFloat(detail.pod_discount) : null,
          pod_total_amt: detail.pod_total_amt ? parseFloat(detail.pod_total_amt) : null,
          pod_total_invoiced: detail.pod_total_invoiced ? parseFloat(detail.pod_total_invoiced) : null,
          pod_total_paid: detail.pod_total_paid ? parseFloat(detail.pod_total_paid) : null,
          pod_item_spec: detail.pod_item_spec || null,
          pod_status: detail.pod_status || null,
          pod_request_no: detail.pod_request_no || null,
          pod_received_qty: detail.pod_received_qty ? parseFloat(detail.pod_received_qty) : null,
          pod_uom: detail.pod_uom || null,
          pod_crnote_amt: detail.pod_crnote_amt ? parseFloat(detail.pod_crnote_amt) : null,
          pod_lib_seq: detail.pod_lib_seq || null,
          so_code: detail.so_code || null,
          cpa_project_no: detail.cpa_project_no || null,
          pod_pakej_no: detail.pod_pakej_no ? parseFloat(detail.pod_pakej_no) : null,
          itm_item_no: detail.itm_item_no ? parseFloat(detail.itm_item_no) : null,
          pod_brand: detail.pod_brand || null,
          cny_country_code: detail.cny_country_code || null,
          pod_taxcode: detail.pod_taxcode || null,
          pod_taxpct: detail.pod_taxpct ? parseFloat(detail.pod_taxpct) : null,
          pod_taxamt: detail.pod_taxamt ? parseFloat(detail.pod_taxamt) : null,
          ccr_costcentre: detail.ccr_costcentre || null,
          pod_ccr_costcentre_budget: detail.pod_ccr_costcentre_budget || null,
          fty_fund_type: detail.fty_fund_type || null,
          at_activity_code: detail.at_activity_code || null,
          pod_at_activity_code_budget: detail.pod_at_activity_code_budget || null,
          sbg_budget_id: detail.sbg_budget_id || null,
          pod_ent_amt: detail.pod_ent_amt ? parseFloat(detail.pod_ent_amt) : null,
          pod_total_amtrm: detail.pod_total_amtrm ? parseFloat(detail.pod_total_amtrm) : null,
          pod_req_no: detail.pod_req_no || null,
          rqd_requisition_id: detail.rqd_requisition_id || null,
          pod_flag_manual: detail.pod_flag_manual || null,
          pod_cn_amount_ent: detail.pod_cn_amount_ent ? parseFloat(detail.pod_cn_amount_ent) : null,
          pod_cn_amount: detail.pod_cn_amount ? parseFloat(detail.pod_cn_amount) : null,
          createdby: user.username || 'system',
          updatedby: user.username || 'system',
        }));
        
        await prisma.purchase_order_details.createMany({
          data: detailsData,
        });
      }
    }
    
    return {
      statusCode: 200,
      message: "Purchase order updated successfully",
      data: {
        pom_order_id: purchaseOrder.pom_order_id,
        pom_order_no: purchaseOrder.pom_order_no,
      },
    };
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return {
      statusCode: 500,
      message: "Failed to update purchase order",
      error: error.message,
    };
  }
});
