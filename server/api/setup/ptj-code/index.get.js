import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const level = query.level ? parseInt(query.level) : null;

    let where = {};
    let data = [];

    // Level 1: PTJ Code Level 1
    if (level === 1 || (level === null && !query.oun_code_parent)) {
      where.oun_level = 1;

      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } },
        ];
      }

      // Smart filter for status
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === 'ACTIVE') {
          where.oun_status = '1';
        } else if (query.smartFilter_oun_status === 'INACTIVE') {
          where.oun_status = { not: '1' };
        }
      }

      const units = await prisma.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true,
        },
        orderBy: {
          oun_code: 'asc',
        },
      });

      // Get country descriptions
      const countryCodes = [...new Set(units.map(u => u.cny_country_code).filter(Boolean))];
      const countries = await prisma.country.findMany({
        where: {
          cny_country_code: { in: countryCodes },
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true,
        },
      });

      const countryMap = {};
      countries.forEach(c => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });

      data = units.map((item, index) => ({
        no: index + 1,
        'PTJ Code': item.oun_code || '',
        'PTJ Desc (Malay)': item.oun_desc || '',
        'Country': countryMap[item.cny_country_code] || '',
        'Status': item.oun_status === '1' ? 'ACTIVE' : 'INACTIVE',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));

      return {
        statusCode: 200,
        message: 'PTJ Code Level 1 fetched successfully',
        data,
      };
    }

    // Level 2: PTJ Code Level 2
    if (level === 2) {
      if (!query.oun_code_parent) {
        return {
          statusCode: 400,
          message: 'oun_code_parent is required for level 2',
          data: [],
        };
      }

      where.oun_level = 2;
      where.oun_code_parent = query.oun_code_parent;

      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } },
        ];
      }

      // Smart filter for status
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === 'ACTIVE') {
          where.oun_status = '1';
        } else if (query.smartFilter_oun_status === 'INACTIVE') {
          where.oun_status = { not: '1' };
        }
      }

      const units = await prisma.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true,
        },
        orderBy: {
          oun_code: 'asc',
        },
      });

      // Get country descriptions
      const countryCodes = [...new Set(units.map(u => u.cny_country_code).filter(Boolean))];
      const countries = countryCodes.length > 0 ? await prisma.country.findMany({
        where: {
          cny_country_code: { in: countryCodes },
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true,
        },
      }) : [];

      const countryMap = {};
      countries.forEach(c => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });

      data = units.map((item, index) => ({
        no: index + 1,
        'PTJ Code': item.oun_code || '',
        'PTJ Desc (Malay)': item.oun_desc || '',
        'Code Parent': item.oun_code_parent || '',
        'Country': countryMap[item.cny_country_code] || '',
        'Status': item.oun_status === '1' ? 'ACTIVE' : 'INACTIVE',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));

      return {
        statusCode: 200,
        message: 'PTJ Code Level 2 fetched successfully',
        data,
      };
    }

    // Level 3: PTJ Code Level 3
    if (level === 3) {
      if (!query.oun_code_parent) {
        return {
          statusCode: 400,
        message: 'oun_code_parent is required for level 3',
          data: [],
        };
      }

      where.oun_level = 3;
      where.oun_code_parent = query.oun_code_parent;

      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } },
        ];
      }

      // Smart filter for status
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === 'ACTIVE') {
          where.oun_status = '1';
        } else if (query.smartFilter_oun_status === 'INACTIVE') {
          where.oun_status = { not: '1' };
        }
      }

      const units = await prisma.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true,
        },
        orderBy: {
          oun_code: 'asc',
        },
      });

      // Get country and region descriptions
      const countryCodes = [...new Set(units.map(u => u.cny_country_code).filter(Boolean))];
      const regionCodes = [...new Set(units.map(u => u.oun_region).filter(Boolean))];

      const countries = countryCodes.length > 0 ? await prisma.country.findMany({
        where: {
          cny_country_code: { in: countryCodes },
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true,
        },
      }) : [];

      const regions = regionCodes.length > 0 ? await prisma.lkp_region.findMany({
        where: {
          lrg_region: { in: regionCodes },
        },
        select: {
          lrg_region: true,
          lrg_region_desc: true,
        },
      }) : [];

      const countryMap = {};
      countries.forEach(c => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });

      const regionMap = {};
      regions.forEach(r => {
        regionMap[r.lrg_region] = r.lrg_region_desc;
      });

      data = units.map((item, index) => ({
        no: index + 1,
        'PTJ Code': item.oun_code || '',
        'PTJ Desc (Malay)': item.oun_desc || '',
        'Code Parent': item.oun_code_parent || '',
        'Region': regionMap[item.oun_region] || '',
        'Country': countryMap[item.cny_country_code] || '',
        'Status': item.oun_status === '1' ? 'ACTIVE' : 'INACTIVE',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));

      return {
        statusCode: 200,
        message: 'PTJ Code Level 3 fetched successfully',
        data,
      };
    }

    // Level 4: PTJ Code Level 4
    if (level === 4) {
      if (!query.oun_code_parent) {
        return {
          statusCode: 400,
          message: 'oun_code_parent is required for level 4',
          data: [],
        };
      }

      where.oun_level = 4;
      where.oun_code_parent = query.oun_code_parent;

      // Search filter
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } },
        ];
      }

      // Smart filter for status
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === 'ACTIVE') {
          where.oun_status = '1';
        } else if (query.smartFilter_oun_status === 'INACTIVE') {
          where.oun_status = { not: '1' };
        }
      }

      const units = await prisma.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true,
        },
        orderBy: {
          oun_code: 'asc',
        },
      });

      // Get country and region descriptions
      const countryCodes = [...new Set(units.map(u => u.cny_country_code).filter(Boolean))];
      const regionCodes = [...new Set(units.map(u => u.oun_region).filter(Boolean))];

      const countries = countryCodes.length > 0 ? await prisma.country.findMany({
        where: {
          cny_country_code: { in: countryCodes },
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true,
        },
      }) : [];

      const regions = regionCodes.length > 0 ? await prisma.lkp_region.findMany({
        where: {
          lrg_region: { in: regionCodes },
        },
        select: {
          lrg_region: true,
          lrg_region_desc: true,
        },
      }) : [];

      const countryMap = {};
      countries.forEach(c => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });

      const regionMap = {};
      regions.forEach(r => {
        regionMap[r.lrg_region] = r.lrg_region_desc;
      });

      data = units.map((item, index) => ({
        no: index + 1,
        'PTJ Code': item.oun_code || '',
        'PTJ Desc (Malay)': item.oun_desc || '',
        'Code Parent': item.oun_code_parent || '',
        'Region': regionMap[item.oun_region] || '',
        'Country': countryMap[item.cny_country_code] || '',
        'Status': item.oun_status === '1' ? 'ACTIVE' : 'INACTIVE',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));

      return {
        statusCode: 200,
        message: 'PTJ Code Level 4 fetched successfully',
        data,
      };
    }

    return {
      statusCode: 400,
      message: 'Invalid level parameter',
      data: [],
    };
  } catch (error) {
    console.error('Error in ptj-code API:', error);
    return {
      statusCode: 500,
      message: error.message || 'Internal server error',
      data: [],
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
});
