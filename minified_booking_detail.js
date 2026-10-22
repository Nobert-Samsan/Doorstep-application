rf = () => {
  let { id: e } = bt();
  gt();
  let [t, n] = (0, v.useState)(null),
    [r, i] = (0, v.useState)([]),
    [a, o] = (0, v.useState)(!0),
    [s, c] = (0, v.useState)(0),
    [l, u] = (0, v.useState)(0),
    [d, f] = (0, v.useState)(``),
    [p, m] = (0, v.useState)(!1),
    h = (e) => {
      switch (e) {
        case `pending`:
          return `bg-amber-500 text-white`;
        case `in_progress`:
          return `bg-blue-600 text-white`;
        case `completed`:
          return `bg-green-600 text-white`;
        case `cancelled`:
          return `bg-red-600 text-white`;
        default:
          return `bg-gray-500 text-white`;
      }
    },
    g = async () => {
      try {
        let { data: t } = await $.get(`/bookings/${e}`);
        n(t.data);
        let r = await $.get(`/quotations/booking/${e}`);
        i(r.data.data);
      } catch {
        W.error(`Failed to load booking details`);
      } finally {
        o(!1);
      }
    };
  ((0, v.useEffect)(() => {
    g();
  }, [e]),
    (0, v.useEffect)(() => {
      let t = ts(`http://localhost:5000`);
      return (
        t.emit(`join`, e),
        t.on(`booking_updated`, () => {
          g();
        }),
        t.on(`quotation_received`, (t) => {
          t.bookingId === e && g();
        }),
        () => t.disconnect()
      );
    }, [e]));
  let _ = async (e) => {
      try {
        (await $.put(`/quotations/${e}/accept`),
          W.success(
            `Quotation Accepted! Please pay the worker in cash after completion.`,
          ),
          g());
      } catch (e) {
        W.error(e.response?.data?.message || `Failed to accept quotation`);
      }
    },
    y = async (e) => {
      try {
        (await $.put(`/quotations/${e}/reject`), g());
      } catch (e) {
        console.error(`Failed to cancel booking`, e);
      }
    };
  if (a)
    return (0, K.jsx)(`div`, {
      className: `p-8 text-center`,
      children: `Loading...`,
    });
  if (!t)
    return (0, K.jsx)(`div`, {
      className: `p-8 text-center`,
      children: `Booking not found`,
    });
  let b = [
      { key: `pending`, label: `Requested` },
      { key: `accepted`, label: `Accepted` },
      { key: `en_route`, label: `Worker En Route` },
      { key: `arrived`, label: `Worker Arrived` },
      { key: `quote_provided`, label: `Quote Pending Approval` },
      { key: `in_progress`, label: `In Progress` },
      { key: `completed`, label: `Completed` },
    ],
    x =
      t.statusHistory?.some((e) => e.status === `in_progress`) ||
      t.status === `in_progress`,
    S = r.length > 0 && !x ? b : b.filter((e) => e.key !== `quote_provided`),
    C = S.findIndex((e) => e.key === t.status),
    w = t._id.substring(0, 6).toUpperCase(),
    T =
      `${t.workerId?.firstName?.[0] || ``}${t.workerId?.lastName?.[0] || ``}`.toUpperCase(),
    ee = (e) => (e ? new Date(e).toLocaleString() : ``),
    te =
      t.statusHistory?.some((e) => e.status === `in_progress`) ||
      t.status === `in_progress`;
  return (0, K.jsxs)(K.Fragment, {
    children: [
      (0, K.jsx)(`style`, {
        children: `
        * {
          --yellow-border: none;
        }
        [style*="border-color: #f59e0b"],
        [style*="border: 1px solid gold"],
        [style*="border-color: amber"],
        [class*="yellow"],
        [class*="amber-border"] {
          border-color: #F0EDE9 !important;
        }
        .phone-number-display {
          display: none !important;
        }

        .main-content {
          background: #F8F6F3;
          padding: 28px 32px;
          min-height: 100vh;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          background: white;
          border: 1.5px solid #E7E5E4;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #57534E;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          text-decoration: none;
        }
        .back-btn:hover {
          border-color: #EA580C;
          color: #EA580C;
          background: #FFF7ED;
        }
        .page-title-group {
          border-left: 4px solid #EA580C;
          padding-left: 14px;
        }
        .page-label {
          font-size: 11px;
          font-weight: 600;
          color: #A8A29E;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 3px;
        }
        .page-title {
          font-size: 22px;
          font-weight: 800;
          color: #1C1917;
          letter-spacing: -0.4px;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .booking-ref-pill {
          background: #F5F2EF;
          border: 1px solid #E7E5E4;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #57534E;
          font-family: monospace;
          letter-spacing: 0.05em;
        }
        .status-pill {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .status-pill.in-progress {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          color: #1D4ED8;
        }
        .status-pill.completed {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #15803D;
        }
        .status-pill.pending {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          color: #B45309;
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .final-bill-alert {
          background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
          border: 1px solid #86EFAC;
          border-left: 4px solid #16A34A;
          border-radius: 16px;
          padding: 20px 24px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .final-bill-alert::after {
          content: '✓';
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 64px;
          color: rgba(22,163,74,0.08);
          font-weight: 900;
          line-height: 1;
        }
        .alert-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .alert-icon {
          width: 40px;
          height: 40px;
          background: #DCFCE7;
          border: 1px solid #86EFAC;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .alert-title {
          font-size: 16px;
          font-weight: 700;
          color: #14532D;
          margin-bottom: 3px;
        }
        .alert-sub {
          font-size: 13px;
          color: #16A34A;
          line-height: 1.5;
        }
        .bill-table {
          background: white;
          border-radius: 10px;
          border: 1px solid #BBF7D0;
          overflow: hidden;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .bill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #F0FDF4;
          transition: background 0.1s;
        }
        .bill-row:hover { background: #F0FDF4; }
        .bill-row:last-child { border-bottom: none; }
        .bill-row-desc {
          font-size: 14px;
          color: #1C1917;
          font-weight: 500;
        }
        .bill-row-amount {
          font-size: 14px;
          font-weight: 600;
          color: #1C1917;
        }
        .bill-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #F0FDF4;
          border-top: 2px solid #86EFAC;
        }
        .bill-total-label {
          font-size: 15px;
          font-weight: 700;
          color: #14532D;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bill-total-amount {
          font-size: 18px;
          font-weight: 800;
          color: #15803D;
          letter-spacing: -0.4px;
        }
        .bill-duration-note {
          font-size: 11px;
          color: #78716C;
          margin-top: 2px;
          padding: 0 16px 10px;
          background: white;
        }
        .alert-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .btn-accept-bill {
          padding: 12px 24px;
          background: linear-gradient(135deg, #22C55E, #16A34A);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 12px rgba(34,197,94,0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-accept-bill:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(34,197,94,0.4);
        }
        .btn-decline-bill {
          padding: 12px 20px;
          background: #FEF2F2;
          border: 1.5px solid #FECACA;
          color: #DC2626;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .btn-decline-bill:hover {
          background: #FEE2E2;
          border-color: #FCA5A5;
        }
        .alert-note {
          font-size: 12px;
          color: #16A34A;
          margin-left: 4px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .booking-detail-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
          width: 100%;
        }

        .worker-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .worker-card-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid #F5F2EF;
          background: linear-gradient(135deg, #FAFAF8, #F5F2EF);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .worker-card-title {
          font-size: 13px;
          font-weight: 700;
          color: #1C1917;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .worker-card-title-icon {
          width: 24px;
          height: 24px;
          background: #FFF7ED;
          border: 1px solid #FED7AA;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }
        .worker-card-body {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .worker-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .worker-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #EA580C, #C2410C);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: white;
          border: 3px solid #FFEDD5;
          overflow: hidden;
        }
        .worker-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .worker-verified-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          background: #22C55E;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
        }
        .worker-info {
          flex: 1;
        }
        .worker-assign-label {
          font-size: 10px;
          font-weight: 600;
          color: #A8A29E;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 3px;
        }
        .worker-name {
          font-size: 16px;
          font-weight: 700;
          color: #1C1917;
          text-transform: capitalize;
          margin-bottom: 4px;
        }
        .worker-meta-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .worker-meta-item {
          font-size: 12px;
          color: #78716C;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .worker-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-left: auto;
        }
        .btn-call {
          padding: 10px 18px;
          background: white;
          border: 1.5px solid #E7E5E4;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #57534E;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .btn-call:hover {
          border-color: #22C55E;
          color: #16A34A;
          background: #F0FDF4;
        }
        .btn-message {
          padding: 10px 20px;
          background: linear-gradient(135deg, #EA580C, #C2410C);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 3px 10px rgba(234,88,12,0.3);
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .btn-message:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(234,88,12,0.4);
        }
        .phone-masked {
          font-size: 12px;
          color: #A8A29E;
          font-style: italic;
        }

        .timeline-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .timeline-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid #F5F2EF;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .timeline-header-icon {
          width: 28px;
          height: 28px;
          background: #FFF7ED;
          border: 1px solid #FED7AA;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }
        .timeline-title {
          font-size: 15px;
          font-weight: 700;
          color: #1C1917;
        }
        .timeline-body {
          padding: 20px;
        }
        .timeline-steps {
          display: flex;
          flex-direction: column;
        }
        .timeline-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          position: relative;
          padding-bottom: 20px;
        }
        .timeline-step:last-child {
          padding-bottom: 0;
        }
        .timeline-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 14px;
          top: 30px;
          bottom: 0;
          width: 2px;
          background: #F0EDE9;
          z-index: 0;
        }
        .timeline-step.done:not(:last-child)::after {
          background: linear-gradient(180deg, #EA580C, #C2410C);
        }
        .timeline-step.active:not(:last-child)::after {
          background: linear-gradient(180deg, #EA580C 0%, #F0EDE9 100%);
        }
        .step-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s;
          border: 2px solid #E7E5E4;
          background: white;
          color: #A8A29E;
        }
        .step-circle.done {
          background: linear-gradient(135deg, #EA580C, #C2410C);
          border-color: #EA580C;
          color: white;
          box-shadow: 0 0 0 4px rgba(234,88,12,0.12);
        }
        .step-circle.active {
          background: white;
          border: 2.5px solid #EA580C;
          color: #EA580C;
          box-shadow: 0 0 0 4px rgba(234,88,12,0.15);
          animation: pulse-circle 2s infinite;
        }
        @keyframes pulse-circle {
          0% { box-shadow: 0 0 0 0 rgba(234,88,12,0.35); }
          70% { box-shadow: 0 0 0 8px rgba(234,88,12,0); }
          100% { box-shadow: 0 0 0 0 rgba(234,88,12,0); }
        }
        .step-content {
          flex: 1;
          padding-top: 3px;
        }
        .step-name {
          font-size: 14px;
          font-weight: 600;
          color: #A8A29E;
          transition: color 0.2s;
          margin-bottom: 2px;
        }
        .step-name.done { color: #1C1917; font-weight: 700; }
        .step-name.active { color: #EA580C; font-weight: 700; }
        .step-time {
          font-size: 11px;
          color: #A8A29E;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .step-time.done { color: #78716C; }
        .step-time.active { color: #EA580C; opacity: 0.8; }

        .payment-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .payment-card-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid #F5F2EF;
          background: linear-gradient(135deg, #FAFAF8, #F5F2EF);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .payment-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #1C1917;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .payment-card-body {
          padding: 16px 20px;
        }
        .payment-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid #F8F5F2;
        }
        .payment-row:last-child { border-bottom: none; }
        .payment-row-label {
          font-size: 13px;
          color: #78716C;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .payment-row-label-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .payment-row-label-dot.orange { background: #EA580C; }
        .payment-row-label-dot.amber { background: #F59E0B; }
        .payment-row-label-dot.green { background: #22C55E; }
        .payment-row-label-dot.red { background: #DC2626; }

        .payment-row-value {
          font-size: 13px;
          font-weight: 700;
          color: #1C1917;
        }
        .payment-row-value.unpaid { color: #DC2626; }
        .payment-row-value.pending { color: #D97706; }
        .payment-row-value.paid { color: #16A34A; }
        
        .payment-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }
        .payment-status-badge.unpaid {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #B91C1C;
        }
        .payment-status-badge.pending {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          color: #B45309;
        }
        .payment-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0 4px;
          border-top: 2px solid #F0EDE9;
          margin-top: 4px;
        }
        .payment-total-label {
          font-size: 14px;
          font-weight: 700;
          color: #1C1917;
        }
        .payment-total-value {
          font-size: 16px;
          font-weight: 800;
          color: #EA580C;
          letter-spacing: -0.4px;
        }
        .pay-now-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #EA580C, #C2410C);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 14px;
          transition: all 0.2s;
          box-shadow: 0 3px 10px rgba(234,88,12,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pay-now-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(234,88,12,0.35);
        }
        .pay-now-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .payment-note {
          font-size: 11px;
          color: #A8A29E;
          text-align: center;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .support-card {
          background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
          border: 1px solid #FED7AA;
          border-radius: 16px;
          padding: 16px 20px;
        }
        .support-title {
          font-size: 13px;
          font-weight: 700;
          color: #92400E;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .support-text {
          font-size: 12px;
          color: #B45309;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .support-contact {
          font-size: 13px;
          font-weight: 700;
          color: #92400E;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }
        .support-hours {
          font-size: 11px;
          color: #B45309;
        }
      `,
      }),
      (0, K.jsxs)(`div`, {
        className: `main-content`,
        children: [
          (0, K.jsxs)(`div`, {
            className: `page-header`,
            children: [
              (0, K.jsxs)(`div`, {
                className: `header-left`,
                children: [
                  (0, K.jsxs)(U, {
                    to: `/customer/bookings`,
                    className: `back-btn`,
                    children: [
                      (0, K.jsx)(Qr, { size: 16 }),
                      ` Back to Bookings`,
                    ],
                  }),
                  (0, K.jsxs)(`div`, {
                    className: `page-title-group`,
                    children: [
                      (0, K.jsx)(`div`, {
                        className: `page-label`,
                        children: `CUSTOMER PORTAL`,
                      }),
                      (0, K.jsx)(`div`, {
                        className: `page-title`,
                        children: `Booking Details`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, K.jsxs)(`div`, {
                className: `header-right`,
                children: [
                  (0, K.jsxs)(`div`, {
                    className: `booking-ref-pill`,
                    children: [`REF: #`, w],
                  }),
                  (0, K.jsxs)(`div`, {
                    className: `status-pill ${t.status === `in_progress` ? `in-progress` : t.status === `completed` ? `completed` : `pending`}`,
                    children: [
                      (0, K.jsx)(`div`, { className: `status-dot` }),
                      t.status
                        .replace(`_`, ` `)
                        .replace(/\b\w/g, (e) => e.toUpperCase()),
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, K.jsxs)(`div`, {
            className: `booking-detail-grid`,
            children: [
              (0, K.jsxs)(`div`, {
                children: [
                  r.map(
                    (e) =>
                      e.status === `pending` &&
                      (0, K.jsxs)(
                        `div`,
                        {
                          className: `final-bill-alert`,
                          children: [
                            (0, K.jsxs)(`div`, {
                              className: `alert-header`,
                              children: [
                                (0, K.jsx)(`div`, {
                                  className: `alert-icon`,
                                  children: `✓`,
                                }),
                                (0, K.jsxs)(`div`, {
                                  children: [
                                    (0, K.jsx)(`div`, {
                                      className: `alert-title`,
                                      children: te
                                        ? `Final Bill Ready for Review`
                                        : `Worker Quotation Ready`,
                                    }),
                                    (0, K.jsx)(`div`, {
                                      className: `alert-sub`,
                                      children: te
                                        ? `The worker has finished the job and provided the final bill. Please review and accept to complete the service.`
                                        : `The worker has provided an itemized quotation for your job. Please review and accept to proceed.`,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, K.jsxs)(`div`, {
                              className: `bill-table`,
                              children: [
                                e.lineItems.map((e, t) =>
                                  (0, K.jsxs)(
                                    `div`,
                                    {
                                      className: `bill-row`,
                                      children: [
                                        (0, K.jsx)(`span`, {
                                          className: `bill-row-desc`,
                                          children: e.description,
                                        }),
                                        (0, K.jsxs)(`span`, {
                                          className: `bill-row-amount`,
                                          children: [`Rs. `, e.amount],
                                        }),
                                      ],
                                    },
                                    t,
                                  ),
                                ),
                                (0, K.jsxs)(`div`, {
                                  className: `bill-total-row`,
                                  children: [
                                    (0, K.jsx)(`span`, {
                                      className: `bill-total-label`,
                                      children: `Total Estimated Amount`,
                                    }),
                                    (0, K.jsxs)(`span`, {
                                      className: `bill-total-amount`,
                                      children: [`Rs. `, e.totalAmount],
                                    }),
                                  ],
                                }),
                                e.estimatedDuration &&
                                  (0, K.jsxs)(`div`, {
                                    className: `bill-duration-note`,
                                    children: [
                                      `Estimated Duration: `,
                                      e.estimatedDuration,
                                    ],
                                  }),
                              ],
                            }),
                            (0, K.jsxs)(`div`, {
                              className: `alert-actions`,
                              children: [
                                (0, K.jsxs)(`button`, {
                                  onClick: () => _(e._id),
                                  className: `btn-accept-bill`,
                                  children: [
                                    `✓ `,
                                    te
                                      ? `Accept Final Bill & Complete Job`
                                      : `Accept Quotation & Start Work`,
                                  ],
                                }),
                                (0, K.jsx)(`button`, {
                                  onClick: () => y(e._id),
                                  className: `btn-decline-bill`,
                                  children: `✕ Decline`,
                                }),
                                (0, K.jsx)(`div`, {
                                  className: `alert-note`,
                                  children: `🔒 By accepting you confirm the job is complete and payment will be processed`,
                                }),
                              ],
                            }),
                          ],
                        },
                        e._id,
                      ),
                  ),
                  (0, K.jsxs)(`div`, {
                    className: `bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden mb-6`,
                    children: [
                      (0, K.jsxs)(`div`, {
                        className: `flex items-center justify-between p-6 border-b border-gray-100`,
                        children: [
                          (0, K.jsxs)(`div`, {
                            className: `flex items-center gap-4`,
                            children: [
                              (0, K.jsxs)(`h3`, {
                                className: `text-xl sm:text-2xl font-bold text-gray-900`,
                                children: [`Booking #`, w],
                              }),
                              (0, K.jsx)(`button`, {
                                "aria-label": `Copy Booking ID`,
                                className: `text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1`,
                                onClick: () => navigator.clipboard.writeText(w),
                                children: (0, K.jsx)(pi, { size: 16 }),
                              }),
                            ],
                          }),
                          (0, K.jsxs)(`div`, {
                            className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${h(t.status)}`,
                            children: [
                              (0, K.jsx)(`span`, {
                                className: `w-2 h-2 rounded-full bg-white`,
                              }),
                              t.status.replace(`_`, ` `).toUpperCase(),
                            ],
                          }),
                        ],
                      }),
                      (0, K.jsxs)(`div`, {
                        className: `p-6 space-y-6`,
                        children: [
                          (0, K.jsxs)(`div`, {
                            className: `grid grid-cols-1 md:grid-cols-2 gap-6`,
                            children: [
                              (0, K.jsxs)(`div`, {
                                children: [
                                  (0, K.jsx)(`div`, {
                                    className: `text-[12px] uppercase font-semibold tracking-wider text-gray-500 mb-2`,
                                    children: `Scheduled Date`,
                                  }),
                                  (0, K.jsxs)(`div`, {
                                    className: `text-base font-semibold text-gray-900 flex items-center gap-2`,
                                    children: [
                                      (0, K.jsx)(ri, {
                                        size: 18,
                                        className: `text-gray-400`,
                                      }),
                                      new Date(
                                        t.scheduledDate,
                                      ).toLocaleDateString(`en-GB`, {
                                        weekday: `short`,
                                        day: `numeric`,
                                        month: `short`,
                                        year: `numeric`,
                                      }),
                                    ],
                                  }),
                                  (0, K.jsx)(`div`, {
                                    className: `text-sm text-gray-500 mt-1 ml-6`,
                                    children:
                                      t.urgency === `urgent`
                                        ? `ASAP (Emergency)`
                                        : `Flexible timeframe`,
                                  }),
                                ],
                              }),
                              (0, K.jsxs)(`div`, {
                                children: [
                                  (0, K.jsx)(`div`, {
                                    className: `text-[12px] uppercase font-semibold tracking-wider text-gray-500 mb-2`,
                                    children: `Category`,
                                  }),
                                  (0, K.jsxs)(`div`, {
                                    className: `text-base font-semibold text-gray-900 flex items-center gap-2`,
                                    children: [
                                      (0, K.jsx)(ui, {
                                        size: 18,
                                        className: `text-gray-400`,
                                      }),
                                      t.categoryId?.nameEn || `Other`,
                                    ],
                                  }),
                                  (0, K.jsx)(`div`, {
                                    className: `text-sm text-gray-500 mt-1 ml-6`,
                                    children: `General service`,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, K.jsx)(`hr`, { className: `border-gray-100` }),
                          (0, K.jsxs)(`div`, {
                            children: [
                              (0, K.jsx)(`div`, {
                                className: `text-[12px] uppercase font-semibold tracking-wider text-gray-500 mb-3`,
                                children: `Job Location`,
                              }),
                              (0, K.jsxs)(`div`, {
                                className: `flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4`,
                                children: [
                                  (0, K.jsxs)(`div`, {
                                    className: `flex items-center gap-3`,
                                    children: [
                                      (0, K.jsx)(`div`, {
                                        className: `w-10 h-10 rounded-full bg-orange-100 text-primary flex items-center justify-center flex-shrink-0`,
                                        children: (0, K.jsx)(ji, { size: 20 }),
                                      }),
                                      (0, K.jsxs)(`div`, {
                                        children: [
                                          (0, K.jsx)(`div`, {
                                            className: `text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1`,
                                            children: `Service Location`,
                                          }),
                                          (0, K.jsxs)(`div`, {
                                            className: `text-base font-bold text-gray-900`,
                                            children: [
                                              t.streetAddress || t.city,
                                              `, `,
                                              t.district,
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, K.jsxs)(`div`, {
                                    className: `flex items-center gap-2 w-full sm:w-auto`,
                                    children: [
                                      (0, K.jsxs)(`button`, {
                                        className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-primary focus:outline-none h-11`,
                                        children: [
                                          (0, K.jsx)(Mi, { size: 16 }),
                                          ` Directions`,
                                        ],
                                      }),
                                      (0, K.jsxs)(`button`, {
                                        onClick: () =>
                                          navigator.clipboard.writeText(
                                            `${t.streetAddress || t.city}, ${t.district}`,
                                          ),
                                        className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-primary focus:outline-none h-11`,
                                        children: [
                                          (0, K.jsx)(pi, { size: 16 }),
                                          ` Copy`,
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, K.jsx)(`hr`, { className: `border-gray-100` }),
                          (0, K.jsxs)(`div`, {
                            children: [
                              (0, K.jsx)(`div`, {
                                className: `text-[12px] uppercase font-semibold tracking-wider text-gray-500 mb-2`,
                                children: `Job Notes`,
                              }),
                              t.jobDescription
                                ? (0, K.jsx)(`p`, {
                                    className: `text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100`,
                                    children: t.jobDescription,
                                  })
                                : (0, K.jsx)(`p`, {
                                    className: `text-sm text-gray-400 italic`,
                                    children: `No notes added`,
                                  }),
                            ],
                          }),
                        ],
                      }),
                      (0, K.jsxs)(`div`, {
                        className: `bg-gray-50 border-t border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-end gap-3`,
                        children: [
                          (0, K.jsx)(`button`, {
                            className: `w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none h-[44px]`,
                            children: `Cancel booking`,
                          }),
                          (0, K.jsxs)(`button`, {
                            className: `w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-secondary rounded-xl shadow-sm transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none h-[44px] flex justify-center items-center gap-2`,
                            children: [
                              (0, K.jsx)(Pi, { size: 18 }),
                              ` Contact provider`,
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  t.workerId &&
                    (0, K.jsxs)(`div`, {
                      className: `worker-card`,
                      children: [
                        (0, K.jsxs)(`div`, {
                          className: `worker-card-header`,
                          children: [
                            (0, K.jsx)(`div`, {
                              className: `worker-card-title-icon`,
                              children: `👷`,
                            }),
                            (0, K.jsx)(`div`, {
                              className: `worker-card-title`,
                              children: `Assigned Worker`,
                            }),
                          ],
                        }),
                        (0, K.jsxs)(`div`, {
                          className: `worker-card-body`,
                          children: [
                            (0, K.jsxs)(`div`, {
                              className: `worker-avatar-wrap`,
                              children: [
                                (0, K.jsx)(`div`, {
                                  className: `worker-avatar`,
                                  children: t.workerId.profilePhoto
                                    ? (0, K.jsx)(`img`, {
                                        src: t.workerId.profilePhoto,
                                        alt: `Worker`,
                                      })
                                    : T,
                                }),
                                (0, K.jsx)(`div`, {
                                  className: `worker-verified-badge`,
                                  children: `✓`,
                                }),
                              ],
                            }),
                            (0, K.jsxs)(`div`, {
                              className: `worker-info`,
                              children: [
                                (0, K.jsx)(`div`, {
                                  className: `worker-assign-label`,
                                  children: `ASSIGNED WORKER`,
                                }),
                                (0, K.jsxs)(`div`, {
                                  className: `worker-name`,
                                  children: [
                                    t.workerId.firstName,
                                    ` `,
                                    t.workerId.lastName,
                                  ],
                                }),
                                (0, K.jsxs)(`div`, {
                                  className: `worker-meta-row`,
                                  children: [
                                    (0, K.jsxs)(`div`, {
                                      className: `worker-meta-item`,
                                      children: [
                                        `⚡ `,
                                        t.categoryId?.nameEn || `Specialist`,
                                      ],
                                    }),
                                    (0, K.jsxs)(`div`, {
                                      className: `worker-meta-item`,
                                      children: [
                                        `📍 `,
                                        t.workerId.city || t.district,
                                      ],
                                    }),
                                  ],
                                }),
                                (0, K.jsx)(`div`, {
                                  className: `phone-masked`,
                                  children: `📱 Contact via app only`,
                                }),
                              ],
                            }),
                            (0, K.jsxs)(`div`, {
                              className: `worker-actions`,
                              children: [
                                (0, K.jsx)(`button`, {
                                  className: `btn-call`,
                                  children: `📞 Call`,
                                }),
                                (0, K.jsx)(`button`, {
                                  className: `btn-message`,
                                  children: `💬 Message`,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
              (0, K.jsxs)(`div`, {
                children: [
                  (0, K.jsxs)(`div`, {
                    className: `timeline-card`,
                    children: [
                      (0, K.jsxs)(`div`, {
                        className: `timeline-header`,
                        children: [
                          (0, K.jsx)(`div`, {
                            className: `timeline-header-icon`,
                            children: `⏳`,
                          }),
                          (0, K.jsx)(`div`, {
                            className: `timeline-title`,
                            children: `Booking Timeline`,
                          }),
                        ],
                      }),
                      (0, K.jsx)(`div`, {
                        className: `timeline-body`,
                        children: (0, K.jsx)(`div`, {
                          className: `timeline-steps`,
                          children: S.map((e, n) => {
                            let r = S.findIndex((t) => t.key === e.key),
                              i = t.statusHistory?.find(
                                (t) => t.status === e.key,
                              ),
                              a = !1;
                            a =
                              t.status === `cancelled` ||
                              t.status === `complaint`
                                ? !!i
                                : r < C ||
                                  (r === C &&
                                    [`completed`, `cancelled`].includes(
                                      t.status,
                                    ));
                            let o = r === C && !a,
                              s = ``;
                            return (
                              a ? (s = `done`) : o && (s = `active`),
                              (0, K.jsxs)(
                                `div`,
                                {
                                  className: `timeline-step ${s}`,
                                  children: [
                                    (0, K.jsx)(`div`, {
                                      className: `step-circle ${s}`,
                                      children: a ? `✓` : ``,
                                    }),
                                    (0, K.jsxs)(`div`, {
                                      className: `step-content`,
                                      children: [
                                        (0, K.jsx)(`div`, {
                                          className: `step-name ${s}`,
                                          children: e.label,
                                        }),
                                        (a || o) &&
                                          i &&
                                          (0, K.jsxs)(`div`, {
                                            className: `step-time ${s}`,
                                            children: [`📅 `, ee(i.timestamp)],
                                          }),
                                      ],
                                    }),
                                  ],
                                },
                                n,
                              )
                            );
                          }),
                        }),
                      }),
                    ],
                  }),
                  (0, K.jsxs)(`div`, {
                    className: `payment-card`,
                    children: [
                      (0, K.jsx)(`div`, {
                        className: `payment-card-header`,
                        children: (0, K.jsx)(`div`, {
                          className: `payment-card-title`,
                          children: `💳 Payment Summary`,
                        }),
                      }),
                      (0, K.jsxs)(`div`, {
                        className: `payment-card-body`,
                        children: [
                          (() => {
                            let e = r.find(
                              (e) =>
                                e.status === `accepted` ||
                                e.status === `pending`,
                            );
                            return e && e.lineItems && e.lineItems.length > 0
                              ? (0, K.jsxs)(`div`, {
                                  className: `mb-5 bg-[#FAFAF9] rounded-xl p-4 border border-[#F5F5F4] shadow-sm`,
                                  children: [
                                    (0, K.jsxs)(`div`, {
                                      className: `text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider mb-3 flex items-center gap-2`,
                                      children: [
                                        (0, K.jsx)(ui, { size: 14 }),
                                        ` Service Details`,
                                      ],
                                    }),
                                    (0, K.jsx)(`div`, {
                                      className: `space-y-2 mb-3`,
                                      children: e.lineItems.map((e, t) =>
                                        (0, K.jsxs)(
                                          `div`,
                                          {
                                            className: `flex justify-between items-center`,
                                            children: [
                                              (0, K.jsx)(`span`, {
                                                className: `text-sm font-medium text-[#57534E]`,
                                                children: e.description,
                                              }),
                                              (0, K.jsxs)(`span`, {
                                                className: `text-sm font-bold text-[#1C1917]`,
                                                children: [`Rs. `, e.amount],
                                              }),
                                            ],
                                          },
                                          t,
                                        ),
                                      ),
                                    }),
                                    e.estimatedDuration &&
                                      (0, K.jsxs)(`div`, {
                                        className: `pt-3 border-t border-[#F5F5F4] flex justify-between items-center`,
                                        children: [
                                          (0, K.jsx)(`span`, {
                                            className: `text-xs font-semibold text-[#A8A29E] uppercase tracking-wide`,
                                            children: `Est. Duration`,
                                          }),
                                          (0, K.jsx)(`span`, {
                                            className: `text-sm font-bold text-[#57534E]`,
                                            children: e.estimatedDuration,
                                          }),
                                        ],
                                      }),
                                  ],
                                })
                              : null;
                          })(),
                          (0, K.jsxs)(`div`, {
                            className: `payment-total-row`,
                            children: [
                              (0, K.jsx)(`div`, {
                                className: `payment-total-label`,
                                children: `Total`,
                              }),
                              (0, K.jsxs)(`div`, {
                                className: `payment-total-value`,
                                children: [
                                  `Rs. `,
                                  t.finalAmount ||
                                    r.find((e) => e.status === `accepted`)
                                      ?.totalAmount ||
                                    `--`,
                                ],
                              }),
                            ],
                          }),
                          (0, K.jsxs)(`button`, {
                            className: `pay-now-btn`,
                            disabled:
                              t.status !== `completed` ||
                              t.paymentStatus === `paid`,
                            children: [
                              `💳 `,
                              t.paymentStatus === `paid` ? `Paid` : `Pay Now`,
                            ],
                          }),
                          t.status !== `completed` &&
                            t.paymentStatus !== `paid` &&
                            (0, K.jsx)(`div`, {
                              className: `payment-note`,
                              children: `Payment available after job completion`,
                            }),
                          (0, K.jsx)(`div`, {
                            className: `payment-note`,
                            style: { marginTop: `12px` },
                            children: `🔒 Secured payment · Platform fee is always Rs. 0 for customers`,
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, K.jsxs)(`div`, {
                    className: `support-card`,
                    children: [
                      (0, K.jsx)(`div`, {
                        className: `support-title`,
                        children: `🛟 Need Help?`,
                      }),
                      (0, K.jsx)(`div`, {
                        className: `support-text`,
                        children: `Having an issue with this booking? Contact our support team immediately.`,
                      }),
                      (0, K.jsx)(`div`, {
                        className: `support-contact`,
                        children: `📞 +94 11 234 5678`,
                      }),
                      (0, K.jsx)(`div`, {
                        className: `support-hours`,
                        children: `Mon–Sat, 8:00 AM – 6:00 PM`,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
