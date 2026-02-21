import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    // Determine which level to fetch
    // Priority: explicit level parameter > level_1/level2/etc > dt_accountactvty
    let level = null;
    if (query.level !== undefined && query.level !== null) {
      level = parseInt(query.level);
    } else if (query.level_1) {
      level = 1;
    } else if (query.level2) {
      level = 2;
    } else if (query.level3) {
      level = 3;
    } else if (query.level4) {
      level = 4;
    } else if (query.level5) {
      level = 5;
    } else if (query.dt_accountactvty) {
      level = 0;
    }
    
    if (level === null) {
      return {
        statusCode: 400,
        message: "Please specify a level parameter",
      };
    }

    // Level 0: ACCOUNT ACTIVITY (uses lookup_details)
    if (level === 0) {
      const where = {
        lma_code_name: 'ACCOUNT_ACTIVITY',
      };
      
      if (query.search && query.search.trim() !== '') {
        const searchTerm = query.search.trim();
        where.OR = [
          { lde_value: { contains: searchTerm } },
          { lde_description: { contains: searchTerm } },
          { lde_description2: { contains: searchTerm } },
        ];
      }
      
      if (query.lde_status) {
        const statusValue = query.lde_status === 'ACTIVE' ? '1' : 
                           query.lde_status === 'INACTIVE' ? '0' : 
                           query.lde_status;
        where.lde_status = statusValue;
      }
      
      // Apply smart filter from query
      if (query.smartFilter_lde_status) {
        const statusValue = query.smartFilter_lde_status === 'ACTIVE' ? '1' : 
                           query.smartFilter_lde_status === 'INACTIVE' ? '0' : 
                           query.smartFilter_lde_status;
        where.lde_status = statusValue;
      }

      // Fetch activities - handle null sorting values
      let activities = await prisma.lookup_details.findMany({
        where,
      });
      
      // Sort manually to handle null values
      activities = activities.sort((a, b) => {
        if (a.lde_sorting === null && b.lde_sorting === null) {
          return a.lde_id - b.lde_id;
        }
        if (a.lde_sorting === null) return 1;
        if (b.lde_sorting === null) return -1;
        if (a.lde_sorting !== b.lde_sorting) {
          return a.lde_sorting - b.lde_sorting;
        }
        return a.lde_id - b.lde_id;
      });

      const formattedActivities = activities.map((item, index) => ({
        no: index + 1,
        lde_value: item.lde_value || '',
        lde_description: item.lde_description || '',
        lde_description2: item.lde_description2 || '',
        lde_status: item.lde_status === '1' || item.lde_status === 1 ? 'ACTIVE' : 'INACTIVE',
        lde_id: item.lde_id,
      }));

      return {
        statusCode: 200,
        message: "Account activities fetched successfully",
        data: formattedActivities,
      };
    }

    // Levels 1-5: ACCOUNT CLASS, SUB-CLASS, SIRIES, SUB-SIRIES, ACCOUNT CODE (uses account_main)
    // Convert level to number for Decimal comparison
    const levelNum = parseInt(level);
    const where = {
      acm_acct_level: levelNum,
    };
    
    // Level 1 (ACCOUNT CLASS): Filter by acm_acct_activity = '?'
    if (level === 1) {
      // Use activity parameter if provided, otherwise use parent (for consistency)
      const activityValue = query.activity || query.parent;
      if (activityValue) {
        where.acm_acct_activity = activityValue;
      } else {
        return {
          statusCode: 400,
          message: "Activity code is required for Account Class",
        };
      }
    } else {
      // Levels 2-5: Filter by acm_acct_parent = '?'
      if (query.parent) {
        where.acm_acct_parent = query.parent;
      } else {
        return {
          statusCode: 400,
          message: `Parent code is required for level ${level}`,
        };
      }
    }
    
    // Search filter - MySQL uses contains (LIKE %term%)
    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      where.OR = [
        { acm_acct_code: { contains: searchTerm } },
        { acm_acct_desc: { contains: searchTerm } },
        { acm_acct_desc_eng: { contains: searchTerm } },
        { acm_acct_activity: { contains: searchTerm } },
        { acm_acct_group: { contains: searchTerm } },
      ];
    }
    
    // Smart filters
    if (query.acm_acct_status) {
      const statusValue = query.acm_acct_status === 'ACTIVE' ? '1' : 
                         query.acm_acct_status === 'INACTIVE' ? '0' : 
                         query.acm_acct_status;
      where.acm_acct_status = statusValue;
    }
    
    // Apply smart filter from query
    if (query.smartFilter_acm_acct_status) {
      const statusValue = query.smartFilter_acm_acct_status === 'ACTIVE' ? '1' : 
                         query.smartFilter_acm_acct_status === 'INACTIVE' ? '0' : 
                         query.smartFilter_acm_acct_status;
      where.acm_acct_status = statusValue;
    }

    const accounts = await prisma.account_main.findMany({
      where,
      select: {
        acm_acct_code: true,
        acm_acct_desc: true,
        acm_acct_desc_eng: true,
        acm_acct_activity: true,
        acm_acct_group: true,
        acm_acct_status: true,
        createddate: true,
        acm_acct_level: true,
        acm_acct_parent: true,
      },
      orderBy: {
        acm_acct_code: 'asc',
      },
    });

    // Format the response to match SQL query fields
    const formattedData = accounts.map((item, index) => {
      // Convert Decimal to number for acm_acct_level
      const acctLevel = item.acm_acct_level ? (typeof item.acm_acct_level === 'object' ? Number(item.acm_acct_level) : Number(item.acm_acct_level)) : null;
      
      return {
        no: index + 1,
        acm_acct_code: item.acm_acct_code || '',
        acm_acct_desc: item.acm_acct_desc || '',
        acm_acct_desc_eng: item.acm_acct_desc_eng || '',
        acm_acct_activity: item.acm_acct_activity || '',
        acm_acct_status: item.acm_acct_status === '1' || item.acm_acct_status === 1 ? 'ACTIVE' : 'INACTIVE',
        datecreate: item.createddate ? (item.createddate instanceof Date ? item.createddate.toISOString().split('T')[0] : item.createddate) : null,
        // Additional fields for internal use
        acm_acct_group: item.acm_acct_group || '',
        acm_acct_level: acctLevel,
        acm_acct_parent: item.acm_acct_parent || '',
      };
    });

    return {
      statusCode: 200,
      message: `Account level ${level} fetched successfully`,
      data: formattedData,
    };
  } catch (error) {
    console.error("Error fetching account codes:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
