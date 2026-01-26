import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    let whereClause = {};

    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { grm_receive_no: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { vcs_vendor_name: { contains: searchTerm } },
      ];
    }

    const grns = await prisma.goods_receive_master.findMany({
      where: whereClause,
      include: {
        purchase_order_master: {
          select: {
            pom_order_no: true,
            pom_order_ref: true,
          },
        },
        vend_customer_supplier: {
          select: {
            vcs_vendor_code: true,
            vcs_vendor_name: true,
          },
        },
        vendor_assessment_master: {
          select: {
            vam_assessment_date: true,
          },
        },
      },
      orderBy: {
        grm_receive_id: 'desc',
      },
    });

    const data = grns.map((grn) => {
      const assessmentDate = grn.vendor_assessment_master?.vam_assessment_date
        ? new Date(grn.vendor_assessment_master.vam_assessment_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '';

      return {
        grm_receive_id: grn.grm_receive_id,
        pre_no: grn.pom_order_master?.pom_order_ref || '',
        por_no: grn.pom_order_master?.pom_order_no || '',
        grn_bil_no: grn.grm_receive_no || '',
        ptj: grn.pom_order_master?.pom_order_ref || '',
        tarikh_penilaian: assessmentDate,
        nama_pembekal: grn.vend_customer_supplier?.vcs_vendor_name || '',
        kod_pembekal: grn.vend_customer_supplier?.vcs_vendor_code || '',
        urlEdit: `/purchasing/report/vendor-assessment-grn/view/${grn.grm_receive_id}`,
      };
    });

    return {
      statusCode: 200,
      message: "Vendor assessment (GRN) list fetched successfully",
      data: data,
    };
  } catch (error) {
    console.error("Error fetching vendor assessment (GRN) list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch vendor assessment (GRN) list",
      error: error.message,
    };
  }
});
