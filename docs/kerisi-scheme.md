
Kerisi Database schema (ORM Prisma Schema):

model quarter_budget {
  qbu_quarter_id         Int                      @id
  qbu_year               String                   @db.VarChar(4)
  qbu_description        String                   @db.VarChar(30)
  qbu_start_date         DateTime?                @db.Date
  qbu_end_date           DateTime?                @db.Date
  qbu_status             String?                  @db.VarChar(20)
}


model structure_budget {
  sbg_budget_id                                                                  Int                    @id
  oun_code                                                                       String?                @db.VarChar(20)
  fty_fund_type                                                                  String?                @db.VarChar(20)
  at_activity_code                                                               String?                @db.VarChar(10)
  ccr_costcentre                                                                 String?                @db.VarChar(20)
  lbc_budget_code                                                                String?                @db.VarChar(10)
  cpa_project_no                                                                 String?                @db.VarChar(30)
  kod_so                                                                         String?                @db.VarChar(45)
  sby_year                                                                       String?                @db.VarChar(6)
  sbg_status                                                                     String                 @db.VarChar(10)
  createddate                                                                    DateTime?              @default(now()) @db.DateTime(0)
  createdby                                                                      String?                @db.VarChar(250)
  updateddate                                                                    DateTime?              @db.DateTime(0)
  updatedby                                                                      String?                @db.VarChar(250)
  fullcode                                                                       String?                @db.VarChar(50)
  acm_defisit                                                                    String?                @default("N") @db.VarChar(1)
}

model lkp_budget_code {
  lbc_id              Int                @id
  lbc_level           String             @db.VarChar(4)
  lbc_budget_code     String             @unique(map: "lbc_budget_code_UNIQUE") @db.VarChar(10)
  lbc_description     String             @db.VarChar(250)
  lbc_status          String             @db.VarChar(20)
}


model budget {
  bdg_budget_id        Int                  @id
  bdg_year             String               @db.VarChar(4)
  sbg_budget_id        Int?
  qbu_quarter_id       Int?
  bdg_initial_amt      Decimal?             @db.Decimal(15, 2)
  bdg_topup_amt        Decimal?             @db.Decimal(15, 2)
  bdg_additional_amt   Decimal?             @db.Decimal(15, 2)
  bdg_virement_amt     Decimal?             @db.Decimal(15, 2)
  bdg_allocated_amt    Decimal?             @db.Decimal(15, 2)
  bdg_lock_amt         Decimal?             @db.Decimal(15, 2)
  bdg_pre_request_amt  Decimal?             @db.Decimal(15, 2)
  bdg_request_amt      Decimal?             @db.Decimal(15, 2)
  bdg_commit_amt       Decimal?             @db.Decimal(15, 2)
  bdg_expenses_amt     Decimal?             @db.Decimal(15, 2)
  bdg_balance_amt      Decimal?             @db.Decimal(15, 2)
  bdg_bal_carryforward Decimal?             @db.Decimal(15, 2)
  bdg_quarter_open     String?              @db.VarChar(1)
  quarteropenby        String?              @db.VarChar(250)
  quarteropendate      DateTime?            @db.DateTime(0)
  bdg_ref_id           String               @db.VarChar(20)
  bdg_status           String?              @db.VarChar(10)
  bdg_endorse_doc      String               @db.VarChar(100)
  bdg_remark           String?              @db.VarChar(100)
  bdg_closing          String?              @db.VarChar(4)
  bdg_closing_by       String?              @db.VarChar(20)
  bdg_closing_date     DateTime?            @db.DateTime(0)
  bdg_extended_field   Json?
  createddate          DateTime?            @default(now()) @db.DateTime(0)
  createdby            String?              @db.VarChar(250)
  updateddate          DateTime?            @db.DateTime(0)
  updatedby            String?              @db.VarChar(250)
  structure_budget     structure_budget?    @relation(fields: [sbg_budget_id], references: [sbg_budget_id], onDelete: Restrict, onUpdate: Restrict, map: "budget_fk02")
  budget_transaction   budget_transaction[]

  @@index([sbg_budget_id], map: "budget_fk02")
  @@index([qbu_quarter_id], map: "fk_reference_99")
}

