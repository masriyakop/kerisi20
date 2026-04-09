import prisma from "~/server/utils/prisma";

/**
 * GET /api/workflow-configuration/reroute-process-options
 * Active processes with label: wfa_workflow_title + ' - ' + wfp_process_name
 * (equivalent to joining wf_process and wf_workflow_name, wfp_status = '1')
 */
export default defineEventHandler(async () => {
  try {
    const rows = await prisma.wf_process.findMany({
      where: {
        wfp_status: "1",
        wfp_workflow_code: { not: null },
      },
      select: {
        wfp_process_id: true,
        wfp_process_name: true,
        wfp_sequence: true,
        wf_workflow_name: {
          select: {
            wfa_workflow_title: true,
          },
        },
      },
    });

    const joined = rows.filter((r) => r.wf_workflow_name != null);
    joined.sort((a, b) => {
      const ta = a.wf_workflow_name?.wfa_workflow_title ?? "";
      const tb = b.wf_workflow_name?.wfa_workflow_title ?? "";
      const byTitle = ta.localeCompare(tb);
      if (byTitle !== 0) return byTitle;
      return (a.wfp_sequence ?? 0) - (b.wfp_sequence ?? 0);
    });

    const data = joined.map((r) => {
      const title = r.wf_workflow_name?.wfa_workflow_title ?? "";
      const name = r.wfp_process_name ?? "";
      const description = [title, name].filter(Boolean).join(" - ");
      return {
        id: r.wfp_process_id,
        description,
      };
    });

    return {
      statusCode: 200,
      message: "Reroute process options fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching reroute process options:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch reroute process options",
      error: error.message,
      data: [],
    };
  }
});
