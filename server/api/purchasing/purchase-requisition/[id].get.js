import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id'));
    
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid requisition ID",
        data: null,
      };
    }
    
    // Fetch requisition master with related details
    const requisition = await prisma.requisition_master.findUnique({
      where: {
        rqm_requisition_id: id,
      },
      include: {
        requisition_details: {
          orderBy: {
            rqd_line_no: 'asc',
          },
        },
      },
    });
    
    if (!requisition) {
      return {
        statusCode: 404,
        message: "Requisition not found",
        data: null,
      };
    }
    
    // Format the response
    const formattedData = {
      rqm_requisition_id: requisition.rqm_requisition_id,
      rqm_requisition_no: requisition.rqm_requisition_no || '',
      rqm_request_by: requisition.rqm_request_by || '',
      rqm_request_date: requisition.rqm_request_date ? requisition.rqm_request_date.toISOString().split('T')[0] : '',
      rqm_status: requisition.rqm_status || 'DRAFT',
      rqm_requisition_title: requisition.rqm_requisition_title || '',
      rqm_justification: requisition.rqm_tender_scope || '',
      rqm_agreement: requisition.rqm_isagreement_exist || 'N',
      rqm_agg_no: requisition.rqm_agg_no || '',
      rqm_contact_person: requisition.rqm_contact_person || '',
      rqm_vendor: requisition.rqm_payee_code || '',
      rqm_enter_amount: requisition.rqm_ent_amt ? parseFloat(requisition.rqm_ent_amt.toString()) : 0,
      rqm_total_amount: requisition.rqm_amount ? parseFloat(requisition.rqm_amount.toString()) : 0,
      rqm_rate_date: requisition.rqm_rate_date ? requisition.rqm_rate_date.toISOString().split('T')[0] : '',
      rqm_currency_code: requisition.rqm_currency_code || '',
      rqm_rate_type: requisition.rqm_rate_type || '',
      rqm_conversion_unit: requisition.rqm_currency_unit ? parseFloat(requisition.rqm_currency_unit.toString()) : 0,
      rqm_conversion_rate: requisition.rqm_conversion_rate ? parseFloat(requisition.rqm_conversion_rate.toString()) : 0,
      rqm_document_no: requisition.rqm_ref_no || '',
      rqm_requisition_type: requisition.rqm_tender_type || '',
      // Additional fields
      org_code: requisition.org_code || '',
      oun_code: requisition.oun_code || '',
      fty_fund_type: requisition.fty_fund_type || '',
      ccr_costcentre: requisition.ccr_costcentre || '',
      at_activity_code: requisition.at_activity_code || '',
      so_code: requisition.so_code || '',
      cpa_project_no: requisition.cpa_project_no || '',
      rqm_total_gst: requisition.rqm_total_gst ? parseFloat(requisition.rqm_total_gst.toString()) : 0,
      rqm_balance_bdgt: requisition.rqm_balance_bdgt ? parseFloat(requisition.rqm_balance_bdgt.toString()) : 0,
      rqm_wflow_sts: requisition.rqm_wflow_sts || '',
      rqm_wflow_type: requisition.rqm_wflow_type || '',
      rqm_jenis_tender: requisition.rqm_jenis_tender || '',
      rqm_start_date: requisition.rqm_start_date ? requisition.rqm_start_date.toISOString().split('T')[0] : '',
      rqm_end_date: requisition.rqm_end_date ? requisition.rqm_end_date.toISOString().split('T')[0] : '',
      rqm_shipto_id: requisition.rqm_shipto_id || null,
      rqm_flag_bill: requisition.rqm_flag_bill || '',
      rqm_open: requisition.rqm_open || '',
      rqm_bumiputera: requisition.rqm_bumiputera || '',
      rqm_reg_no: requisition.rqm_reg_no || '',
      rqm_cctr_type: requisition.rqm_cctr_type || '',
      rqm_multi_cctr: requisition.rqm_multi_cctr || '',
      // Details
      requisition_details: requisition.requisition_details.map((detail) => ({
        rqd_requisition_id: detail.rqd_requisition_id,
        rqd_line_no: detail.rqd_line_no ? parseFloat(detail.rqd_line_no.toString()) : 0,
        rqd_spec_desc: detail.rqd_spec_desc || '',
        rqd_pakej_no: detail.rqd_pakej_no || '',
        rqd_item_no: detail.rqd_item_no ? parseFloat(detail.rqd_item_no.toString()) : 0,
        rqd_spec_level: detail.rqd_spec_level || '',
        rqd_spec_head: detail.rqd_spec_head || '',
        itm_item_code: detail.itm_item_code || '',
        rqd_qty: detail.rqd_qty || '',
        rqd_uom: detail.rqd_uom || '',
        rqd_price: detail.rqd_price ? parseFloat(detail.rqd_price.toString()) : 0,
        rqd_gross_amt: detail.rqd_gross_amt ? parseFloat(detail.rqd_gross_amt.toString()) : 0,
        rqd_ent_amt: detail.rqd_ent_amt ? parseFloat(detail.rqd_ent_amt.toString()) : 0,
        rqd_total_price: detail.rqd_total_price ? parseFloat(detail.rqd_total_price.toString()) : 0,
        rqd_total_price_rm: detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm.toString()) : 0,
        org_code: detail.org_code || '',
        fty_fund_type: detail.fty_fund_type || '',
        oun_code: detail.oun_code || '',
        at_activity_code: detail.at_activity_code || '',
        ccr_costcentre: detail.ccr_costcentre || '',
        so_code: detail.so_code || '',
        cpa_project_no: detail.cpa_project_no || '',
        bdg_budget_code: detail.bdg_budget_code || '',
        acm_acct_code: detail.acm_acct_code || '',
        rqd_ccr_costcentre_budget: detail.rqd_ccr_costcentre_budget || '',
        sbg_budget_id: detail.sbg_budget_id || null,
        rqd_at_activity_code_budget: detail.rqd_at_activity_code_budget || '',
        rqd_commit_amt: detail.rqd_commit_amt ? parseFloat(detail.rqd_commit_amt.toString()) : 0,
        rqd_vot: detail.rqd_vot || '',
        rqd_taxcode: detail.rqd_taxcode || '',
        rqd_taxpct: detail.rqd_taxpct ? parseFloat(detail.rqd_taxpct.toString()) : 0,
        rqd_taxamt: detail.rqd_taxamt ? parseFloat(detail.rqd_taxamt.toString()) : 0,
        rqd_status: detail.rqd_status || '',
      })),
    };
    
    return {
      statusCode: 200,
      message: "Requisition fetched successfully",
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching requisition:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch requisition",
      error: error.message,
    };
  }
});
