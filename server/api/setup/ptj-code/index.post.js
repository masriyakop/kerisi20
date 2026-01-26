import prisma from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const query = getQuery(event);
    
    // Determine which level to create
    const level = query.level || body.oun_level ? parseInt(body.oun_level) : null;
    
    if (level === null || level < 1 || level > 4) {
      return {
        statusCode: 400,
        message: "Please specify a valid level (1-4)",
      };
    }

    // Validate required fields
    if (!body.oun_code || !body.oun_desc || !body.oun_status || !body.org_code) {
      return {
        statusCode: 400,
        message: "Missing required fields: oun_code, oun_desc, oun_status, and org_code are required",
      };
    }

    // Check if PTJ code already exists
    const existing = await prisma.organization_unit.findUnique({
      where: {
        oun_code: body.oun_code,
      },
    });

    if (existing) {
      return {
        statusCode: 409,
        message: "PTJ code already exists",
      };
    }

    // Validate parent exists if provided (for levels 2-4)
    if (level > 1 && body.oun_code_parent) {
      const parent = await prisma.organization_unit.findUnique({
        where: {
          oun_code: body.oun_code_parent,
        },
      });

      if (!parent) {
        return {
          statusCode: 404,
          message: "Parent PTJ code not found",
        };
      }
    }

    // Get the next ID
    const maxId = await prisma.organization_unit.findFirst({
      orderBy: { oun_id: "desc" },
      select: { oun_id: true },
    });

    const nextId = maxId ? maxId.oun_id + 1 : 1;

    // Create new organization unit
    const newUnit = await prisma.organization_unit.create({
      data: {
        oun_id: nextId,
        oun_code: body.oun_code,
        oun_desc: body.oun_desc,
        oun_desc_bi: body.oun_desc_bi || null,
        org_code: body.org_code,
        org_desc: body.org_desc || null,
        oun_address: body.oun_address || null,
        oun_state: body.oun_state || null,
        st_staff_id_head: body.st_staff_id_head || null,
        oun_tel_no: body.oun_tel_no || null,
        oun_fax_no: body.oun_fax_no || null,
        oun_code_parent: body.oun_code_parent || null,
        oun_level: level,
        oun_status: body.oun_status === 'ACTIVE' ? '1' : '0',
        st_staff_id_superior: body.st_staff_id_superior || null,
        tanggung_start_date: body.tanggung_start_date ? new Date(body.tanggung_start_date) : null,
        tanggung_end_date: body.tanggung_end_date ? new Date(body.tanggung_end_date) : null,
        oun_shortname: body.oun_shortname || null,
        oun_region: body.oun_region || null,
        cny_country_code: body.cny_country_code || null,
        createddate: new Date(),
      },
    });

    return {
      statusCode: 200,
      message: `PTJ Code level ${level} created successfully`,
      data: {
        oun_id: newUnit.oun_id,
        oun_code: newUnit.oun_code,
        oun_desc: newUnit.oun_desc,
        oun_status: newUnit.oun_status === '1' || newUnit.oun_status === 1 ? 'ACTIVE' : 'INACTIVE',
      },
    };
  } catch (error) {
    console.error("Error creating PTJ code:", error);
    
    if (error.code === 'P2002') {
      return {
        statusCode: 409,
        message: "PTJ code already exists",
        error: error.message,
      };
    }
    
    return {
      statusCode: 500,
      message: "An error occurred while creating PTJ code",
      error: error.message,
    };
  }
});
