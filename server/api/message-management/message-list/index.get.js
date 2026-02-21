import prisma from "~/server/utils/prisma2";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Build where clause from query parameters
    const where = {};
    
    
    
    // Add search filter if provided
    if (query.search && query.search.trim() !== "") {
      where.OR = [
        { mm_mesg_code: { contains: query.search } },
        { ml_page_name: { contains: query.search } },
        { ml_page_breadcrumb: { contains: query.search } },
        { ml_module_name: { contains: query.search } },
        { ml_mesg_desc: { contains: query.search } }
      ];
    }

    // Add top filter conditions (accept both aliases and original field names)
    // Note: Using contains without mode for cross-database compatibility
    if (query.mm_mesg_code || query.mm_mesg_code || query.mm_mesg_code) {
      const filterValue = query.mm_mesg_code || query.mm_mesg_code || query.mm_mesg_code;
      where.mm_mesg_code = { contains: filterValue };
    }
    if (query.mm_mesg_type || query.mm_mesg_type || query.mm_mesg_type) {
      const filterValue = query.mm_mesg_type || query.mm_mesg_type || query.mm_mesg_type;
      where.adm_message_master = { mm_mesg_type: { contains: filterValue } };
    }
    if (query.ml_page_name || query.ml_page_name || query.ml_page_name) {
      const filterValue = query.ml_page_name || query.ml_page_name || query.ml_page_name;
      where.ml_page_name = { contains: filterValue };
    }
    if (query.ml_page_breadcrumb || query.ml_page_breadcrumb || query.ml_page_breadcrumb) {
      const filterValue = query.ml_page_breadcrumb || query.ml_page_breadcrumb || query.ml_page_breadcrumb;
      where.ml_page_breadcrumb = { contains: filterValue };
    }
    if (query.ml_module_name || query.ml_module_name || query.ml_module_name) {
      const filterValue = query.ml_module_name || query.ml_module_name || query.ml_module_name;
      where.ml_module_name = { contains: filterValue };
    }
    if (query.ml_mesg_desc || query.ml_mesg_desc || query.ml_mesg_desc) {
      const filterValue = query.ml_mesg_desc || query.ml_mesg_desc || query.ml_mesg_desc;
      where.ml_mesg_desc = { contains: filterValue };
    }
    if (query.ml_user_action || query.ml_user_action || query.ml_user_action) {
      const filterValue = query.ml_user_action || query.ml_user_action || query.ml_user_action;
      where.ml_user_action = { contains: filterValue };
    }
    if (query.createddate || query.createddate || query.createddate) {
      const filterValue = query.createddate || query.createddate || query.createddate;
      where.createddate = { contains: filterValue };
    }
    if (query.Code || query.Code || query.mm_mesg_code) {
      const filterValue = query.Code || query.Code || query.mm_mesg_code;
      where.mm_mesg_code = { contains: filterValue };
    }
    if (query.Type || query.Type || query.mm_mesg_type) {
      const filterValue = query.Type || query.Type || query.mm_mesg_type;
      where.adm_message_master = { mm_mesg_type: { contains: filterValue } };
    }
    if (query["Page Name"] || query.Page_Name || query.ml_page_name) {
      const filterValue = query["Page Name"] || query.Page_Name || query.ml_page_name;
      where.ml_page_name = { contains: filterValue };
    }
    if (query["Bread Crumb"] || query.Bread_Crumb || query.ml_page_breadcrumb) {
      const filterValue = query["Bread Crumb"] || query.Bread_Crumb || query.ml_page_breadcrumb;
      where.ml_page_breadcrumb = { contains: filterValue };
    }
    if (query.Module || query.Module || query.ml_module_name) {
      const filterValue = query.Module || query.Module || query.ml_module_name;
      where.ml_module_name = { contains: filterValue };
    }
    if (query.Message || query.Message || query.ml_mesg_desc) {
      const filterValue = query.Message || query.Message || query.ml_mesg_desc;
      where.ml_mesg_desc = { contains: filterValue };
    }
    if (query.Respond || query.Respond || query.ml_user_action) {
      const filterValue = query.Respond || query.Respond || query.ml_user_action;
      where.ml_user_action = { contains: filterValue };
    }
    if (query.Date || query.Date || query.createddate) {
      const filterValue = query.Date || query.Date || query.createddate;
      where.createddate = { contains: filterValue };
    }
    
    // Add Top Filter component field conditions (tf_xxx fields)
    

    // Get data with related tables - no pagination, rs-table handles it client-side
    const data = await prisma.adm_message_log.findMany({
      where,
      orderBy: { ml_message_log_id: 'desc' },
      include: {
        adm_message_master: { select: { mm_mesg_type: true } },
      },
    });

    // Map fields to aliases for frontend and ensure primary key is included
    const mappedData = data.map((item) => {
      const mapped = { ...item };
      mapped.Code = item.mm_mesg_code;
      mapped.code = item.mm_mesg_code;
      mapped.Type = item.mm_mesg_type;
      mapped.type = item.mm_mesg_type;
      mapped["Page Name"] = item.ml_page_name;
      mapped.Page_Name = item.ml_page_name;
      mapped.page_name = item.ml_page_name;
      mapped["Bread Crumb"] = item.ml_page_breadcrumb;
      mapped.Bread_Crumb = item.ml_page_breadcrumb;
      mapped.bread_crumb = item.ml_page_breadcrumb;
      mapped.Module = item.ml_module_name;
      mapped.module = item.ml_module_name;
      mapped.Message = item.ml_mesg_desc;
      mapped.message = item.ml_mesg_desc;
      mapped.Respond = item.ml_user_action;
      mapped.respond = item.ml_user_action;
      mapped.Date = item.createddate;
      mapped.date = item.createddate;
      mapped.Type = item.adm_message_master?.mm_mesg_type ?? '';
      mapped.type = mapped.Type;
      // BigInt PK -> Number so JSON response does not throw
      mapped.ml_message_log_id = Number(item.ml_message_log_id);
      mapped.id = Number(item.ml_message_log_id);
      delete mapped.adm_message_master;
      return mapped;
    });

    return {
      statusCode: 200,
      message: "Data fetched successfully",
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2001') {
      return {
        statusCode: 404,
        message: "No records found",
      };
    }
    
    return {
      statusCode: 500,
      message: "Failed to fetch data",
      error: "development" === 'development' ? error.message : "An error occurred while fetching data",
    };
  }
});
