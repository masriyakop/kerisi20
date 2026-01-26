import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const level = query.level ? parseInt(query.level) : null;

    let where = {};
    let data = [];

    // Level 0: Activity Group Level 1
    if (level === 0 || level === null) {
      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { activity_group_code: { contains: searchTerm } },
          { activity_group_desc: { contains: searchTerm } },
        ];
      }

      // Smart filter
      // Add smart filter logic here if needed

      const groups = await prisma.activity_group.findMany({
        where,
        select: {
          activity_group_code: true,
          activity_group_desc: true,
        },
        orderBy: {
          activity_group_code: 'asc',
        },
      });

      data = groups.map((item, index) => ({
        no: index + 1,
        Group: item.activity_group_code || '',
        Description: item.activity_group_desc || '',
        Action: '',
        // Keep original data
        activity_group_code: item.activity_group_code,
        activity_group_desc: item.activity_group_desc,
      }));

      return {
        statusCode: 200,
        message: 'Activity groups fetched successfully',
        data,
      };
    }

    // Level 1: Activity Subgroup Level 2
    if (level === 1) {
      if (!query.activity_group_code) {
        return {
          statusCode: 400,
          message: 'activity_group_code is required for level 1',
          data: [],
        };
      }

      where.activity_group_code = query.activity_group_code;

      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { activity_subgroup_code: { contains: searchTerm } },
          { activity_subgroup_desc: { contains: searchTerm } },
        ];
      }

      const subgroups = await prisma.activity_subgroup.findMany({
        where,
        select: {
          activity_group_code: true,
          activity_subgroup_code: true,
          activity_subgroup_desc: true,
        },
        orderBy: {
          activity_subgroup_code: 'asc',
        },
      });

      data = subgroups.map((item, index) => ({
        no: index + 1,
        'Code Activity': item.activity_subgroup_code || '',
        Description: item.activity_subgroup_desc || '',
        Action: '',
        // Keep original data
        activity_group_code: item.activity_group_code,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subgroup_desc: item.activity_subgroup_desc,
      }));

      return {
        statusCode: 200,
        message: 'Activity subgroups fetched successfully',
        data,
      };
    }

    // Level 2: Activity Subsiri Level 3
    if (level === 2) {
      if (!query.activity_group_code || !query.activity_subgroup_code) {
        return {
          statusCode: 400,
          message: 'activity_group_code and activity_subgroup_code are required for level 2',
          data: [],
        };
      }

      where.activity_group = query.activity_group_code;
      where.activity_subgroup_code = query.activity_subgroup_code;

      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { activity_subsiri_code: { contains: searchTerm } },
          { activity_subsiri_desc: { contains: searchTerm } },
          { activity_subsiri_desc_eng: { contains: searchTerm } },
        ];
      }

      const subsiris = await prisma.activity_subsiri.findMany({
        where,
        select: {
          activity_group: true,
          activity_subgroup_code: true,
          activity_subsiri_code: true,
          activity_subsiri_desc: true,
          activity_subsiri_desc_eng: true,
        },
        orderBy: {
          activity_subsiri_code: 'asc',
        },
      });

      data = subsiris.map((item, index) => ({
        no: index + 1,
        'Code Activity': item.activity_subsiri_code || '',
        'Description (Malay)': item.activity_subsiri_desc || '',
        'Description (English)': item.activity_subsiri_desc_eng || '',
        Action: '',
        // Keep original data
        activity_group: item.activity_group,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subsiri_code: item.activity_subsiri_code,
        activity_subsiri_desc: item.activity_subsiri_desc,
        activity_subsiri_desc_eng: item.activity_subsiri_desc_eng,
      }));

      return {
        statusCode: 200,
        message: 'Activity subsiris fetched successfully',
        data,
      };
    }

    // Level 3: Activity Type Level 4
    if (level === 3) {
      if (!query.activity_group_code || !query.activity_subgroup_code || !query.activity_subsiri_code) {
        return {
          statusCode: 400,
          message: 'activity_group_code, activity_subgroup_code, and activity_subsiri_code are required for level 3',
          data: [],
        };
      }

      where.activity_group_code = query.activity_group_code;
      where.activity_subgroup_code = query.activity_subgroup_code;
      where.activity_subsiri_code = query.activity_subsiri_code;

      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { at_activity_code: { contains: searchTerm } },
          { at_activity_description_bm: { contains: searchTerm } },
          { at_activity_description_en: { contains: searchTerm } },
        ];
      }

      // Smart filter for status
      if (query.smartFilter_at_status) {
        if (query.smartFilter_at_status === 'ACTIVE') {
          where.at_status = '1';
        } else if (query.smartFilter_at_status === 'INACTIVE') {
          where.at_status = { not: '1' };
        }
      }

      const activityTypes = await prisma.activity_type.findMany({
        where,
        select: {
          at_activity_id: true,
          activity_group_code: true,
          activity_subgroup_code: true,
          activity_subsiri_code: true,
          at_activity_code: true,
          at_activity_description_bm: true,
          at_activity_description_en: true,
          at_status: true,
        },
        orderBy: {
          at_activity_code: 'asc',
        },
      });

      data = activityTypes.map((item, index) => ({
        no: index + 1,
        'Activity Code': item.at_activity_code || '',
        'Description (Malay)': item.at_activity_description_bm || '',
        'Description (English)': item.at_activity_description_en || '',
        Status: item.at_status === '1' ? 'ACTIVE' : 'INACTIVE',
        Action: '',
        // Keep original data
        at_activity_id: item.at_activity_id,
        activity_group_code: item.activity_group_code,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subsiri_code: item.activity_subsiri_code,
        at_activity_code: item.at_activity_code,
        at_activity_description_bm: item.at_activity_description_bm,
        at_activity_description_en: item.at_activity_description_en,
        at_status: item.at_status,
      }));

      return {
        statusCode: 200,
        message: 'Activity types fetched successfully',
        data,
      };
    }

    return {
      statusCode: 400,
      message: 'Invalid level parameter',
      data: [],
    };
  } catch (error) {
    console.error('Error in activity-code API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