model budget_transaction {
  bgt_budget_detl_id Int               @id
  bdg_budget_id      Int?
  sbg_budget_id      Int?
  acm_acct_code      String?           @db.VarChar(10)
  bgt_trans_date     DateTime?         @db.DateTime(0)
  bgt_system_id      String?           @db.VarChar(20)
  bgt_ref            String?           @db.VarChar(250)
  bgt_trans_type     String?           @db.VarChar(10)
  bgt_trans_amt      Decimal?          @db.Decimal(15, 2)
  pageid             Int?
  bgt_task_id        String?           @db.VarChar(250)
  bgt_extended_field Json?
  createddate        DateTime?         @default(now()) @db.DateTime(0)
  createdby          String?           @db.VarChar(250)
  updateddate        DateTime?         @db.DateTime(0)
  updatedby          String?           @db.VarChar(250)
  sequence_id_source BigInt?
  acm_acct_code_old  String?           @db.VarChar(10)
  bgt_ref2           String?           @db.VarChar(50)
  structure_budget   structure_budget? @relation(fields: [sbg_budget_id], references: [sbg_budget_id], onDelete: Restrict, onUpdate: Restrict, map: "budget_transaction_fk02")
  budget             budget?           @relation(fields: [bdg_budget_id], references: [bdg_budget_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_reference_101")

  @@index([sbg_budget_id], map: "budget_transaction_fk02")
  @@index([pageid], map: "budget_transaction_fk03")
  @@index([sequence_id_source], map: "budget_transaction_ind03")
  @@index([bdg_budget_id], map: "fk_reference_101")
}



model lookup_details {
  lde_id             Int           @id @default(autoincrement())
  lma_code_name      String        @db.VarChar(20)
  lde_group          String?       @db.VarChar(50)
  lde_value          String        @db.VarChar(150)
  lde_value2         String?       @db.VarChar(50)
  lde_description    String        @db.VarChar(250)
  lde_description2   String?       @db.VarChar(250)
  lde_status         String?       @db.VarChar(20)
  lde_sorting        Int?
  lde_extended_field Json?
  createddate        DateTime?     @default(now()) @db.DateTime(0)
  createdby          String?       @db.VarChar(250)
  updateddate        DateTime?     @db.DateTime(0)
  updatedby          String?       @db.VarChar(250)
  lde_m_id           Int?
  lookup_master      lookup_master @relation(fields: [lma_code_name], references: [lma_code_name], onUpdate: Restrict, map: "fk_reference_21")

  @@unique([lma_code_name, lde_group, lde_value], map: "un_lookup_details_01")
  @@index([lma_code_name], map: "fk_reference_21")
  @@index([lma_code_name, lde_value], map: "idx_lookup_details_02")
}

model lookup_master {
  lma_code_name   String           @id @db.VarChar(20)
  lma_description String           @db.VarChar(250)
  lma_status      String?          @db.VarChar(45)
  createddate     DateTime?        @default(now()) @db.DateTime(0)
  createdby       String?          @db.VarChar(250)
  updateddate     DateTime?        @db.DateTime(0)
  updatedby       String?          @db.VarChar(250)
  lookup_details  lookup_details[]
}

model staff {
  stf_staff_id           String    @id @db.VarChar(20)
  stf_staff_name         String    @db.VarChar(100)
  stf_staff_status       String    @db.VarChar(10)
  org_code               String?   @db.VarChar(20)
  stf_gender             String?   @db.VarChar(6)
  stf_ic_no              String?   @db.VarChar(15)
  stf_birth_date         DateTime? @db.DateTime(0)
  stf_birth_place        String?   @db.VarChar(50)
  stf_birth_state        String?   @db.VarChar(50)
}

model wf_application_status {
  was_application_status_id   Int       @id @default(autoincrement())
  was_application_id          String    @db.VarChar(100)
  was_process_id              Int
  was_workflow_code           String?   @db.VarChar(20)
  was_status                  String    @db.VarChar(100)
  was_status_reason           String?   @db.VarChar(100)
  was_notes                   String?   @db.VarChar(4000)
  was_sequence                Int
  was_createdby_position_code String?   @db.VarChar(30)
  was_extended_field          Json?
  createddate                 DateTime? @default(now()) @db.DateTime(0)
  createdby                   String?   @db.VarChar(100)
  updateddate                 DateTime? @db.DateTime(0)
  updatedby                   String?   @db.VarChar(100)
  was_createdby_ptj           String?   @db.VarChar(50)
  stf_staff_id                String?   @db.VarChar(45)
  stf_ad_username             String?   @db.VarChar(45)
  was_task_id                 Int?

  @@unique([was_application_id, was_process_id, was_sequence], map: "uq_application_status_01")
  @@index([was_workflow_code], map: "ind_app_status_01")
  @@index([createdby], map: "ind_was_createdby_02")
  @@index([was_process_id], map: "was_process_id")
}


model wf_authorized_role {
  war_authorized_role_id Int        @id @default(autoincrement())
  war_process_id         Int
  war_group_code         String     @db.VarChar(100)
  war_limit_min          Decimal?   @db.Decimal(15, 2)
  war_limit_max          Decimal?   @db.Decimal(15, 2)
  createddate            DateTime?  @default(now()) @db.DateTime(0)
  createdby              String?    @db.VarChar(100)
  updateddate            DateTime?  @default(now()) @db.DateTime(0)
  updatedby              String?    @db.VarChar(100)
  wf_process             wf_process @relation(fields: [war_process_id], references: [wfp_process_id], onDelete: Cascade, map: "fk_war_process_id")

  @@index([war_process_id], map: "fk_war_process_id")
}


model wf_dashboard {
  wfd_id            Int    @id @default(autoincrement())
  wfd_order         Int    @default(0)
  wfd_group         String @db.VarChar(45)
  wfd_label         String @db.VarChar(55)
  wfd_workflow_code String @db.VarChar(4000)
}


model wf_lookup {
  wfl_code       String    @id @db.VarChar(45)
  wfl_desc       String    @db.VarChar(45)
  wfl_isPositive String    @default("Y") @db.VarChar(1)
  wfl_order      Int?
  createddate    DateTime? @default(now()) @db.DateTime(0)
  createdby      String?   @db.VarChar(45)
  updateddate    DateTime? @db.DateTime(0)
  updatedby      String?   @db.VarChar(45)
}


model wf_notification {
  wnt_noti_id        Int       @id
  wnt_vendor_code    String?   @db.VarChar(50)
  wnt_subject        String?   @db.VarChar(500)
  wnt_message        String?   @db.VarChar(2000)
  wnt_start_date     DateTime? @db.DateTime(0)
  wnt_end_date       DateTime? @db.DateTime(0)
  wnt_status         String?   @db.VarChar(20)
  wnt_file_id        String?   @db.VarChar(45)
  wnt_extended_field Json?
  createddate        DateTime? @default(now()) @db.DateTime(0)
  createdby          String?   @db.VarChar(100)
  updateddate        DateTime? @db.DateTime(0)
  updatedby          String?   @db.VarChar(100)

  @@index([wnt_vendor_code], map: "wnt_index_01")
}


model wf_notification_byemail {
  wne_noti_id        Int       @id
  wne_vendor_code    String?   @db.VarChar(50)
  wne_email          String?   @db.VarChar(100)
  wne_subject        String?   @db.VarChar(500)
  wne_message        String?   @db.VarChar(2000)
  wne_send_date      DateTime? @db.DateTime(0)
  wne_status         String?   @db.VarChar(20)
  wne_file_id        String?   @db.VarChar(45)
  wne_extended_field Json?
  createddate        DateTime? @default(now()) @db.DateTime(0)
  createdby          String?   @db.VarChar(100)
  updateddate        DateTime? @db.DateTime(0)
  updatedby          String?   @db.VarChar(100)

  @@unique([wne_vendor_code, wne_email, wne_subject], map: "wnt_unique_01")
  @@index([wne_vendor_code], map: "wnt_index_01")
}


model wf_process {
  wfp_process_id             Int                  @id @default(autoincrement())
  wfp_workflow_code          String?              @db.VarChar(20)
  wfp_process_name           String               @db.VarChar(500)
  wfp_process_desc_bm        String?              @db.VarChar(1000)
  wfp_process_desc_bi        String?              @db.VarChar(1000)
  wfp_sequence               Int
  wfp_status                 String               @db.VarChar(20)
  wfp_is_email_notification  Int?                 @default(1)
  wfp_is_todo_notification   Int?                 @default(1)
  wfp_is_by_unit             Int?
  wfp_is_by_ptj              Int?
  wfp_extended_field         Json?
  createddate                DateTime?            @default(now()) @db.DateTime(0)
  createdby                  String?              @db.VarChar(100)
  updateddate                DateTime?            @db.DateTime(0)
  updatedby                  String?              @db.VarChar(100)
  wfp_duration_kpi           Int?
  wfp_duration_kpi_withquery Int?
  wfp_is_allow_query         Int?
  wfp_processedby_desc       String?              @db.VarChar(250)
  wf_authorized_role         wf_authorized_role[]
  wf_workflow_name           wf_workflow_name?    @relation(fields: [wfp_workflow_code], references: [wfa_workflow_code], onDelete: Cascade, map: "fk_wfp_workflow_code")
  wf_process_details         wf_process_details[]
  wf_task                    wf_task[]

  @@unique([wfp_workflow_code, wfp_process_name, wfp_sequence], map: "uq_process_01")
  @@index([wfp_workflow_code], map: "fk_workflowname_01")
}


model wf_process_details {
  wpd_process_details_id Int        @id @default(autoincrement())
  wpd_process_id         Int
  wpd_status_code        String?    @db.VarChar(20)
  wpd_reroute_process    Int?
  wpd_proc_to_exec       String?    @db.VarChar(255)
  wpd_order              Int?
  wpd_extended_field     Json?
  createddate            DateTime?  @default(now()) @db.DateTime(0)
  createdby              String?    @db.VarChar(100)
  updateddate            DateTime?  @db.DateTime(0)
  updatedby              String?    @db.VarChar(100)
  wf_process             wf_process @relation(fields: [wpd_process_id], references: [wfp_process_id], onDelete: Cascade, map: "fk_wpd_process_id")

  @@unique([wpd_process_id, wpd_status_code], map: "un_process_details_01")
}

model wf_subapplication_status {
  wss_id                Int       @id @default(autoincrement())
  wss_application_id    String    @db.VarChar(100)
  wss_process_id        Int
  wss_subapplication_id Int?
  was_staff_id          String?   @db.VarChar(20)
  was_task_id           Int?
  wss_status            String    @db.VarChar(100)
  wss_notes             String?   @db.VarChar(505)
  wss_sequence          Int
  wss_extended_field    Json?
  createddate           DateTime? @default(now()) @db.DateTime(0)
  createdby             String?   @db.VarChar(100)
  updateddate           DateTime? @db.DateTime(0)
  updatedby             String?   @db.VarChar(100)

  @@unique([wss_application_id, wss_process_id, wss_subapplication_id, was_task_id], map: "uq_subapplication_01")
}


model wf_task {
  wtk_task_id        Int        @id @default(autoincrement())
  wtk_process_id     Int
  wtk_application_id String?    @db.VarChar(100)
  wtk_workflow_code  String     @db.VarChar(20)
  wtk_task_name      String     @db.VarChar(3000)
  wtk_task_url       String?    @db.VarChar(500)
  wtk_staff_id       String     @db.VarChar(20)
  wtk_status         String     @db.VarChar(20)
  wtk_sequence       Int?
  wtk_is_accessing   String?    @db.VarChar(1)
  wtk_extended_field Json?
  createddate        DateTime?  @default(now()) @db.DateTime(0)
  createdby          String?    @db.VarChar(100)
  updateddate        DateTime?  @db.DateTime(0)
  updatedby          String?    @db.VarChar(100)
  wtk_accepteddate   DateTime?  @db.DateTime(0)
  wf_process         wf_process @relation(fields: [wtk_process_id], references: [wfp_process_id], onDelete: NoAction, onUpdate: NoAction, map: "wtk_process_id")

  @@index([wtk_process_id], map: "fk_task_01_idx")
  @@index([wtk_status], map: "ind_task_01")
  @@index([wtk_application_id], map: "ind_task_02")
  @@index([wtk_staff_id], map: "ind_task_03")
}

model wf_unit {
  wfu_id       Int       @id @default(autoincrement())
  wfu_unit     String    @db.VarChar(45)
  wfu_staff_id String    @default("-999") @db.VarChar(20)
  createddate  DateTime? @default(now()) @db.DateTime(0)
  createdby    String?   @db.VarChar(45)
  updateddate  DateTime? @db.DateTime(0)
  updatedby    String?   @db.VarChar(45)

  @@unique([wfu_unit, wfu_staff_id], map: "UNIQUE")
}


model wf_workflow_name {
  wfa_workflow_code        String       @id @db.VarChar(20)
  wfa_workflow_title       String       @db.VarChar(1000)
  wfa_prevent_self_process Int?
  wfa_involve_posting      Int          @default(1)
  createddate              DateTime?    @default(now()) @db.DateTime(0)
  createdby                String?      @db.VarChar(100)
  updateddate              DateTime?    @db.DateTime(0)
  updatedby                String?      @db.VarChar(100)
  wfa_no_workflow_process  Int?
  wf_process               wf_process[]
}

model role {
  roleID           Int        @id @default(autoincrement())
  roleName         String?    @db.VarChar(255)
  roleDescription  String?    @db.VarChar(255)
  roleStatus       String?    @db.VarChar(255)
  roleCreatedDate  DateTime?  @db.DateTime(0)
  roleModifiedDate DateTime?  @db.DateTime(0)
  userrole         userrole[]
}

model user {
  userID           Int        @id @default(autoincrement())
  userSecretKey    String?    @db.VarChar(255)
  userUsername     String?    @db.VarChar(255)
  userPassword     String?    @db.VarChar(255)
  userFullName     String?    @db.VarChar(255)
  userEmail        String?    @db.VarChar(255)
  userPhone        String?    @db.VarChar(255)
  userStatus       String?    @db.VarChar(255)
  userCreatedDate  DateTime?  @db.DateTime(0)
  userModifiedDate DateTime?  @db.DateTime(0)
  userrole         userrole[]
}

model userrole {
  userRoleID          Int      @id @default(autoincrement())
  userRoleUserID      Int      @default(0)
  userRoleRoleID      Int      @default(0)
  userRoleCreatedDate DateTime @db.DateTime(0)
  role                role     @relation(fields: [userRoleRoleID], references: [roleID], onDelete: NoAction, onUpdate: NoAction, map: "FK_userrole_role")
  user                user     @relation(fields: [userRoleUserID], references: [userID], onDelete: NoAction, onUpdate: NoAction, map: "FK_userrole_user")

  @@index([userRoleRoleID], map: "FK_userrole_role")
  @@index([userRoleUserID], map: "FK_userrole_user")
}

model bills_master {
  bim_bills_id              Int       @id
  bim_bills_no              String?   @unique(map: "bills_master_uq01") @db.VarChar(50)
  bim_bills_desc            String?   @db.VarChar(500)
  bim_bills_type            String?   @db.VarChar(30)
  grm_receive_no            String?   @db.VarChar(30)
  ccr_costcentre            String?   @db.VarChar(20)
  oun_code                  String?   @db.VarChar(20)
  pom_order_no              String?   @db.VarChar(30)
  bim_cust_do_no            String?   @db.VarChar(200)
  bim_cust_invoice_no       String?   @db.VarChar(4000)
  bim_cust_invoice_date     DateTime? @db.DateTime(0)
  vcs_vendor_code           String?   @db.VarChar(15)
  bim_voucher_no            String?   @db.VarChar(30)
  bim_bill_amt              Decimal?  @db.Decimal(15, 2)
  bim_status                String?   @db.VarChar(10)
  bim_approve_by            String?   @db.VarChar(20)
  bim_approve_date          DateTime? @db.DateTime(0)
  bim_cancel_by             String?   @db.VarChar(45)
  bim_cancel_date           DateTime? @db.DateTime(0)
  bim_notice_count          String?   @db.VarChar(3)
  bim_payto_id              String?   @db.VarChar(30)
  bim_payto_type            String?   @db.VarChar(10)
  bim_payto_name            String?   @db.VarChar(100)
  bim_payto_bank_name       String?   @db.VarChar(100)
  bim_payto_bank_no         String?   @db.VarChar(60)
  bim_payto_address         String?   @db.VarChar(500)
  bim_contact_person        String?   @db.VarChar(250)
  bim_notice_reference      String?   @db.VarChar(50)
  bim_reference             String?   @db.VarChar(30)
  bim_received_date         DateTime? @db.DateTime(0)
  bim_return_date           DateTime? @db.DateTime(0)
  bim_return_by             String?   @db.VarChar(10)
  bim_received_by           String?   @db.VarChar(50)
  bim_recommend_by          String?   @db.VarChar(10)
  bim_recommend_date        DateTime? @db.DateTime(0)
  pmt_posting_no            String?   @db.VarChar(20)
  pmt_posting_no_cancel     String?   @db.VarChar(50)
  bim_cancel_reason         String?   @db.VarChar(300)
  bim_invoice_received_date DateTime? @db.DateTime(0)
  bim_total_tax             Decimal?  @db.Decimal(15, 2)
  bim_conversion_rate       Decimal?  @db.Decimal(15, 4)
  bim_currency_unit         Decimal?  @db.Decimal(10, 2)
  bim_currency_code         String?   @db.VarChar(10)
  bim_rate_type             String?   @db.VarChar(10)
  bim_ent_amt               Decimal?  @db.Decimal(15, 4)
  bim_extended_field        Json?
  createddate               DateTime? @default(now()) @db.DateTime(0)
  createdby                 String?   @db.VarChar(250)
  updateddate               DateTime? @default(now()) @db.DateTime(0)
  updatedby                 String?   @db.VarChar(250)
  org_code                  String?   @db.VarChar(20)
  bim_status_ifas           String?   @db.VarChar(100)
  bim_system_id             String?   @db.VarChar(20)
  rqm_requisition_no        String?   @db.VarChar(30)
  bim_voucher_no_old        String?   @db.VarChar(30)
  bim_payee_count           String?   @db.VarChar(45)
  crn_credit_note_note      String?   @db.VarChar(30)
  bim_bill_date             DateTime? @db.DateTime(0)
  pmt_posting_no_knockoff   String?   @db.VarChar(20)
  bim_knockoff_reason       String?   @db.VarChar(300)
  bim_knockoff_by           String?   @db.VarChar(45)
  bim_knockoff_date         DateTime? @db.DateTime(0)

  @@index([pom_order_no], map: "bim_index_03")
  @@index([rqm_requisition_no], map: "bim_index_04")
  @@index([bim_voucher_no_old], map: "bim_voucher_no")
  @@index([bim_bills_no], map: "ind_bills_01")
  @@index([bim_invoice_received_date], map: "ind_bim_invoice_received_date")
}



model goods_receive_details {
  grd_goods_receive_id    Int                  @id
  grm_receive_id          Int
  grd_line_no             Int?
  pom_order_no            String?              @db.VarChar(30)
  pom_line_no             Decimal?             @db.Decimal(8, 0)
  grd_order_qty           Decimal?             @db.Decimal(15, 2)
  grd_receive_qty         Decimal?             @db.Decimal(15, 2)
  grd_reject_qty          Decimal?             @db.Decimal(15, 2)
  grd_order_amt           Decimal?             @db.Decimal(15, 4)
  grd_receive_amt         Decimal?             @db.Decimal(16, 3)
  grd_status              String?              @db.VarChar(10)
  grd_crnote_amt          Decimal?             @db.Decimal(15, 2)
  grd_trans_type          String?              @db.VarChar(10)
  grd_taxcode             String?              @db.VarChar(10)
  grd_taxpct              Decimal?             @db.Decimal(6, 2)
  grd_taxamt              Decimal?             @db.Decimal(15, 4)
  grd_receive_amt_rm      Decimal?             @db.Decimal(15, 4)
  grd_invoiced            Decimal?             @db.Decimal(15, 2)
  fty_fund_type           String?              @db.VarChar(20)
  acm_acct_code           String?              @db.VarChar(10)
  oun_code                String?              @db.VarChar(20)
  ccr_costcentre          String?              @db.VarChar(20)
  grd_extended_field      Json?
  createddate             DateTime?            @default(now()) @db.DateTime(0)
  createdby               String?              @db.VarChar(250)
  updateddate             DateTime?            @db.DateTime(0)
  updatedby               String?              @db.VarChar(250)
  grd_taxamt_po           Decimal?             @db.Decimal(15, 4)
  at_activity_code        String?              @db.VarChar(20)
  so_code                 String?              @db.VarChar(30)
  cpa_project_no          String?              @db.VarChar(30)
  at_activity_code_budget String?              @db.VarChar(20)
  ccr_costcentre_budget   String?              @db.VarChar(20)
  grd_store_ckin_flag     String?              @db.VarChar(1)
  cascading_old           String?              @db.VarChar(100)
  acm_acct_code_old       String?              @db.VarChar(10)
  grd_item_desc           String?              @db.VarChar(4000)
  grd_unit_price          Decimal?             @db.Decimal(15, 4)
  grd_taxamt_rm           Decimal?             @db.Decimal(15, 4)
  grd_unit_price_rm       Decimal?             @db.Decimal(15, 4)
  account_main            account_main?        @relation(fields: [acm_acct_code], references: [acm_acct_code], onDelete: Restrict, onUpdate: Restrict, map: "fk__acm_acct_code_41")
  goods_receive_master    goods_receive_master @relation(fields: [grm_receive_id], references: [grm_receive_id], onUpdate: Restrict, map: "fk_reference_39")

  @@unique([grm_receive_id, pom_order_no, pom_line_no], map: "goods_rceive_detl_uq01")
  @@index([acm_acct_code], map: "fk__acm_acct_code_41")
}


model goods_receive_master {
  grm_receive_id         Int                     @id
  grm_receive_no         String?                 @unique(map: "goods_rceive_mas_uq01") @db.VarChar(30)
  org_code               String?                 @db.VarChar(20)
  pom_order_no           String?                 @db.VarChar(30)
  grm_receive_date       DateTime?               @db.DateTime(0)
  grm_approve_by         String?                 @db.VarChar(20)
  grm_approve_date       DateTime?               @db.DateTime(0)
  grm_cancel_by          String?                 @db.VarChar(50)
  grm_cancel_date        DateTime?               @db.DateTime(0)
  grm_total_amt          Decimal?                @db.Decimal(15, 4)
  grm_status             String?                 @db.VarChar(10)
  grm_reference_doc      String?                 @db.VarChar(100)
  pmt_posting_no         String?                 @db.VarChar(20)
  grm_type               String?                 @db.VarChar(10)
  grm_currency_code      String?                 @db.VarChar(10)
  grm_conversion_rate    Decimal?                @db.Decimal(15, 6)
  grm_exchange_type_code String?                 @db.VarChar(10)
  grm_total_amt_rm       Decimal?                @db.Decimal(15, 4)
  grm_currency_unit      Decimal?                @db.Decimal(10, 2)
  grm_extended_field     Json?
  createddate            DateTime?               @default(now()) @db.DateTime(0)
  createdby              String?                 @db.VarChar(250)
  updateddate            DateTime?               @db.DateTime(0)
  updatedby              String?                 @db.VarChar(250)
  grm_cancel_remark      String?                 @db.VarChar(100)
  bim_bills_no           String?                 @db.VarChar(30)
  grm_cancel_status      String?                 @db.VarChar(10)
  grm_is_store           String?                 @db.VarChar(5)
  vcs_vendor_code        String?                 @db.VarChar(45)
  grm_create_date        DateTime?               @db.DateTime(0)
  goods_receive_details  goods_receive_details[]
}


model item_main {
  itm_item_id          Int           @id
  itm_item_code        String        @unique(map: "itm_item_code_UNIQUE") @db.VarChar(20)
  itm_item_desc        String?       @db.VarChar(500)
  acm_acct_code        String?       @db.VarChar(10)
  itm_reorder_level    Decimal?      @db.Decimal(15, 2)
  itm_item_code_parent String?       @db.VarChar(100)
  itm_category_code    String?       @db.VarChar(20)
  isc_subcategory_code String?       @db.VarChar(100)
  iss_subsiri_code     String?       @db.VarChar(100)
  itm_measure_code     String?       @db.VarChar(20)
  itm_status           String?       @db.VarChar(20)
  itm_level            Decimal?      @db.Decimal(2, 0)
  itm_unit_price       Decimal?      @db.Decimal(15, 2)
  itm_asset_curr_no    Decimal?      @db.Decimal(5, 0)
  itm_est_price        Decimal?      @db.Decimal(17, 2)
  itm_store_item_flag  String?       @db.VarChar(1)
  itm_extended_field   Json?
  createddate          DateTime?     @default(now()) @db.DateTime(0)
  createdby            String?       @db.VarChar(250)
  updateddate          DateTime?     @db.DateTime(0)
  updatedby            String?       @db.VarChar(250)
  ismigration          String?       @db.VarChar(1)
  itm_source           String?       @db.VarChar(10)
  acm_acct_code_old    String?       @db.VarChar(10)
  itm_myfislite_flag   String?       @db.VarChar(1)
  itm_item_desceng     String?       @db.VarChar(250)
  account_main         account_main? @relation(fields: [acm_acct_code], references: [acm_acct_code], onDelete: Restrict, onUpdate: Restrict, map: "fk__acm_acct_code_74")

  @@index([acm_acct_code], map: "fk__acm_acct_code_74")
  @@index([itm_item_code, itm_item_desc, acm_acct_code], map: "item_main_idx")
}

model item_subcategory {
  isc_subcategory_id      Int
  isc_subcategory_code    String    @db.VarChar(100)
  isc_subcategory_desc    String?   @db.VarChar(250)
  isc_subcategory_desceng String?   @db.VarChar(250)
  acm_acct_code           String?   @db.VarChar(10)
  isc_category_code       String    @db.VarChar(100)
  isc_status              String?   @db.VarChar(10)
  isc_extended_field      Json?
  createddate             DateTime? @default(now()) @db.DateTime(0)
  createdby               String?   @db.VarChar(250)
  updateddate             DateTime? @db.DateTime(0)
  updatedby               String?   @db.VarChar(250)
  ismigration             String?   @db.VarChar(1)
  stf_staff_id            String?   @db.VarChar(45)
  stf_staff_id_superior   String?   @db.VarChar(45)
  stf_staff_id_hod        String?   @db.VarChar(45)
  isc_type                String?   @db.VarChar(45)

  @@id([isc_subcategory_id, isc_subcategory_code, isc_category_code])
  @@unique([isc_subcategory_code, isc_category_code], map: "isc_subcategory_code_UNIQUE")
}

model item_subsiri {
  iss_subsiri_id       Int
  iss_subsiri_code     String    @db.VarChar(100)
  iss_subsiri_desc     String?   @db.VarChar(250)
  acm_acct_code        String?   @db.VarChar(10)
  isc_subcategory_code String    @db.VarChar(100)
  iss_category_code    String    @db.VarChar(100)
  iss_status           String?   @db.VarChar(10)
  iss_extended_field   Json?
  createddate          DateTime? @default(now()) @db.DateTime(0)
  createdby            String?   @db.VarChar(250)
  updateddate          DateTime? @db.DateTime(0)
  updatedby            String?   @db.VarChar(250)
  ismigration          String?   @db.VarChar(1)
  iss_subsiri_desceng  String?   @db.VarChar(250)

  @@id([iss_subsiri_id, isc_subcategory_code, iss_category_code, iss_subsiri_code])
  @@unique([iss_subsiri_code, isc_subcategory_code, iss_category_code], map: "iss_subsiri_code_UNIQUE")
}



model purchase_order_details {
  pod_order_detl_id           Int                    @id
  pom_order_id                Int?
  rqm_requisition_no          String?                @db.VarChar(30)
  bdg_budget_code             String                 @db.VarChar(10)
  am_account_code             String                 @db.VarChar(10)
  pod_line_no                 Decimal                @db.Decimal(8, 0)
  itm_item_code               String?                @db.VarChar(100)
  oun_code                    String?                @db.VarChar(20)
  pod_order_qty               Decimal?               @db.Decimal(15, 2)
  pod_unit_price              Decimal?               @db.Decimal(15, 4)
  pod_gross_amt               Decimal?               @db.Decimal(15, 4)
  pod_discount                Decimal?               @db.Decimal(15, 2)
  pod_total_amt               Decimal?               @db.Decimal(15, 4)
  pod_total_invoiced          Decimal?               @db.Decimal(15, 2)
  pod_total_paid              Decimal?               @db.Decimal(15, 2)
  pod_item_spec               String?                @db.VarChar(4000)
  pod_status                  String?                @db.VarChar(30)
  pod_request_no              String?                @db.VarChar(30)
  pod_received_qty            Decimal?               @db.Decimal(15, 2)
  pod_uom                     String?                @db.VarChar(10)
  pod_crnote_amt              Decimal?               @db.Decimal(17, 2)
  pod_lib_seq                 String?                @db.VarChar(20)
  so_code                     String?                @db.VarChar(30)
  cpa_project_no              String?                @db.VarChar(30)
  pod_pakej_no                Decimal?               @db.Decimal(8, 0)
  itm_item_no                 Decimal?               @db.Decimal(5, 0)
  pod_brand                   String?                @db.VarChar(100)
  cny_country_code            String?                @db.VarChar(20)
  pod_taxcode                 String?                @db.VarChar(10)
  pod_taxpct                  Decimal?               @db.Decimal(6, 2)
  pod_taxamt                  Decimal?               @db.Decimal(15, 4)
  ccr_costcentre              String?                @db.VarChar(20)
  pod_ccr_costcentre_budget   String?                @db.VarChar(10)
  fty_fund_type               String?                @db.VarChar(20)
  at_activity_code            String?                @db.VarChar(10)
  pod_at_activity_code_budget String?                @db.VarChar(10)
  sbg_budget_id               Int?
  pod_ent_amt                 Decimal?               @db.Decimal(15, 4)
  pod_total_amtrm             Decimal?               @db.Decimal(15, 4)
  pod_req_no                  String?                @db.VarChar(45)
  pod_extended_field          Json?
  createddate                 DateTime?              @default(now()) @db.DateTime(0)
  createdby                   String?                @db.VarChar(250)
  updateddate                 DateTime?              @db.DateTime(0)
  updatedby                   String?                @db.VarChar(250)
  rqd_requisition_id          Int?
  pod_flag_manual             String?                @db.VarChar(1)
  pod_cn_amount_ent           Decimal?               @db.Decimal(15, 4)
  pod_cn_amount               Decimal?               @db.Decimal(15, 4)
  cascading_old               String?                @db.VarChar(100)
  acm_acct_code_old           String?                @db.VarChar(10)
  bdg_budget_code_old         String?                @db.VarChar(10)
  cpa_project_no_old          String?                @db.VarChar(100)
  pod_status_old              String?                @db.VarChar(45)
  pod_taxamt_rm               Decimal?               @db.Decimal(15, 4)
  pod_unit_price_rm           Decimal?               @db.Decimal(15, 4)
  purchase_order_master       purchase_order_master? @relation(fields: [pom_order_id], references: [pom_order_id], onDelete: Restrict, onUpdate: Restrict, map: "fk_reference_36")

  @@unique([pom_order_id, pod_line_no], map: "pod_unique")
  @@index([pom_order_id], map: "fk_reference_36_idx")
  @@index([rqm_requisition_no], map: "purchase_order_details_fk01")
  @@index([rqd_requisition_id], map: "uq_pod_37_idx")
}

model purchase_order_master {
  pom_order_id           Int                      @id
  pom_order_no           String?                  @unique(map: "po_master_uq01") @db.VarChar(30)
  pom_requisition_no     String?                  @db.VarChar(30)
  pom_retrieve_type      String?                  @db.VarChar(45)
  org_code               String?                  @db.VarChar(20)
  vcs_vendor_code        String?                  @db.VarChar(20)
  pom_approve_by         String?                  @db.VarChar(100)
  pom_approve_date       DateTime?                @db.DateTime(0)
  pom_cancel_by          String?                  @db.VarChar(100)
  pom_cancel_date        DateTime?                @db.DateTime(0)
  pom_gross_amt          Decimal?                 @db.Decimal(15, 4)
  pom_discount_amt       Decimal?                 @db.Decimal(15, 2)
  pom_order_amt          Decimal?                 @db.Decimal(15, 4)
  pom_total_paid         Decimal?                 @db.Decimal(15, 2)
  pom_total_invoiced     Decimal?                 @db.Decimal(15, 2)
  pom_order_status       String?                  @db.VarChar(20)
  pom_wflow_sts          String?                  @db.VarChar(10)
  pom_wflow_type         String?                  @db.VarChar(30)
  pom_wflow_sts_old      String?                  @db.VarChar(20)
  pom_order_type         String?                  @db.VarChar(10)
  pom_method             String?                  @db.VarChar(20)
  pom_ref_doc            String?                  @db.VarChar(100)
  pom_doc_receive_date   DateTime?                @db.DateTime(0)
  pom_print_flag         String?                  @db.VarChar(1)
  pom_print_batch        String?                  @db.VarChar(10)
  pom_description        String?                  @db.VarChar(500)
  pom_request_by         String?                  @db.VarChar(100)
  pom_request_date       DateTime?                @db.DateTime(0)
  pom_available_date     DateTime?                @db.DateTime(0)
  pom_attachment         String?                  @db.VarChar(1)
  pom_cancel_remark      String?                  @db.VarChar(500)
  pom_address            String?                  @db.VarChar(500)
  pom_shipto_id          Int?
  pom_verify_by          String?                  @db.VarChar(100)
  pom_verify_date        DateTime?                @db.DateTime(0)
  pom_acrual             String?                  @db.VarChar(2)
  cpa_project_no         String?                  @db.VarChar(30)
  pom_lib_type           String?                  @db.VarChar(1)
  pom_req_no             String?                  @db.VarChar(20)
  pom_campus             String?                  @db.VarChar(100)
  pom_total_tax          Decimal?                 @db.Decimal(15, 4)
  pom_currency_unit      Decimal?                 @db.Decimal(10, 2)
  pom_currency_code      String?                  @db.VarChar(10)
  pom_conversion_rate    Decimal?                 @db.Decimal(15, 6)
  pom_rate_type          String?                  @db.VarChar(10)
  pom_rate_date          DateTime?                @db.DateTime(0)
  pom_ent_amt            Decimal?                 @db.Decimal(15, 4)
  pom_exchange_type_code String?                  @db.VarChar(10)
  pom_order_amt_rm       Decimal?                 @db.Decimal(15, 4)
  pom_contact_person     String?                  @db.VarChar(250)
  pom_ifas_order_status  String?                  @db.VarChar(30)
  pom_request_by_name    String?                  @db.VarChar(200)
  pom_complete_by        String?                  @db.VarChar(100)
  pom_complete_date      DateTime?                @db.DateTime(0)
  pom_reject_by          String?                  @db.VarChar(100)
  pom_reject_date        DateTime?                @db.DateTime(0)
  pom_aggrement_no       String?                  @db.VarChar(45)
  pom_order_ref          String?                  @db.VarChar(20)
  pom_closing_year       String?                  @db.VarChar(4)
  pom_extended_field     Json?
  createddate            DateTime?                @default(now()) @db.DateTime(0)
  createdby              String?                  @db.VarChar(250)
  updateddate            DateTime?                @db.DateTime(0)
  updatedby              String?                  @db.VarChar(250)
  pom_cn_amount_ent      Decimal?                 @db.Decimal(15, 4)
  pom_cn_amount          Decimal?                 @db.Decimal(15, 4)
  pom_order_status_asal  String?                  @db.VarChar(50)
  purchase_order_details purchase_order_details[]

  @@index([pom_requisition_no], map: "po_master_ind01")
}


model requisition_details {
  rqd_requisition_id          Int
  rqm_requisition_id          Int
  rqd_line_no                 Decimal            @db.Decimal(8, 0)
  rqd_spec_desc               String?            @db.VarChar(4000)
  rqd_pakej_no                String?            @db.VarChar(8)
  rqd_item_no                 Decimal?           @db.Decimal(8, 0)
  rqd_spec_level              String?            @db.VarChar(3)
  rqd_spec_head               String?            @db.VarChar(100)
  itm_item_code               String?            @db.VarChar(100)
  rqd_qty                     String?            @db.VarChar(20)
  rqd_uom                     String?            @db.VarChar(20)
  rqd_price                   Decimal?           @db.Decimal(15, 4)
  rqd_gross_amt               Decimal?           @db.Decimal(15, 4)
  rqd_ent_amt                 Decimal?           @db.Decimal(15, 4)
  rqd_total_price             Decimal?           @db.Decimal(15, 4)
  rqd_total_price_rm          Decimal?           @db.Decimal(15, 4)
  org_code                    String?            @db.VarChar(20)
  fty_fund_type               String?            @db.VarChar(20)
  oun_code                    String?            @db.VarChar(20)
  at_activity_code            String?            @db.VarChar(10)
  ccr_costcentre              String?            @db.VarChar(20)
  so_code                     String?            @db.VarChar(10)
  cpa_project_no              String?            @db.VarChar(30)
  bdg_budget_code             String?            @db.VarChar(10)
  acm_acct_code               String?            @db.VarChar(20)
  rqd_ccr_costcentre_budget   String?            @db.VarChar(10)
  sbg_budget_id               Int?
  rqd_at_activity_code_budget String?            @db.VarChar(10)
  rqd_commit_amt              Decimal?           @db.Decimal(15, 2)
  rqd_vot                     String?            @db.VarChar(5)
  rqd_taxcode                 String?            @db.VarChar(10)
  rqd_taxpct                  Decimal?           @db.Decimal(6, 2)
  rqd_taxamt                  Decimal?           @db.Decimal(15, 4)
  rqd_status                  String?            @db.VarChar(100)
  rqd_extended_field          Json?
  createddate                 DateTime?          @default(now()) @db.DateTime(0)
  createdby                   String?            @db.VarChar(250)
  updateddate                 DateTime?          @db.DateTime(0)
  updatedby                   String?            @db.VarChar(250)
  pom_order_id                Int?
  cascading_old               String?            @db.VarChar(100)
  acm_acct_code_old           String?            @db.VarChar(10)
  bdg_budget_code_old         String?            @db.VarChar(10)
  cpa_project_no_old          String?            @db.VarChar(100)
  sbg_budget_id_old           Int?
  rqd_cn_amount_ent           Decimal?           @db.Decimal(15, 4)
  rqd_cn_amount               Decimal?           @db.Decimal(15, 2)
  rqd_taxamt_rm               Decimal?           @db.Decimal(15, 4)
  rqd_price_rm                Decimal?           @db.Decimal(15, 4)
  account_main                account_main?      @relation(fields: [acm_acct_code], references: [acm_acct_code], onDelete: Restrict, onUpdate: Restrict, map: "fk__acm_acct_code_61")
  requisition_master          requisition_master @relation(fields: [rqm_requisition_id], references: [rqm_requisition_id], onUpdate: Restrict, map: "fk_reference_73")

  @@id([rqm_requisition_id, rqd_requisition_id])
  @@index([acm_acct_code], map: "fk__acm_acct_code_61")
}


model requisition_master {
  rqm_requisition_id    Int                   @id
  rqm_requisition_no    String?               @unique(map: "requisition_master_uq01") @db.VarChar(30)
  org_code              String?               @db.VarChar(20)
  oun_code              String?               @db.VarChar(20)
  fty_fund_type         String?               @db.VarChar(20)
  ccr_costcentre        String                @db.VarChar(20)
  at_activity_code      String?               @db.VarChar(10)
  so_code               String?               @db.VarChar(10)
  cpa_project_no        String?               @db.VarChar(30)
  rqm_requisition_title String                @db.VarChar(4000)
  rqm_tender_scope      String?               @db.VarChar(1000)
  rqm_tender_type       String?               @db.VarChar(30)
  rqm_jenis_tender      String?               @db.VarChar(15)
  rqm_conversion_rate   Decimal?              @db.Decimal(15, 6)
  rqm_currency_unit     Decimal?              @db.Decimal(10, 2)
  rqm_currency_code     String?               @db.VarChar(10)
  rqm_rate_type         String?               @db.VarChar(10)
  rqm_rate_date         DateTime?             @db.DateTime(0)
  rqm_ent_amt           Decimal?              @db.Decimal(15, 4)
  rqm_amount            Decimal?              @db.Decimal(15, 4)
  rqm_total_gst         Decimal?              @db.Decimal(15, 4)
  rqm_balance_bdgt      Decimal?              @db.Decimal(9, 0)
  rqm_status            String?               @db.VarChar(20)
  rqm_wflow_sts         String?               @db.VarChar(10)
  rqm_wflow_type        String?               @db.VarChar(45)
  rqm_request_by        String?               @db.VarChar(250)
  rqm_request_date      DateTime?             @db.DateTime(0)
  rqm_verify_by         String?               @db.VarChar(20)
  rqm_verify_date       DateTime?             @db.DateTime(0)
  rqm_revise_by         String?               @db.VarChar(20)
  rqm_revise_date       DateTime?             @db.DateTime(0)
  rqm_ref_reject_revise Decimal?              @db.Decimal(8, 0)
  rqm_approve_by        String?               @db.VarChar(20)
  rqm_approve_date      DateTime?             @db.DateTime(0)
  rqm_reject_by         String?               @db.VarChar(20)
  rqm_reject_date       DateTime?             @db.DateTime(0)
  rqm_return_by         String?               @db.VarChar(20)
  rqm_return_date       DateTime?             @db.DateTime(0)
  rqm_cancel_by         String?               @db.VarChar(40)
  rqm_cancel_date       DateTime?             @db.DateTime(0)
  rqm_quotation_receive Decimal?              @db.Decimal(8, 0)
  rqm_start_date        DateTime?             @db.DateTime(0)
  rqm_end_date          DateTime?             @db.DateTime(0)
  rqm_tender_timer      String?               @db.VarChar(10)
  rqm_peti_timer        String?               @db.VarChar(10)
  rqm_tender_receive    Decimal?              @db.Decimal(8, 0)
  rqm_late_receive      Decimal?              @db.Decimal(8, 0)
  rqm_ref_no            String?               @db.VarChar(100)
  rqm_doc_receive_date  DateTime?             @db.DateTime(0)
  rqm_shipto_id         Int?
  rqm_contact_person    String?               @db.VarChar(100)
  rqm_flag_bill         String?               @db.VarChar(1)
  rqm_open              String?               @db.VarChar(10)
  rqm_bumiputera        String?               @db.VarChar(10)
  rqm_reg_no            String?               @db.VarChar(20)
  rqm_cctr_type         String?               @db.VarChar(20)
  rqm_multi_cctr        String?               @db.VarChar(2000)
  rqm_notice_count      Decimal?              @db.Decimal(8, 0)
  rqm_notice_reference  String?               @db.VarChar(50)
  rqm_cancel_remark     String?               @db.VarChar(500)
  rqm_extended_field    Json?
  createddate           DateTime?             @default(now()) @db.DateTime(0)
  createdby             String?               @db.VarChar(250)
  updateddate           DateTime?             @db.DateTime(0)
  updatedby             String?               @db.VarChar(250)
  rqm_isagreement_exist String?               @db.VarChar(5)
  rqm_agg_no            String?               @db.VarChar(20)
  rqm_wflow_sts_old     String?               @db.VarChar(10)
  rqm_multiple_pr       String?               @db.VarChar(45)
  rqm_status_asal       String?               @db.VarChar(50)
  cascading_old         String?               @db.VarChar(100)
  cpa_project_no_old    String?               @db.VarChar(100)
  rqm_bdg_allocated_amt Decimal?              @db.Decimal(15, 2)
  rqm_bdg_expenses_amt  Decimal?              @db.Decimal(15, 2)
  ppr_requisition_id    Int?
  rqm_cn_amount_ent     Decimal?              @db.Decimal(15, 4)
  rqm_cn_amount         Decimal?              @db.Decimal(15, 2)
  rqm_payee_code        String?               @db.VarChar(100)
  requisition_details   requisition_details[]
  tender_master         tender_master[]

  @@index([rqm_requisition_no], map: "ind_index_01")
}

model tender_answer {
  tas_id             Int       @id @default(autoincrement())
  tdm_tender_id      Int
  tas_cust_id        String    @db.VarChar(100)
  tas_status         String    @db.VarChar(100)
  tas_submit_date    DateTime? @db.DateTime(0)
  tas_extended_field Json?
  createddate        DateTime  @default(now()) @db.DateTime(0)
  createdby          String    @db.VarChar(100)
  updateddate        DateTime? @default(now()) @db.DateTime(0)
  updatedby          String?   @db.VarChar(100)

  @@unique([tdm_tender_id, tas_cust_id], map: "UNIQUE")
  @@index([tdm_tender_id], map: "tender_answer_tdm_tender_no_IDX")
}

model tender_briefing {
  tbr_briefing_id         Int            @id
  tdm_tender_id           Int?
  vcs_vendor_code         String?        @db.VarChar(20)
  vcs_vendor_name         String?        @db.VarChar(250)
  vcs_vendor_name_other   String?        @db.VarChar(250)
  vcs_registration_no     String?        @db.VarChar(250)
  vcs_kk_regno            String?        @db.VarChar(250)
  tbr_representative_name String?        @db.VarChar(250)
  tbr_briefing_start_date DateTime?      @db.DateTime(0)
  tbr_briefing_close_date DateTime?      @db.DateTime(0)
  tbr_briefing_start_peti DateTime?      @db.DateTime(0)
  tbr_briefing_close_peti DateTime?      @db.DateTime(0)
  tbr_briefing_ref_no     String?        @db.VarChar(200)
  tbr_address             String?        @db.VarChar(250)
  tbr_estimate_duration   String?        @db.VarChar(250)
  tbr_document_start_date DateTime?      @db.DateTime(0)
  tbr_document_close_date DateTime?      @db.DateTime(0)
  tbr_extended_field      Json?
  createddate             DateTime?      @default(now()) @db.DateTime(0)
  createdby               String?        @db.VarChar(250)
  updateddate             DateTime?      @db.DateTime(0)
  updatedby               String?        @db.VarChar(250)
  tender_master           tender_master? @relation(fields: [tdm_tender_id], references: [tdm_tender_id], onDelete: Restrict, onUpdate: Restrict, map: "fk_tender_briefing_01")

  @@index([tdm_tender_id], map: "fk_tender_briefing_01")
}

model tender_bumi_status {
  trf_id_ai          Int           @id @default(autoincrement())
  tdm_tender_id      Int
  trf_bumi_status    String        @db.VarChar(40)
  trf_extended_field Json?
  createddate        DateTime?     @default(now()) @db.DateTime(0)
  createdby          String?       @db.VarChar(250)
  updateddate        DateTime?     @db.DateTime(0)
  updatedby          String?       @db.VarChar(250)
  tender_master      tender_master @relation(fields: [tdm_tender_id], references: [tdm_tender_id], onUpdate: Restrict, map: "fk_tender_taraf_01")

  @@index([tdm_tender_id], map: "fk_tender_taraf_01")
}


model tender_committee {
  tdc_committee_id   Int            @id
  tdm_tender_id      Int?
  stf_staff_id       String?        @db.VarChar(20)
  tdc_position       String?        @db.VarChar(250)
  tdc_designation    String?        @db.VarChar(250)
  tdc_noic           String?        @db.VarChar(250)
  tdc_ptj            String?        @db.VarChar(250)
  tdc_member_type    String?        @db.VarChar(200)
  tdc_extended_field Json?
  createddate        DateTime?      @default(now()) @db.DateTime(0)
  createdby          String?        @db.VarChar(250)
  updateddate        DateTime?      @db.DateTime(0)
  updatedby          String?        @db.VarChar(250)
  tdc_pengerusi      String?        @db.VarChar(250)
  tdc_ajk            String?        @db.VarChar(250)
  tdc_ajk2           String?        @db.VarChar(250)
  tdc_ajk3           String?        @db.VarChar(250)
  tdc_ajk4           String?        @db.VarChar(250)
  tdc_ajk5           String?        @db.VarChar(250)
  tender_master      tender_master? @relation(fields: [tdm_tender_id], references: [tdm_tender_id], onDelete: Restrict, onUpdate: Restrict, map: "fk_tender_committee_01")

  @@index([tdm_tender_id], map: "fk_tender_committee_01")
}

model tender_evaluation {
  tde_evaluation_id                  Int       @id
  tdm_tender_id                      String?   @db.VarChar(30)
  tdm_evaluation_type                String?   @db.VarChar(100)
  tde_evaluate_chrmn_tech            String?   @db.VarChar(250)
  tde_evaluate_mem1_tech             String?   @db.VarChar(250)
  tde_evaluate_mem2_tech             String?   @db.VarChar(250)
  tde_evaluate_mem3_tech             String?   @db.VarChar(250)
  tde_evaluate_mem4_tech             String?   @db.VarChar(250)
  tde_evaluate_mem5_tech             String?   @db.VarChar(250)
  tde_evaluate_chrmn_price           String?   @db.VarChar(250)
  tde_evaluate_mem1_price            String?   @db.VarChar(250)
  tde_evaluate_mem2_price            String?   @db.VarChar(250)
  tde_evaluate_mem3_price            String?   @db.VarChar(250)
  tde_evaluate_mem4_price            String?   @db.VarChar(250)
  tde_evaluate_mem5_price            String?   @db.VarChar(250)
  tdm_evaluation_chairmain_techprice String?   @db.VarChar(250)
  tde_evaluate_mem1_techprice        String?   @db.VarChar(250)
  tde_evaluate_mem2_techprice        String?   @db.VarChar(250)
  tde_evaluate_mem3_techprice        String?   @db.VarChar(250)
  tde_evaluate_mem4_techprice        String?   @db.VarChar(250)
  tde_evaluate_mem5_techprice        String?   @db.VarChar(250)
  tde_extended_field                 Json?
  createddate                        DateTime? @default(now()) @db.DateTime(0)
  createdby                          String?   @db.VarChar(250)
  updateddate                        DateTime? @db.DateTime(0)
  updatedby                          String?   @db.VarChar(250)
  tde_evaluate_staffno               String?   @db.VarChar(500)
  tde_evaluate_noic                  String?   @db.VarChar(250)
  tde_evaluate_jawatan               String?   @db.VarChar(250)
  tde_evaluate_ptj                   String?   @db.VarChar(250)
  tde_evaluate_member_type           String?   @db.VarChar(10)
  tde_evaluate_committe_type         String?   @db.VarChar(50)
  tde_evaluate_member_status         String?   @db.VarChar(1)
}

model tender_evaluation_details {
  ted_evaluation_id                      Int       @id
  tde_evaluation_id                      String?   @db.VarChar(30)
  ted_evaluate_chrmnic_tech              String?   @db.VarChar(250)
  ted_evaluate_chrmnjwtn_tech            String?   @db.VarChar(250)
  ted_evaluate_chrmnptj_tech             String?   @db.VarChar(250)
  ted_evaluate_mem1ic_tech               String?   @db.VarChar(250)
  ted_evaluate_mem1jwtn_tech             String?   @db.VarChar(250)
  ted_evaluate_mem1ptj_tech              String?   @db.VarChar(250)
  ted_evaluate_mem2ic_tech               String?   @db.VarChar(250)
  ted_evaluate_mem2jwtn_tech             String?   @db.VarChar(250)
  ted_evaluate_mem2ptj_tech              String?   @db.VarChar(250)
  ted_evaluate_mem3ic_tech               String?   @db.VarChar(250)
  ted_evaluate_mem3jwtn_tech             String?   @db.VarChar(250)
  ted_evaluate_mem3ptj_tech              String?   @db.VarChar(250)
  ted_evaluate_mem4ic_tech               String?   @db.VarChar(250)
  ted_evaluate_mem4jwtn_tech             String?   @db.VarChar(250)
  ted_evaluate_mem4ptj_tech              String?   @db.VarChar(250)
  ted_evaluate_mem5ic_tech               String?   @db.VarChar(250)
  ted_evaluate_mem5jwtn_tech             String?   @db.VarChar(250)
  ted_evaluate_mem5ptj_tech              String?   @db.VarChar(250)
  ted_evaluate_chrmnic_price             String?   @db.VarChar(250)
  ted_evaluate_chrmnjwtn_price           String?   @db.VarChar(250)
  ted_evaluate_chrmnptj_price            String?   @db.VarChar(250)
  ted_evaluate_mem1ic_price              String?   @db.VarChar(250)
  ted_evaluate_mem1jwtn_price            String?   @db.VarChar(250)
  ted_evaluate_mem1ptj_price             String?   @db.VarChar(250)
  ted_evaluate_mem2ic_price              String?   @db.VarChar(250)
  ted_evaluate_mem2jwtn_price            String?   @db.VarChar(250)
  ted_evaluate_mem2ptj_price             String?   @db.VarChar(250)
  ted_evaluate_mem3ic_price              String?   @db.VarChar(250)
  ted_evaluate_mem3jwtn_price            String?   @db.VarChar(250)
  ted_evaluate_mem3ptj_price             String?   @db.VarChar(250)
  ted_evaluate_mem4ic_price              String?   @db.VarChar(250)
  ted_evaluate_mem4jwtn_price            String?   @db.VarChar(250)
  ted_evaluate_mem4ptj_price             String?   @db.VarChar(250)
  ted_evaluate_mem5ic_price              String?   @db.VarChar(250)
  ted_evaluate_mem5jwtn_price            String?   @db.VarChar(250)
  ted_evaluate_mem5ptj_price             String?   @db.VarChar(250)
  tdm_evaluation_chairmainic_techprice   String?   @db.VarChar(250)
  tdm_evaluation_chairmainjwtn_techprice String?   @db.VarChar(250)
  tdm_evaluation_chairmainptj_techprice  String?   @db.VarChar(250)
  ted_evaluate_mem1ic_techprice          String?   @db.VarChar(250)
  ted_evaluate_mem1jwtn_techprice        String?   @db.VarChar(250)
  ted_evaluate_mem1ptj_techprice         String?   @db.VarChar(250)
  ted_evaluate_mem2ic_techprice          String?   @db.VarChar(250)
  ted_evaluate_mem2jwtn_techprice        String?   @db.VarChar(250)
  ted_evaluate_mem2ptj_techprice         String?   @db.VarChar(250)
  ted_evaluate_mem3ic_techprice          String?   @db.VarChar(250)
  ted_evaluate_mem3jwtn_techprice        String?   @db.VarChar(250)
  ted_evaluate_mem3ptj_techprice         String?   @db.VarChar(250)
  ted_evaluate_mem4ic_techprice          String?   @db.VarChar(250)
  ted_evaluate_mem4jwtn_techprice        String?   @db.VarChar(250)
  ted_evaluate_mem4ptj_techprice         String?   @db.VarChar(250)
  ted_evaluate_mem5ic_techprice          String?   @db.VarChar(250)
  ted_evaluate_mem5jwtn_techprice        String?   @db.VarChar(250)
  ted_evaluate_mem5ptj_techprice         String?   @db.VarChar(250)
  ted_extended_field                     Json?
  createddate                            DateTime? @default(now()) @db.DateTime(0)
  createdby                              String?   @db.VarChar(250)
  updateddate                            DateTime? @db.DateTime(0)
  updatedby                              String?   @db.VarChar(250)
}


model tender_jobscope {
  tjs_id_ai             Int           @id @default(autoincrement())
  tdm_tender_id         Int
  tjs_jobscope_code     String        @db.VarChar(20)
  tjs_jobscope_category String        @db.VarChar(20)
  tjs_logic_code        String?       @db.VarChar(20)
  tjs_extended_field    Json?
  createddate           DateTime?     @default(now()) @db.DateTime(0)
  createdby             String?       @db.VarChar(250)
  updateddate           DateTime?     @db.DateTime(0)
  updatedby             String?       @db.VarChar(250)
  tender_master         tender_master @relation(fields: [tdm_tender_id], references: [tdm_tender_id], onUpdate: Restrict, map: "fk_tender_jobscope_01")

  @@index([tdm_tender_id], map: "fk_tender_jobscope_01")
}


model tender_master {
  tdm_tender_id           Int                  @id
  tdm_tender_no           String?              @db.VarChar(30)
  tdm_document            Bytes?               @db.Blob
  tdm_requestby           String?              @db.VarChar(245)
  tdm_requestdate         DateTime?            @db.DateTime(0)
  tdm_tender_method       String?              @db.VarChar(30)
  tdm_title               String?              @db.VarChar(3500)
  tdm_justification       String?              @db.VarChar(3500)
  tdm_status              String?              @db.VarChar(20)
  tdm_start_date          DateTime?            @db.DateTime(0)
  tdm_end_date            DateTime?            @db.DateTime(0)
  org_code                String?              @default("UUM") @db.VarChar(20)
  oun_code                String?              @db.VarChar(20)
  fty_fund_type           String?              @db.VarChar(20)
  ccr_costcentre          String?              @db.VarChar(20)
  at_activity_code        String?              @db.VarChar(10)
  so_code                 String?              @db.VarChar(10)
  cpa_project_no          String?              @db.VarChar(30)
  tdm_estimated_amount    Decimal?             @db.Decimal(15, 2)
  tdm_amount_doc          Decimal?             @db.Decimal(15, 2)
  tdm_commitee_note       String?              @db.VarChar(2000)
  tdm_ptj_rep             String?              @db.VarChar(250)
  tdm_pnp_officer         String?              @db.VarChar(250)
  tdm_finance_rep         String?              @db.VarChar(250)
  tdm_bumiputera          String?              @db.VarChar(10)
  tdm_terbuka             String?              @db.VarChar(10)
  tdm_tender_type         String?              @db.VarChar(30)
  tdm_tender_open_start   DateTime?            @db.DateTime(0)
  tdm_tender_open_close   DateTime?            @db.DateTime(0)
  tdm_verify_by           String?              @db.VarChar(250)
  tdm_verify_date         DateTime?            @db.DateTime(0)
  tdm_approve_by          String?              @db.VarChar(250)
  tdm_approve_date        DateTime?            @db.DateTime(0)
  tdm_reject_by           String?              @db.VarChar(250)
  tdm_reject_date         DateTime?            @db.DateTime(0)
  tdm_extended_field      Json?
  createddate             DateTime?            @default(now()) @db.DateTime(0)
  createdby               String?              @db.VarChar(250)
  updateddate             DateTime?            @db.DateTime(0)
  updatedby               String?              @db.VarChar(250)
  tdm_createddby_ptj      String?              @db.VarChar(20)
  tdm_briefing_start_peti DateTime?            @db.DateTime(0)
  tdm_briefing_close_peti DateTime?            @db.DateTime(0)
  tdm_briefing_ref_no     String?              @db.VarChar(45)
  tdm_address             String?              @db.VarChar(450)
  tdm_estimate_duration   String?              @db.VarChar(45)
  taklimat                String?              @db.VarChar(45)
  tdm_lawatan_tapak       String?              @db.VarChar(10)
  tdm_contact_person      String?              @db.VarChar(45)
  tdm_reason_cancel       String?              @db.VarChar(500)
  tdm_requisition_no      String?              @db.VarChar(45)
  tdm_evaluation_type     String?              @db.VarChar(45)
  tdm_evaluate_chrmn_tech String?              @db.VarChar(250)
  tdm_evaluate_mem1_tech  String?              @db.VarChar(250)
  tdm_notePeti            String?              @db.VarChar(250)
  tdm_service_from        DateTime?            @db.DateTime(0)
  tdm_service_to          DateTime?            @db.DateTime(0)
  tdm_bond_start          DateTime?            @db.DateTime(0)
  tdm_bond_end            DateTime?            @db.DateTime(0)
  tdm_bond_no             String?              @db.VarChar(50)
  tdm_bond_amount         Decimal?             @db.Decimal(15, 2)
  tdm_pengerusi           String?              @db.VarChar(250)
  tdm_setiausaha          String?              @db.VarChar(250)
  tdm_ajk                 String?              @db.VarChar(250)
  tdm_ajk2                String?              @db.VarChar(250)
  tdm_ajk3                String?              @db.VarChar(250)
  tdm_ajk4                String?              @db.VarChar(250)
  tdm_ajk5                String?              @db.VarChar(250)
  tdm_ajk_others          String?              @db.VarChar(250)
  tdm_no_rujukan          String?              @db.VarChar(250)
  tdm_tarikh_minit        DateTime?            @db.DateTime(0)
  tender_briefing         tender_briefing[]
  tender_bumi_status      tender_bumi_status[]
  tender_committee        tender_committee[]
  tender_jobscope         tender_jobscope[]
  requisition_master      requisition_master?  @relation(fields: [tdm_requisition_no], references: [rqm_requisition_no], onDelete: NoAction, onUpdate: NoAction, map: "fk_tender_master_01")
  tender_participant      tender_participant[]

  @@index([tdm_requisition_no], map: "fk_tender_master_01")
}

model tender_participant {
  tdp_participant_id      Int                       @id
  tdm_tender_id           Int?
  tds_vendor_category     String?                   @db.VarChar(20)
  vcs_vendor_code         String?                   @db.VarChar(20)
  vcs_vendor_name         String?                   @db.VarChar(100)
  tdp_amount              Decimal?                  @db.Decimal(15, 2)
  tdp_duration            String?                   @db.VarChar(10)
  tdp_selection           String?                   @db.VarChar(45)
  tdp_quotation_date      DateTime?                 @db.DateTime(0)
  tdp_bumi_status         String?                   @db.VarChar(20)
  tdp_received_date       DateTime?                 @db.DateTime(0)
  tdp_status              String?                   @db.VarChar(20)
  tdp_extended_field      Json?
  createddate             DateTime?                 @default(now()) @db.DateTime(0)
  createdby               String?                   @db.VarChar(250)
  updateddate             DateTime?                 @db.DateTime(0)
  updatedby               String?                   @db.VarChar(250)
  tdp_duration_type       String?                   @db.VarChar(20)
  tdp_note                String?                   @db.VarChar(4000)
  tdp_mark                String?                   @db.VarChar(4000)
  tdp_tenderer_Id         String?                   @db.VarChar(45)
  tdp_amount_tax          Decimal?                  @db.Decimal(15, 2)
  tdp_mark_pricing        String?                   @db.VarChar(250)
  tender_master           tender_master?            @relation(fields: [tdm_tender_id], references: [tdm_tender_id], onDelete: Restrict, onUpdate: Restrict, map: "fk_tender_participant_01")
  tender_selection_result tender_selection_result[]

  @@index([tdm_tender_id], map: "fk_tender_participant_01")
}

model tender_selection_result {
  tdsr_id                 Int                 @id
  tdp_participant_id      Int?
  tdsr_amount             Decimal?            @db.Decimal(15, 2)
  tdsr_selection_criteria String?             @db.VarChar(4000)
  tdsr_acceptance         String?             @db.VarChar(45)
  tdsr_document           String?             @db.VarChar(45)
  tdsr_extended_field     Json?
  tdsr_asas_perakuan      String?             @db.VarChar(4000)
  createddate             DateTime?           @default(now()) @db.DateTime(0)
  createdby               String?             @db.VarChar(250)
  updateddate             DateTime?           @db.DateTime(0)
  updatedby               String?             @db.VarChar(250)
  tender_participant      tender_participant? @relation(fields: [tdp_participant_id], references: [tdp_participant_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_tender_selection_result_02")

  @@index([tdp_participant_id], map: "fk_tender_selection_result_02")
}

model vend_category {
  vc_id                  Int                     @id
  vcs_vendor_code        String?                 @db.VarChar(20)
  vc_category_code       String?                 @db.VarChar(150)
  vc_extended_field      Json?
  createddate            DateTime?               @db.DateTime(0)
  createdby              String?                 @db.VarChar(250)
  updateddate            DateTime?               @db.DateTime(0)
  updatedby              String?                 @db.VarChar(250)
  vend_customer_supplier vend_customer_supplier? @relation(fields: [vcs_vendor_code], references: [vcs_vendor_code], onDelete: Restrict, onUpdate: Restrict, map: "fk01_vend_categoryr")

  @@unique([vcs_vendor_code, vc_category_code], map: "uq01_vend_category")
  @@index([vcs_vendor_code], map: "fk01_vend_category")
}


model vend_customer_supplier {
  vcs_id                  Int                   @id
  vcs_vendor_code         String                @unique(map: "vend_customer_supplier_uq01") @db.VarChar(20)
  vcs_vendor_name         String?               @db.VarChar(100)
  vcs_vendor_status       String?               @db.VarChar(10)
  vcs_iscreditor          String?               @db.VarChar(1)
  vcs_isdebtor            String?               @db.VarChar(1)
  vcs_contact_person      String?               @db.VarChar(100)
  vcs_tel_no              String?               @db.VarChar(50)
  vcs_fax_no              String?               @db.VarChar(30)
  vcs_address             String?               @db.VarChar(500)
  vcs_state               String?               @db.VarChar(40)
  cny_country_code        String?               @db.VarChar(20)
  vcs_postcode            String?               @db.VarChar(15)
  vcs_vendor_bank         String?               @db.VarChar(100)
  vcs_bank_accno          String?               @db.VarChar(30)
  vcs_paid_up_capital     Decimal?              @db.Decimal(19, 2)
  vcs_authorize_capital   Decimal?              @db.Decimal(19, 2)
  vcs_bumi_status         String?               @db.VarChar(30)
  vcs_registration_no     String?               @db.VarChar(25)
  vcs_pkk_regno           String?               @db.VarChar(25)
  vcs_pkk_expired_date    DateTime?             @db.DateTime(0)
  vcs_kk_regno            String?               @db.VarChar(25)
  vcs_kk_expired_date     DateTime?             @db.DateTime(0)
  vcs_reg_date            DateTime?             @db.DateTime(0)
  vcs_reg_exp_date        DateTime?             @db.DateTime(0)
  vcs_cert_printed        String?               @db.VarChar(30)
  vcs_cert_print_date     DateTime?             @db.DateTime(0)
  vcs_approve_by          String?               @db.VarChar(10)
  vcs_approve_date        DateTime?             @db.DateTime(0)
  vcs_sys_id              String?               @db.VarChar(10)
  vcs_email_address       String?               @db.VarChar(100)
  vcs_pkk_class           String?               @db.VarChar(10)
  vcs_company_category    String?               @db.VarChar(150)
  vcs_password            String?               @db.VarChar(20)
  vcs_reference_id        String?               @db.VarChar(20)
  vcs_pkk_civil_regno     String?               @db.VarChar(25)
  vcs_pkk_civil_expdate   DateTime?             @db.DateTime(0)
  vcs_pkk_civil_class     String?               @db.VarChar(10)
  vcs_cidb_regno          String?               @db.VarChar(25)
  vcs_cidb_expdate        DateTime?             @db.DateTime(0)
  vcs_cidb_class          String?               @db.VarChar(10)
  vcs_bank_branch         String?               @db.VarChar(100)
  vcs_username            String?               @db.VarChar(30)
  vcs_lib_code            String?               @db.VarChar(10)
  vcs_lib_type            String?               @db.VarChar(10)
  vcs_cidb_class2         String?               @db.VarChar(10)
  vcs_cidb_regno2         String?               @db.VarChar(25)
  vcs_cidb_expdate2       DateTime?             @db.DateTime(0)
  vcs_update_by           String?               @db.VarChar(10)
  vcs_update_date         DateTime?             @db.DateTime(0)
  vcs_blacklist_startdate DateTime?             @db.DateTime(0)
  vcs_blacklist_enddate   DateTime?             @db.DateTime(0)
  vcs_type_gov            String?               @db.VarChar(10)
  vcs_type_hotel          String?               @db.VarChar(10)
  vcs_position            String?               @db.VarChar(100)
  vcs_ic_no               String?               @db.VarChar(20)
  vcs_roc_exp_date        DateTime?             @db.DateTime(0)
  vcs_addr1               String?               @db.VarChar(300)
  vcs_addr2               String?               @db.VarChar(300)
  vcs_addr3               String?               @db.VarChar(300)
  vcs_town                String?               @db.VarChar(100)
  vcs_receive_doc_date    DateTime?             @db.DateTime(0)
  vcs_int_code            String?               @db.VarChar(100)
  vcs_old_ic_no           String?               @db.VarChar(20)
  vcs_pasport_no          String?               @db.VarChar(20)
  vcs_comp_reg_no         String?               @db.VarChar(20)
  vcs_tax_status          String?               @db.VarChar(1)
  vcs_tax_regno           String?               @db.VarChar(30)
  vcs_tax_no              String?               @db.VarChar(30)
  vcs_unv_reg_date        DateTime?             @db.DateTime(0)
  vcs_unv_req_exp_date    DateTime?             @db.DateTime(0)
  vcs_jompay_biller_code  String?               @db.VarChar(50)
  vcs_extended_field      Json?
  createddate             DateTime?             @default(now()) @db.DateTime(0)
  createdby               String?               @db.VarChar(250)
  updateddate             DateTime?             @db.DateTime(0)
  updatedby               String?               @db.VarChar(250)
  vcs_temp_code           String?               @db.VarChar(20)
  vcs_address2            String?               @db.VarChar(500)
  vcs_address3            String?               @db.VarChar(500)
  vcs_state2              String?               @db.VarChar(40)
  cny_country_code2       String?               @db.VarChar(20)
  vcs_postcode2           String?               @db.VarChar(15)
  vcs_town2               String?               @db.VarChar(100)
  vcs_epf_no              String?               @db.VarChar(25)
  vcs_socso_no            String?               @db.VarChar(25)
  vcs_reg_no_kpm          String?               @db.VarChar(25)
  vcs_reg_date_kpm        DateTime?             @db.DateTime(0)
  vcs_reg_expdate_kpm     DateTime?             @db.DateTime(0)
  vcs_ros_no              String?               @db.VarChar(25)
  vcs_tax_exemption       String?               @db.VarChar(30)
  vcs_biller_code         String?               @db.VarChar(20)
  vcs_resident_status     String?               @db.VarChar(45)
  vcs_business_type       String?               @db.VarChar(20)
  vend_category           vend_category[]
  vend_licence_mof        vend_licence_mof[]
  vend_licence_others     vend_licence_others[]
  vend_licence_ssm        vend_licence_ssm[]

  @@index([vcs_isdebtor], map: "ind_type_debtor")
}

model vend_licence_mof {
  vlm_id                 Int                     @id
  vcs_vendor_code        String?                 @db.VarChar(20)
  vlm_licence_code       String?                 @db.VarChar(150)
  vlm_extended_field     Json?
  createddate            DateTime?               @db.DateTime(0)
  createdby              String?                 @db.VarChar(250)
  updateddate            DateTime?               @db.DateTime(0)
  updatedby              String?                 @db.VarChar(250)
  vend_customer_supplier vend_customer_supplier? @relation(fields: [vcs_vendor_code], references: [vcs_vendor_code], onDelete: Restrict, onUpdate: Restrict, map: "fk01_vend_licence_mof")

  @@index([vcs_vendor_code], map: "fk01_vend_licence_mof")
}

model vend_licence_others {
  vlo_id                 Int                     @id
  vcs_vendor_code        String?                 @db.VarChar(20)
  vlo_licence_code       String?                 @db.VarChar(250)
  vlo_licence_desc       String?                 @db.VarChar(250)
  vlo_extended_field     Json?
  createddate            DateTime?               @db.DateTime(0)
  createdby              String?                 @db.VarChar(250)
  updateddate            DateTime?               @db.DateTime(0)
  updatedby              String?                 @db.VarChar(250)
  vend_customer_supplier vend_customer_supplier? @relation(fields: [vcs_vendor_code], references: [vcs_vendor_code], onDelete: Restrict, onUpdate: Restrict, map: "fk01_vend_licence_others")

  @@index([vcs_vendor_code], map: "fk01_vend_licence_others")
}

model vend_licence_ssm {
  vls_id                 Int                     @id
  vcs_vendor_code        String?                 @db.VarChar(20)
  vls_licence_code       String?                 @db.VarChar(150)
  vls_extended_field     Json?
  createddate            DateTime?               @db.DateTime(0)
  createdby              String?                 @db.VarChar(250)
  updateddate            DateTime?               @db.DateTime(0)
  updatedby              String?                 @db.VarChar(250)
  vend_customer_supplier vend_customer_supplier? @relation(fields: [vcs_vendor_code], references: [vcs_vendor_code], onDelete: Restrict, onUpdate: Restrict, map: "fk01_vend_licence_ssm")

  @@index([vcs_vendor_code], map: "fk01_vend_licence_ssm")
}


model vend_supplier_account {
  vsa_vend_acct_id   Int       @id
  vcs_vendor_code    String    @db.VarChar(20)
  vsa_vendor_bank    String    @db.VarChar(100)
  vsa_bank_accno     String    @db.VarChar(30)
  vsa_status         String?   @db.VarChar(30)
  vsa_reason         String?   @db.VarChar(500)
  vsa_remark         String?   @db.VarChar(500)
  vsa_approved_by    String?   @db.VarChar(250)
  vsa_approved_date  DateTime? @db.DateTime(0)
  vsa_extended_field Json?
  createddate        DateTime? @default(now()) @db.DateTime(0)
  createdby          String?   @db.VarChar(250)
  updateddate        DateTime? @db.DateTime(0)
  updatedby          String?   @db.VarChar(250)
  vsa_iban_no        String?   @db.VarChar(50)
  vsa_swift_code     String?   @db.VarChar(50)

  @@index([vcs_vendor_code], map: "vend_supplier_account_fk01")
}


model vendor_address {
  vdd_address_id     Int       @id
  vcs_vendor_code    String    @db.VarChar(20)
  vdd_address_type   String    @db.VarChar(20)
  vdd_address1       String    @db.VarChar(200)
  vdd_address2       String?   @db.VarChar(200)
  vdd_address3       String?   @db.VarChar(200)
  vdd_pcode          String?   @db.VarChar(6)
  vdd_city           String?   @db.VarChar(100)
  vdd_state          String?   @db.VarChar(40)
  vdd_country        String?   @db.VarChar(20)
  vdd_extended_field Json?
  createddate        DateTime? @default(now()) @db.DateTime(0)
  createdby          String?   @db.VarChar(250)
  updateddate        DateTime? @db.DateTime(0)
  updatedby          String?   @db.VarChar(250)

  @@index([vcs_vendor_code], map: "vendor_address_fk01")
}

model vendor_assessment_details {
  vam_assessment_id        Int
  vas_assessment_item_no   Int
  vad_mark                 String?                  @db.VarChar(2)
  vad_isthick              String?                  @db.VarChar(1)
  vad_extended_field       Json?
  createddate              DateTime?                @default(now()) @db.DateTime(0)
  createdby                String?                  @db.VarChar(250)
  updateddate              DateTime?                @db.DateTime(0)
  updatedby                String?                  @db.VarChar(250)
  vendor_assessment_master vendor_assessment_master @relation(fields: [vam_assessment_id], references: [vam_assessment_id], onUpdate: Restrict, map: "fk_reference_37")
  vendor_assessment_setup  vendor_assessment_setup  @relation(fields: [vas_assessment_item_no], references: [vas_assessment_item_no], onUpdate: Restrict, map: "fk_reference_38")

  @@id([vam_assessment_id, vas_assessment_item_no])
  @@index([vas_assessment_item_no], map: "fk_reference_38")
}

model vendor_assessment_grade {
  vag_grade_id       Int       @id @default(autoincrement())
  vag_grade_code     String    @db.VarChar(1)
  vag_grade_desc_bi  String    @db.VarChar(250)
  vag_grade_desc_bm  String?   @db.VarChar(250)
  vag_mark_from      Decimal   @db.Decimal(5, 2)
  vag_mark_to        Decimal   @db.Decimal(5, 2)
  vag_extended_field Json?
  createddate        DateTime? @default(now()) @db.DateTime(0)
  createdby          String?   @db.VarChar(250)
  updateddate        DateTime? @db.DateTime(0)
  updatedby          String?   @db.VarChar(250)
}


model vendor_assessment_master {
  vam_assessment_id         Int                         @id
  vcs_vendor_code           String?                     @db.VarChar(20)
  vam_order_no              String?                     @db.VarChar(20)
  vam_grn_no                String?                     @db.VarChar(20)
  wpm_progress_no           String?                     @db.VarChar(20)
  vam_tender_no             String?                     @db.VarChar(100)
  vam_status                String?                     @db.VarChar(10)
  vam_approve_by            String?                     @db.VarChar(20)
  vam_approve_date          DateTime?                   @db.DateTime(0)
  vam_approve_note          String?                     @db.VarChar(500)
  vam_verify_note           String?                     @db.VarChar(500)
  vam_verify_by             String?                     @db.VarChar(20)
  vam_verify_date           DateTime?                   @db.DateTime(0)
  vam_cancel_date           DateTime?                   @db.DateTime(0)
  vam_cancel_by             String?                     @db.VarChar(20)
  vam_cancel_reason         String?                     @db.VarChar(100)
  vam_assessment_by         String?                     @db.VarChar(20)
  vam_amt                   Decimal?                    @db.Decimal(8, 0)
  vam_mark                  Decimal?                    @db.Decimal(5, 2)
  vam_grade                 String?                     @db.VarChar(1)
  vam_evaluator_note        String?                     @db.VarChar(1000)
  vam_extended_field        Json?
  createddate               DateTime?                   @default(now()) @db.DateTime(0)
  createdby                 String?                     @db.VarChar(250)
  updateddate               DateTime?                   @db.DateTime(0)
  updatedby                 String?                     @db.VarChar(250)
  vendor_assessment_details vendor_assessment_details[]
}

model vendor_assessment_setup {
  vas_assessment_item_no    Int                         @id
  vas_assessment_item_code  String?                     @db.VarChar(20)
  vas_assessment_item_desc  String?                     @unique(map: "vas_assessment_item_desc_UNIQUE") @db.VarChar(500)
  vas_yn_flag               String?                     @db.VarChar(1)
  vas_extended_field        Json?
  createddate               DateTime?                   @default(now()) @db.DateTime(0)
  createdby                 String?                     @db.VarChar(250)
  updateddate               DateTime?                   @db.DateTime(0)
  updatedby                 String?                     @db.VarChar(250)
  vas_options               Int?
  vendor_assessment_details vendor_assessment_details[]
}

model vendor_jobscope {
  vjb_id             Int       @id
  vcs_vendor_code    String    @db.VarChar(20)
  jbs_jobscope_code  String    @db.VarChar(20)
  jbc_category       String?   @db.VarChar(20)
  vjb_reference      String?   @db.VarChar(20)
  vjb_tag            String?   @db.VarChar(5)
  vjb_cidb_class     String?   @db.VarChar(10)
  vjb_extended_field Json?
  createddate        DateTime? @default(now()) @db.DateTime(0)
  createdby          String?   @db.VarChar(250)
  updateddate        DateTime? @db.DateTime(0)
  updatedby          String?   @db.VarChar(250)

  @@unique([vcs_vendor_code, jbs_jobscope_code, jbc_category], map: "vend_jbs_uq")
  @@index([vcs_vendor_code], map: "fk_reference_31")
}

model api_gen_template {
  api_gen_template_id      Int           @id @default(autoincrement())
  api_key                  String        @unique(map: "api_gen_template_uq01") @db.VarChar(250)
  api_base_url             String        @db.VarChar(250)
  api_output_type          String?       @db.VarChar(50)
  api_gen_template_details Json?
  createddate              DateTime?     @default(now()) @db.DateTime(0)
  createdby                String?       @db.VarChar(250)
  updateddate              DateTime?     @db.DateTime(0)
  updatedby                String?       @db.VarChar(250)
  api_data_path            String?       @db.VarChar(500)
  api_gen_log              api_gen_log[]
}

model api_gen_log {
  agl_api_gen_log_id Int              @id @default(autoincrement())
  api_key            String           @db.VarChar(250)
  agl_client_ip      String           @db.VarChar(50)
  agl_client_browser String           @db.VarChar(50)
  agl_session_id     String           @db.VarChar(150)
  createddate        DateTime?        @default(now()) @db.DateTime(0)
  createdby          String?          @db.VarChar(250)
  updateddate        DateTime?        @db.DateTime(0)
  updatedby          String?          @db.VarChar(250)
  api_gen_template   api_gen_template @relation(fields: [api_key], references: [api_key], onUpdate: Restrict, map: "fk_api_gen_log_01")

  @@index([api_key], map: "fk_api_gen_log_01")
}

