export default [
  {
    "header": "KERISI",
    "description": "Financial Information System",
    "child": [
      {
        "title": "Setup",
        "path": "/setup",
        "icon": "zmdi:wrench",
        "child": [
          {
            "title": "GL Structure Setup",
            "path": "/glstructure",
            "icon": "",
            "child": [
              {
                "title": "Fund Type",
                "path": "/setup/glstructure/fundtype",
                "icon": "",
                "child": []
              },
              {
                "title": "Activity Code",
                "path": "/setup/glstructure/activity",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "PTJ Code",
                "path": "/setup/glstructure/ptj-code",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Cost Centre",
                "path": "/setup/glstructure/cost-centre",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Cascade Structure",
                "path": "/setup/glstructure/cascade-structure",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Account Code",
                "path": "/setup/account-code",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Account Code v2",
                "path": "/setup/glstructure/account-code-v2",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "sample Form",
            "path": "/sampleform",
            "icon": "",
            "child": [],
            "meta": {
              "auth": {
                "user": [
                  "dev"
                ]
              }
            }
          },
          {
            "title": "Account Details",
            "path": "/accountdetails",
            "icon": "",
            "child": [],
            "meta": {
              "auth": {
                "user": [
                  "dev"
                ]
              }
            }
          }
        ],
        "meta": {}
      },
      {
        "title": "Budget",
        "path": "/budget",
        "icon": "fa6-solid:calendar-days",
        "child": [
          {
            "title": "Setup",
            "path": "/budget/setup",
            "icon": "",
            "child": [
              {
                "title": "Budget Code",
                "path": "/budget/setup/budget-code",
                "icon": "",
                "child": []
              },
              {
                "title": "Allocation",
                "path": "/budget/setup/allocation",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Structure List",
                "path": "/budget/setup/budget-structure-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Planning Schedule",
                "path": "/budget/setup/budget-planning-schedule",
                "icon": "",
                "child": []
              }
            ]
          },
          {
            "title": "Planning",
            "path": "/budget/planning",
            "icon": "",
            "child": [
              {
                "title": "New Application",
                "path": "/budget/planning/new-application",
                "icon": "",
                "child": []
              },
              {
                "title": "Dasar Sedia Ada",
                "path": "/budget/planning/dasar-sedia-ada",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Planning Allocation 2 List",
                "path": "/budget/planning/budget-planning-allocation-2-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Planning Allocation 3 List",
                "path": "/budget/planning/budget-planning-allocation-3-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Dasar Baru / One Off",
                "path": "/budget/planning/dasar-baru-one-off",
                "icon": "",
                "child": []
              },
              {
                "title": "Planning to Initial",
                "path": "/budget/planning/planning-to-initial",
                "icon": "",
                "child": []
              },
              {
                "title": "Report",
                "path": "/budget/planning/report",
                "icon": "",
                "child": [
                  {
                    "title": "Grant Application by Type",
                    "path": "/budget/planning/report/grant-application-by-type",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM Justfikasi",
                    "path": "/budget/planning/report/abm-justfikasi",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM 4",
                    "path": "/budget/planning/report/abm-4",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM 5",
                    "path": "/budget/planning/report/abm-5",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM 7",
                    "path": "/budget/planning/report/abm-7",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Lampiran ABM 7",
                    "path": "/budget/planning/report/lampiran-abm-7",
                    "icon": "",
                    "child": []
                  }
                ]
              }
            ]
          },
          {
            "title": "Initial",
            "path": "/budget/initial",
            "icon": "",
            "child": []
          },
          {
            "title": "Monitoring",
            "path": "/budget/monitoring",
            "icon": "",
            "child": []
          },
          {
            "title": "Budget Listing",
            "path": "/budget/budget-listing",
            "icon": "",
            "child": []
          },
          {
            "title": "Increment",
            "path": "/budget/increment",
            "icon": "",
            "child": []
          },
          {
            "title": "Decrement",
            "path": "/budget/decrement",
            "icon": "",
            "child": []
          },
          {
            "title": "Virement",
            "path": "/budget/virement",
            "icon": "",
            "child": []
          },
          {
            "title": "Report",
            "path": "/budget/report",
            "icon": "",
            "child": [
              {
                "title": "Total Allocation",
                "path": "/budget/report/total-allocation",
                "icon": "",
                "child": []
              },
              {
                "title": "Expenditure and Balance of Allocation",
                "path": "/budget/report/expenditure-and-balance-of-allocation",
                "icon": "",
                "child": []
              },
              {
                "title": "Laporan Belanjawan",
                "path": "/budget/report/laporan-belanjawan",
                "icon": "",
                "child": []
              },
              {
                "title": "Warrant",
                "path": "/budget/report/warrant",
                "icon": "",
                "child": [
                  {
                    "title": "Warrant Initial",
                    "path": "/budget/report/warrant/warrant-initial",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Warrant Increment",
                    "path": "/budget/report/warrant/warrant-increment",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Warrant Decrement",
                    "path": "/budget/report/warrant/warrant-decrement",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Warrant Virement",
                    "path": "/budget/report/warrant/warrant-virement",
                    "icon": "",
                    "child": []
                  }
                ]
              },
              {
                "title": "Budget Report By PTJ",
                "path": "/budget/report/budget-report-by-ptj",
                "icon": "",
                "child": [
                  {
                    "title": "Budget Summary By PTJ (WBR071)",
                    "path": "/budget/report/budget-report-by-ptj/budget-summary-by-ptj-wbr071",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Variation Report (WBR074)",
                    "path": "/budget/report/budget-report-by-ptj/variation-report-wbr074",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Vot Book Report (WBR051)",
                    "path": "/budget/report/budget-report-by-ptj/vot-book-report-wbr051",
                    "icon": "",
                    "child": []
                  }
                ]
              },
              {
                "title": "Budget Report By Account",
                "path": "/budget/report/budget-report-by-account",
                "icon": "",
                "child": [
                  {
                    "title": "Budget Summary By Account Code (WBR072)",
                    "path": "/budget/report/budget-report-by-account/budget-summary-by-account-code-wbr072",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Allocation, Expenditure & Balance of Allocation by Budget Code",
                    "path": "/budget/report/budget-report-by-account/allocation-expenditure-balance-by-budget-code",
                    "icon": "",
                    "child": []
                  }
                ]
              }
            ]
          },
          {
            "title": "Budget Closing",
            "path": "/budget/budget-closing",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Purchasing",
        "path": "/purchasing",
        "icon": "mdi:file-document-check-outline",
        "child": [
          {
            "title": "Setup",
            "path": "/purchasing/setup",
            "icon": "",
            "child": [
              {
                "title": "Item Main",
                "path": "/purchasing/setup/item-main",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Item Main Listing",
                "path": "/purchasing/setup/item-main-listing",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List Of Jobscope",
                "path": "/purchasing/setup/list-of-jobscope",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Assessment Question",
                "path": "/purchasing/setup/assessment-question",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Purchase Requisition",
            "path": "/purchasing/purchase-requisition",
            "icon": "",
            "child": [
              {
                "title": "New Purchase Requisition",
                "path": "/purchasing/purchase-requisition/new",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Requisition List",
                "path": "/purchasing/purchase-requisition/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Requisition Cancel",
                "path": "/purchasing/purchase-requisition/cancel",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Purchase Requisition Cancellation",
                "path": "/purchasing/purchase-requisition/list-cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of PR To Be Cancel",
                "path": "/purchasing/purchase-requisition/list-pr-to-be-cancel",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Requisition Cancel Partial",
                "path": "/purchasing/purchase-requisition/cancel-partial",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of PR To Be Cancel Partial",
                "path": "/purchasing/purchase-requisition/list-pr-to-be-cancel-partial",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Cancel PR Partial",
                "path": "/purchasing/purchase-requisition/list-cancel-pr-partial",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Purchase Order",
            "path": "/purchasing/purchase-order",
            "icon": "",
            "child": [
              {
                "title": "New Purchase Order",
                "path": "/purchasing/purchase-order/new",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Order List",
                "path": "/purchasing/purchase-order/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Purchase Order Cancellation",
                "path": "/purchasing/purchase-order/list-cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "New PO Cancellation",
                "path": "/purchasing/purchase-order/new-po-cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Cancel PO Partial Listing",
                "path": "/purchasing/purchase-order/cancel-po-partial-listing",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "New Cancel PO Partial",
                "path": "/purchasing/purchase-order/new-cancel-po-partial",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Closing",
                "path": "/purchasing/purchase-order/closing",
                "icon": "",
                "child": [
                  {
                    "title": "PO Confirmation Process",
                    "path": "/purchasing/purchase-order/closing/po-confirmation-process",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "PO Confirmation Process List",
                    "path": "/purchasing/purchase-order/closing/po-confirmation-process-list",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "PO Closed Reverse",
                    "path": "/purchasing/purchase-order/closing/po-closed-reverse",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Process Closing",
                    "path": "/purchasing/purchase-order/closing/process-closing",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Status PO & PR",
            "path": "/purchasing/status-po-pr",
            "icon": "",
            "child": [],
            "meta": {}
          },
          {
            "title": "Good Receive Note",
            "path": "/purchasing/good-receive-note",
            "icon": "",
            "child": [
              {
                "title": "Good Receive Note List",
                "path": "/purchasing/good-receive-note/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Good Receive Note Cancel",
                "path": "/purchasing/good-receive-note/cancel",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Work Progress Note",
            "path": "/purchasing/work-progress-note",
            "icon": "",
            "child": [
              {
                "title": "Work Progress Note Detail",
                "path": "/purchasing/work-progress-note/detail",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Work Progress Note List",
                "path": "/purchasing/work-progress-note/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Work Progress Note Cancel",
                "path": "/purchasing/work-progress-note/cancel",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Vendor",
            "path": "/purchasing/vendor",
            "icon": "",
            "child": [
              {
                "title": "Vendor Profile",
                "path": "/purchasing/vendor/profile",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Vendor",
                "path": "/purchasing/vendor/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Bank Account No For Updated",
                "path": "/purchasing/vendor/bank-account-update",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Vendor Assessment",
            "path": "/purchasing/vendor-assessment",
            "icon": "",
            "child": [
              {
                "title": "Work Progress Note",
                "path": "/purchasing/vendor-assessment/work-progress-note",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Good Receive Note",
                "path": "/purchasing/vendor-assessment/good-receive-note",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Advertisement",
            "path": "/purchasing/advertisement",
            "icon": "",
            "child": [
              {
                "title": "New Tender/Quotation",
                "path": "/purchasing/advertisement/new-tender-quotation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Advertisement Request List",
                "path": "/purchasing/advertisement/request-list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Duration Tender/Quotation",
                "path": "/purchasing/advertisement/duration-tender-quotation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Committee Report",
                "path": "/purchasing/advertisement/committee-report",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Tender/Quotation",
            "path": "/purchasing/tender-quotation",
            "icon": "",
            "child": [
              {
                "title": "Committe & Participant",
                "path": "/purchasing/tender-quotation/committee-participant",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Evaluation",
                "path": "/purchasing/tender-quotation/evaluation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Selection",
                "path": "/purchasing/tender-quotation/selection",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Tender/Quotation Cancellation",
                "path": "/purchasing/tender-quotation/cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Generated Offer Letter",
                "path": "/purchasing/tender-quotation/generated-offer-letter",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Advertisement Complete",
                "path": "/purchasing/tender-quotation/advertisement-complete",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Agreement",
            "path": "/purchasing/agreement",
            "icon": "",
            "child": [
              {
                "title": "List of Agreement",
                "path": "/purchasing/agreement/list",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Variation Order(VO)",
            "path": "/purchasing/variation-order",
            "icon": "",
            "child": [
              {
                "title": "New Variation Order (VO)",
                "path": "/purchasing/variation-order/new",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Variation Order (VO)",
                "path": "/purchasing/variation-order/list",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Bank Guarantee",
            "path": "/purchasing/bank-guarantee",
            "icon": "",
            "child": [
              {
                "title": "List of Bank Guarantee",
                "path": "/purchasing/bank-guarantee/list",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Report",
            "path": "/purchasing/report",
            "icon": "",
            "child": [
              {
                "title": "Report Vendor Assessment (WPN)",
                "path": "/purchasing/report/vendor-assessment-wpn",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Report Vendor Assessment (GRN)",
                "path": "/purchasing/report/vendor-assessment-grn",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Laporan Perolehan PTJ JPKA: LPPM",
                "path": "/purchasing/report/laporan-perolehan-ptj-jpka-lppm",
                "icon": "",
                "child": [
                  {
                    "title": "Senarai Tempoh Masa LPO",
                    "path": "/purchasing/report/laporan-perolehan-ptj-jpka-lppm/senarai-tempoh-masa-lpo",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Laporan Keseluruhan Perolehan",
                    "path": "/purchasing/report/laporan-perolehan-ptj-jpka-lppm/laporan-keseluruhan-perolehan",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "Laporan  LPPM JPKA: KPT",
                "path": "/purchasing/report/laporan-lppm-jpka-kpt",
                "icon": "",
                "child": [
                  {
                    "title": "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel",
                    "path": "/purchasing/report/laporan-lppm-jpka-kpt/perolehan-melalui-kontrak-pusat-sistem-panel",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Report PO",
            "path": "/purchasing/report-po",
            "icon": "",
            "child": [
              {
                "title": "Bendahari",
                "path": "/purchasing/report-po/bendahari",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "PTJ",
                "path": "/purchasing/report-po/ptj",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          }
        ],
        "meta": {}
      },
      {
        "title": "Account Payable",
        "path": "/accountpayable",
        "icon": "",
        "child": [
          {
            "title": "Bill",
            "path": "/accountpayable/bill",
            "icon": "",
            "child": [
              {
                "title": "Bill Cancel @ Knockoff Listing",
                "path": "/accountpayable/bill/bill-cancel-knockoff-listing",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Bill Registration",
                "path": "/accountpayable/bill/bill-registration",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Bill Registration Cancellation @ Knockoff",
                "path": "/accountpayable/bill/bill-registration-cancellation-knockoff",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Journal Bill Cancel @ Knockoff",
                "path": "/accountpayable/bill/journal-bill-cancel-knockoff",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Voucher",
            "path": "/accountpayable/voucher",
            "icon": "",
            "child": [
              {
                "title": "Download Voucher By Reference",
                "path": "/accountpayable/voucher/download-voucher-by-reference",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Download Voucher Supplier By Batch",
                "path": "/accountpayable/voucher/download-voucher-supplier-by-batch",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Journal Voucher Cancel",
                "path": "/accountpayable/voucher/journal-voucher-cancel",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Voucher Cancel",
                "path": "/accountpayable/voucher/voucher-cancel",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Voucher Listing",
                "path": "/accountpayable/voucher/voucher-listing",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Voucher Registration",
                "path": "/accountpayable/voucher/voucher-registration",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Voucher Replace",
                "path": "/accountpayable/voucher/voucher-replace",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Payment",
            "path": "/accountpayable/payment",
            "icon": "",
            "child": [
              {
                "title": "Banker Cheque & Bank Draft",
                "path": "/accountpayable/payment/banker-cheque-bank-draft",
                "icon": "",
                "child": [
                  {
                    "title": "Batch Listing",
                    "path": "/accountpayable/payment/banker-cheque-bank-draft/batch-listing",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Preparation",
                    "path": "/accountpayable/payment/banker-cheque-bank-draft/preparation",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Update Reference",
                    "path": "/accountpayable/payment/banker-cheque-bank-draft/update-reference",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "Cheque",
                "path": "/accountpayable/payment/cheque",
                "icon": "",
                "child": [
                  {
                    "title": "Approved Bank Cheque",
                    "path": "/accountpayable/payment/cheque/approved-bank-cheque",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Bank Cheque To Print or To Cancel",
                    "path": "/accountpayable/payment/cheque/bank-cheque-to-print-or-to-cancel",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Book Cheque Setup",
                    "path": "/accountpayable/payment/cheque/book-cheque-setup",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Cheque Processing",
                    "path": "/accountpayable/payment/cheque/cheque-processing",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Overall Bank Cheque Transaction",
                    "path": "/accountpayable/payment/cheque/overall-bank-cheque-transaction",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "EFT",
                "path": "/accountpayable/payment/eft",
                "icon": "",
                "child": [
                  {
                    "title": "Batching EFT",
                    "path": "/accountpayable/payment/eft/batching-eft",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "EFT Preparation",
                    "path": "/accountpayable/payment/eft/eft-preparation",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Payment Batch Form",
                    "path": "/accountpayable/payment/eft/payment-batch-form",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Payment Batch List",
                    "path": "/accountpayable/payment/eft/payment-batch-list",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Transfer Date",
                    "path": "/accountpayable/payment/eft/transfer-date",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "Listing",
                "path": "/accountpayable/payment/listing",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Other Payment (Update Payment Date)",
                "path": "/accountpayable/payment/other-payment-update-payment-date",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Other Payment V2",
                "path": "/accountpayable/payment/other-payment-v2",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Payment Notice",
                "path": "/accountpayable/payment/payment-notice",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Payment Rejected",
                "path": "/accountpayable/payment/payment-rejected",
                "icon": "",
                "child": [
                  {
                    "title": "Journal Payment Reject/Replace",
                    "path": "/accountpayable/payment/payment-rejected/journal-payment-reject-replace",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Listing Reject",
                    "path": "/accountpayable/payment/payment-rejected/listing-reject",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Reject/Replace Payment",
                    "path": "/accountpayable/payment/payment-rejected/reject-replace-payment",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "Payroll Payment",
                "path": "/accountpayable/payment/payroll-payment",
                "icon": "",
                "child": [
                  {
                    "title": "Listing Approved Batching EPY",
                    "path": "/accountpayable/payment/payroll-payment/listing-approved-batching-epy",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Other Payment",
                    "path": "/accountpayable/payment/payroll-payment/other-payment",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "Print SAB By Batch",
                "path": "/accountpayable/payment/print-sab-by-batch",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Integration",
            "path": "/accountpayable/integration",
            "icon": "",
            "child": [
              {
                "title": "Cancellation",
                "path": "/accountpayable/integration/cancellation",
                "icon": "",
                "child": [
                  {
                    "title": "BRF",
                    "path": "/accountpayable/integration/cancellation/brf",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "Loan Disbursement",
                "path": "/accountpayable/integration/loan-disbursement",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Refund",
                "path": "/accountpayable/integration/refund",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Payee Registration (Others)",
            "path": "/accountpayable/payee-registration-others",
            "icon": "",
            "child": [],
            "meta": {}
          },
          {
            "title": "Account Bank Updated",
            "path": "/accountpayable/account-bank-updated",
            "icon": "",
            "child": [],
            "meta": {}
          },
          {
            "title": "Account Bank by Payee",
            "path": "/accountpayable/account-bank-by-payee",
            "icon": "",
            "child": [],
            "meta": {}
          },
          {
            "title": "Credit Note",
            "path": "/accountpayable/credit-note",
            "icon": "",
            "child": [
              {
                "title": "Credit Note Cancellation",
                "path": "/accountpayable/credit-note/credit-note-cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Credit Note Form",
                "path": "/accountpayable/credit-note/credit-note-form",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Credit Note Listing",
                "path": "/accountpayable/credit-note/credit-note-listing",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Journal Revaluation",
            "path": "/accountpayable/journal-revaluation",
            "icon": "",
            "child": [
              {
                "title": "Journal Revaluation Process",
                "path": "/accountpayable/journal-revaluation/journal-revaluation-process",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Money Transfer",
            "path": "/accountpayable/money-transfer",
            "icon": "",
            "child": [
              {
                "title": "Generate Voucher Draft",
                "path": "/accountpayable/money-transfer/generate-voucher-draft",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Money Transfer",
                "path": "/accountpayable/money-transfer/list-of-money-transfer",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Voucher Money Transfer",
                "path": "/accountpayable/money-transfer/list-of-voucher-money-transfer",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Notification",
            "path": "/accountpayable/notification",
            "icon": "",
            "child": [
              {
                "title": "Historical Sender",
                "path": "/accountpayable/notification/historical-sender",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Send Email",
                "path": "/accountpayable/notification/send-email",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Report",
            "path": "/accountpayable/report",
            "icon": "",
            "child": [
              {
                "title": "Bilangan Hari Daftar Bil Belum Bayar",
                "path": "/accountpayable/report/bilangan-hari-daftar-bil-belum-bayar",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Bill Report",
                "path": "/accountpayable/report/bill-report",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Buku Daftar Terimaan",
                "path": "/accountpayable/report/buku-daftar-terimaan",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Laporan Baucar Bayaran",
                "path": "/accountpayable/report/laporan-baucar-bayaran",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Laporan Prestasi Pembayaran Bill",
                "path": "/accountpayable/report/laporan-prestasi-pembayaran-bill",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Listing of Payee old",
                "path": "/accountpayable/report/listing-of-payee-old",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Payee List Report",
                "path": "/accountpayable/report/payee-list-report",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Payee List Report by PTJ",
                "path": "/accountpayable/report/payee-list-report-by-ptj",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Payment Record",
                "path": "/accountpayable/report/payment-record",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Pembayaran Bil dan Tuntutan",
                "path": "/accountpayable/report/pembayaran-bil-dan-tuntutan",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "PTJ VOT Information",
                "path": "/accountpayable/report/ptj-vot-information",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Transaction History",
                "path": "/accountpayable/report/transaction-history",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          }
        ],
        "meta": {}
      },
      {
        "title": "General Ledger",
        "path": "/generalledger",
        "icon": "simple-icons:hyperledger",
        "child": [
          {
            "title": "Posting to GL",
            "path": "/postingtogl",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "cashbook",
        "path": "/cashbook",
        "icon": "",
        "child": []
      },
      {
        "title": "Account Receivable",
        "path": "/accountreceivable",
        "icon": "",
        "child": []
      },
      {
        "title": "Student Finance",
        "path": "/studentfinance",
        "icon": "",
        "child": []
      },
      {
        "title": "Payroll",
        "path": "/payroll",
        "icon": "",
        "child": []
      },
      {
        "title": "Project Monitoring",
        "path": "/projectmonitoring",
        "icon": "",
        "child": []
      },
      {
        "title": "Investment",
        "path": "/investment",
        "icon": "",
        "child": []
      },
      {
        "title": "Loan",
        "path": "/loan",
        "icon": "",
        "child": []
      },
      {
        "title": "Asset",
        "path": "/asset",
        "icon": "",
        "child": []
      },
      {
        "title": "Credit Control",
        "path": "/creditcontrol",
        "icon": "",
        "child": []
      }
    ],
    "meta": {}
  },
  {
    "header": "System Administration",
    "description": "Manage your application",
    "child": [
      {
        "title": "User Management",
        "path": "/devtool/user-management",
        "icon": "ph:user-circle-gear",
        "child": [
          {
            "title": "User List",
            "path": "/devtool/user-management/user",
            "icon": "material-symbols:account-circle-full",
            "child": [],
            "meta": {}
          },
          {
            "title": "Role List",
            "path": "/devtool/user-management/role",
            "icon": "oui:app-users-roles",
            "child": [],
            "meta": {}
          },
          {
            "title": "User Setting",
            "path": "/usersetting",
            "icon": "flowbite:user-settings-outline",
            "child": [],
            "meta": {}
          },
          {
            "title": "User Group",
            "path": "/usermanagement/usergroup",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Workbence Editor",
        "path": "/workbencemanagement",
        "icon": "hugeicons:computer-desk-03",
        "child": [
          {
            "title": "Menu Editor",
            "icon": "ci:menu-alt-03",
            "path": "/devtool/menu-editor",
            "child": [],
            "meta": {}
          },
          {
            "title": "Page Editor",
            "path": "/page-creator",
            "icon": "icon-park:editor",
            "child": [
              {
                "title": "Page List",
                "path": "/page-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Page Creator",
                "path": "/page-creator",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Pengujian Muka",
                "path": "/page-editor/pengujianmuka",
                "icon": "",
                "child": [
                  {
                    "title": "Structure Budget List",
                    "path": "/page-editor/pengujianmuka/structurebudgetlist",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Sample FORM",
                    "path": "/page-editor/pengujianmuka/sampleform",
                    "icon": "",
                    "child": [
                      {
                        "title": "01Cuba",
                        "path": "/page-editor/pengujianmuka/sampleform/01cuba",
                        "icon": "",
                        "child": [],
                        "meta": {}
                      }
                    ],
                    "meta": {}
                  },
                  {
                    "title": "01Cuba",
                    "path": "/page-editor/pengujianmuka/01cuba",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Dashboard Editor",
            "path": "/dashboard",
            "icon": "ic:outline-dashboard",
            "child": [
              {
                "title": "Content Editor",
                "path": "/devtool/content-editor",
                "icon": "",
                "child": []
              }
            ],
            "meta": {}
          },
          {
            "title": "API Editor",
            "path": "/devtool/api-editor",
            "icon": "material-symbols:api-rounded",
            "child": [],
            "meta": {}
          }
        ],
        "meta": {}
      },
      {
        "title": "Workflow Management",
        "path": "/workflowmanagement",
        "icon": "carbon:workflow-automation",
        "child": [
          {
            "title": "setup",
            "path": "/workflowmanagement/setup",
            "icon": "",
            "child": []
          },
          {
            "title": "Workflow Configuration",
            "path": "/workflowconfiguration",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Communication Mgmt",
        "path": "/communicationmanagement",
        "icon": "roentgen:tower-communication",
        "child": [
          {
            "title": "setup",
            "path": "/communicationmanagement/setup",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Business Rule Management",
        "path": "/businessrulemanagement",
        "icon": "streamline-freehand-color:business-workflow-project-management",
        "child": [],
        "meta": {}
      },
      {
        "title": "Task Management",
        "path": "/taskmanagement",
        "icon": "fluent:clipboard-task-list-ltr-24-regular",
        "child": [
          {
            "title": "Task List",
            "path": "/taskmanagement/tasklist",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Message Management",
        "path": "/messagemanagement",
        "icon": "material-symbols:android-messages-outline",
        "child": [
          {
            "title": "Setup",
            "path": "/messagemanagement/setup",
            "icon": "",
            "child": [
              {
                "title": "Message Category",
                "path": "/messagemanagement/setup/messagecategory",
                "icon": "",
                "child": []
              },
              {
                "title": "Message Type",
                "path": "/messagemanagement/setup/messagetype",
                "icon": "",
                "child": []
              }
            ]
          },
          {
            "title": "Message List",
            "path": "/messagemanagement/messagelist",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Global Setting",
        "path": "/globalsetting",
        "icon": "material-symbols:globe-asia-sharp",
        "child": [],
        "meta": {}
      },
      {
        "title": "Panduan Pembangun",
        "path": "/devtool/guide",
        "icon": "material-symbols:menu-book-rounded",
        "child": []
      },
      {
        "title": "Kitchen Sink",
        "path": "/kitchen-sink",
        "icon": "material-symbols:kitchen",
        "child": [],
        "meta": {}
      }
    ],
    "meta": {
      "auth": {
        "role": [
          "Developer"
        ]
      }
    }
  },
  {
    "header": "BF-BTN Pengurusan Bantuan",
    "description": "",
    "child": [
      {
        "title": "Program",
        "icon": "iconamoon:component-fill",
        "child": [
          {
            "title": "Senarai Program",
            "icon": "iconamoon:arrow-right-2-duotone",
            "path": "/BF-BTN/PG/DYMM/01-1",
            "child": [],
            "meta": {}
          },
          {
            "title": "Senarai Program SJK",
            "icon": "iconamoon:arrow-right-2-duotone",
            "path": "/BF-BTN/PG/DYMM/01-1/sjk",
            "child": [],
            "meta": {}
          },
          {
            "title": "Senarai Pengesahan Program",
            "icon": "iconamoon:arrow-right-2-duotone",
            "path": "/BF-BTN/PG/DYMM/02-1",
            "child": [],
            "meta": {}
          },
          {
            "title": "Rekod Senarai Kehadiran",
            "icon": "iconamoon:arrow-right-2-duotone",
            "path": "/BF-BTN/PG/DYMM/12-1",
            "child": [],
            "meta": {}
          },
          {
            "title": "Rekod Senarai Tuntutan",
            "icon": "iconamoon:arrow-right-2-duotone",
            "path": "/BF-BTN/PG/DYMM/14-1",
            "child": [],
            "meta": {}
          }
        ],
        "meta": {}
      }
    ],
    "meta": {
      "auth": {
        "role": [
          "Developer",
          "Bantuan"
        ]
      }
    }
  }
]