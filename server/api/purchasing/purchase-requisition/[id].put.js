import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id'));
    const body = await readBody(event);
    
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid requisition ID",
        data: null,
      };
    }
    
    // Check if requisition exists
    const existingRequisition = await prisma.requisition_master.findUnique({
      where: {
        rqm_requisition_id: id,
      },
    });
    
    if (!existingRequisition) {
      return {
        statusCode: 404,
        message: "Requisition not found",
        data: null,
      };
    }
    
    // Get the current user from session (adjust based on your auth implementation)
    const user = event.context.user || { username: 'system' };
    
    // Update requisition master
    const requisition = await prisma.requisition_master.update({
      where: {
        rqm_requisition_id: id,
      },
      data: {
        org_code: body.org_code !== undefined ? body.org_code : existingRequisition.org_code,
        oun_code: body.oun_code !== undefined ? body.oun_code : existingRequisition.oun_code,
        fty_fund_type: body.fty_fund_type !== undefined ? body.fty_fund_type : existingRequisition.fty_fund_type,
        ccr_costcentre: body.ccr_costcentre !== undefined ? body.ccr_costcentre : existingRequisition.ccr_costcentre,
        at_activity_code: body.at_activity_code !== undefined ? body.at_activity_code : existingRequisition.at_activity_code,
        so_code: body.so_code !== undefined ? body.so_code : existingRequisition.so_code,
        cpa_project_no: body.cpa_project_no !== undefined ? body.cpa_project_no : existingRequisition.cpa_project_no,
        rqm_requisition_title: body.rqm_requisition_title !== undefined ? body.rqm_requisition_title : existingRequisition.rqm_requisition_title,
        rqm_tender_scope: body.rqm_justification !== undefined ? body.rqm_justification : existingRequisition.rqm_tender_scope,
        rqm_tender_type: body.rqm_requisition_type !== undefined ? body.rqm_requisition_type : existingRequisition.rqm_tender_type,
        rqm_jenis_tender: body.rqm_jenis_tender !== undefined ? body.rqm_jenis_tender : existingRequisition.rqm_jenis_tender,
        rqm_conversion_rate: body.rqm_conversion_rate !== undefined ? (body.rqm_conversion_rate ? parseFloat(body.rqm_conversion_rate) : null) : existingRequisition.rqm_conversion_rate,
        rqm_currency_unit: body.rqm_conversion_unit !== undefined ? (body.rqm_conversion_unit ? parseFloat(body.rqm_conversion_unit) : null) : existingRequisition.rqm_currency_unit,
        rqm_currency_code: body.rqm_currency_code !== undefined ? body.rqm_currency_code : existingRequisition.rqm_currency_code,
        rqm_rate_type: body.rqm_rate_type !== undefined ? body.rqm_rate_type : existingRequisition.rqm_rate_type,
        rqm_rate_date: body.rqm_rate_date !== undefined ? (body.rqm_rate_date ? new Date(body.rqm_rate_date) : null) : existingRequisition.rqm_rate_date,
        rqm_ent_amt: body.rqm_enter_amount !== undefined ? (body.rqm_enter_amount ? parseFloat(body.rqm_enter_amount) : null) : existingRequisition.rqm_ent_amt,
        rqm_amount: body.rqm_total_amount !== undefined ? (body.rqm_total_amount ? parseFloat(body.rqm_total_amount) : null) : existingRequisition.rqm_amount,
        rqm_total_gst: body.rqm_total_gst !== undefined ? (body.rqm_total_gst ? parseFloat(body.rqm_total_gst) : null) : existingRequisition.rqm_total_gst,
        rqm_balance_bdgt: body.rqm_balance_bdgt !== undefined ? (body.rqm_balance_bdgt ? parseFloat(body.rqm_balance_bdgt) : null) : existingRequisition.rqm_balance_bdgt,
        rqm_status: body.rqm_status !== undefined ? body.rqm_status : existingRequisition.rqm_status,
        rqm_wflow_sts: body.rqm_wflow_sts !== undefined ? body.rqm_wflow_sts : existingRequisition.rqm_wflow_sts,
        rqm_wflow_type: body.rqm_wflow_type !== undefined ? body.rqm_wflow_type : existingRequisition.rqm_wflow_type,
        rqm_request_by: body.rqm_request_by !== undefined ? body.rqm_request_by : existingRequisition.rqm_request_by,
        rqm_request_date: body.rqm_request_date !== undefined ? (body.rqm_request_date ? new Date(body.rqm_request_date) : null) : existingRequisition.rqm_request_date,
        rqm_ref_no: body.rqm_document_no !== undefined ? body.rqm_document_no : existingRequisition.rqm_ref_no,
        rqm_shipto_id: body.rqm_shipto_id !== undefined ? body.rqm_shipto_id : existingRequisition.rqm_shipto_id,
        rqm_contact_person: body.rqm_contact_person !== undefined ? body.rqm_contact_person : existingRequisition.rqm_contact_person,
        rqm_flag_bill: body.rqm_flag_bill !== undefined ? body.rqm_flag_bill : existingRequisition.rqm_flag_bill,
        rqm_open: body.rqm_open !== undefined ? body.rqm_open : existingRequisition.rqm_open,
        rqm_bumiputera: body.rqm_bumiputera !== undefined ? body.rqm_bumiputera : existingRequisition.rqm_bumiputera,
        rqm_reg_no: body.rqm_reg_no !== undefined ? body.rqm_reg_no : existingRequisition.rqm_reg_no,
        rqm_cctr_type: body.rqm_cctr_type !== undefined ? body.rqm_cctr_type : existingRequisition.rqm_cctr_type,
        rqm_multi_cctr: body.rqm_multi_cctr !== undefined ? body.rqm_multi_cctr : existingRequisition.rqm_multi_cctr,
        rqm_isagreement_exist: body.rqm_agreement !== undefined ? body.rqm_agreement : existingRequisition.rqm_isagreement_exist,
        rqm_agg_no: body.rqm_agg_no !== undefined ? body.rqm_agg_no : existingRequisition.rqm_agg_no,
        rqm_payee_code: body.rqm_vendor !== undefined ? body.rqm_vendor : existingRequisition.rqm_payee_code,
        updatedby: user.username || 'system',
        updateddate: new Date(),
      },
    });
    
    // Update requisition details if provided
    if (body.requisition_details && Array.isArray(body.requisition_details)) {
      // Delete existing details
      await prisma.requisition_details.deleteMany({
        where: {
          rqm_requisition_id: id,
        },
      });
      
      // Create new details if provided
      if (body.requisition_details.length > 0) {
        const detailsData = body.requisition_details.map((detail, index) => ({
          rqd_requisition_id: index + 1,
          rqm_requisition_id: id,
          rqd_line_no: detail.rqd_line_no ? parseFloat(detail.rqd_line_no) : index + 1,
          rqd_spec_desc: detail.rqd_spec_desc || null,
          rqd_pakej_no: detail.rqd_pakej_no || null,
          rqd_item_no: detail.rqd_item_no ? parseFloat(detail.rqd_item_no) : null,
          rqd_spec_level: detail.rqd_spec_level || null,
          rqd_spec_head: detail.rqd_spec_head || null,
          itm_item_code: detail.itm_item_code || null,
          rqd_qty: detail.rqd_qty || null,
          rqd_uom: detail.rqd_uom || null,
          rqd_price: detail.rqd_price ? parseFloat(detail.rqd_price) : null,
          rqd_gross_amt: detail.rqd_gross_amt ? parseFloat(detail.rqd_gross_amt) : null,
          rqd_ent_amt: detail.rqd_ent_amt ? parseFloat(detail.rqd_ent_amt) : null,
          rqd_total_price: detail.rqd_total_price ? parseFloat(detail.rqd_total_price) : null,
          rqd_total_price_rm: detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm) : null,
          org_code: detail.org_code || null,
          fty_fund_type: detail.fty_fund_type || null,
          oun_code: detail.oun_code || null,
          at_activity_code: detail.at_activity_code || null,
          ccr_costcentre: detail.ccr_costcentre || null,
          so_code: detail.so_code || null,
          cpa_project_no: detail.cpa_project_no || null,
          bdg_budget_code: detail.bdg_budget_code || null,
          acm_acct_code: detail.acm_acct_code || null,
          rqd_ccr_costcentre_budget: detail.rqd_ccr_costcentre_budget || null,
          sbg_budget_id: detail.sbg_budget_id || null,
          rqd_at_activity_code_budget: detail.rqd_at_activity_code_budget || null,
          rqd_commit_amt: detail.rqd_commit_amt ? parseFloat(detail.rqd_commit_amt) : null,
          rqd_vot: detail.rqd_vot || null,
          rqd_taxcode: detail.rqd_taxcode || null,
          rqd_taxpct: detail.rqd_taxpct ? parseFloat(detail.rqd_taxpct) : null,
          rqd_taxamt: detail.rqd_taxamt ? parseFloat(detail.rqd_taxamt) : null,
          rqd_status: detail.rqd_status || null,
          createdby: user.username || 'system',
          updatedby: user.username || 'system',
        }));
        
        await prisma.requisition_details.createMany({
          data: detailsData,
        });
      }
    }
    
    return {
      statusCode: 200,
      message: "Requisition updated successfully",
      data: {
        rqm_requisition_id: requisition.rqm_requisition_id,
        rqm_requisition_no: requisition.rqm_requisition_no,
      },
    };
  } catch (error) {
    console.error("Error updating requisition:", error);
    return {
      statusCode: 500,
      message: "Failed to update requisition",
      error: error.message,
    };
  }
});
