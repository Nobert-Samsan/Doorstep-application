import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { CreditCard, Calendar, Zap, CheckCircle, Bell, ArrowRight, BarChart2, Info, Lightbulb, Wallet, DollarSign } from 'lucide-react';

const Earnings = () => {
  const [data, setData] = useState({
    totalEarnings: 0,
    totalNet: 0,
    monthlyEarnings: 0,
    monthlyNet: 0,
    todayEarnings: 0,
    todayNet: 0,
    walletBalance: 0,
    commissionDue: 0,
    totalCommissionPaid: 0,
    nextDueDate: null,
    weeklyChartData: [],
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [chartPeriod, setChartPeriod] = useState('Week');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get('/worker/earnings');
        setData(res.data.data);
      } catch (error) {
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00]" />
      </div>
    );
  }

  const safeData = data || { 
    totalEarnings: 0, 
    totalNet: 0,
    monthlyEarnings: 0, 
    monthlyNet: 0,
    todayEarnings: 0,
    todayNet: 0,
    walletBalance: 0,
    commissionDue: 0, 
    totalCommissionPaid: 0,
    nextDueDate: null,
    weeklyChartData: [],
    transactions: [] 
  };

  const netAllTime = safeData.totalNet !== undefined ? safeData.totalNet : (safeData.totalEarnings * 0.9 || 0);
  const netMonthly = safeData.monthlyNet !== undefined ? safeData.monthlyNet : (safeData.monthlyEarnings * 0.9 || 0);
  const netToday = safeData.todayNet !== undefined ? safeData.todayNet : (safeData.todayEarnings * 0.9 || 0);
  const walletBal = safeData.walletBalance !== undefined ? safeData.walletBalance : netAllTime;
  const commDue = safeData.commissionDue || 0;
  const commPaid = safeData.totalCommissionPaid || 0;

  // Chart data
  const chartDays = safeData.weeklyChartData && safeData.weeklyChartData.length > 0 
    ? safeData.weeklyChartData 
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ day: d, amount: 0 }));
  
  const maxChartVal = Math.max(...chartDays.map(d => d.amount || 0), 100);
  const hasChartData = chartDays.some(d => d.amount > 0);

  // Filtered transactions
  const filteredTransactions = (safeData.transactions || []).filter(t => {
    if (filterPeriod === 'All') return true;
    const txDate = new Date(t.date);
    const now = new Date();
    if (filterPeriod === 'This Month') {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    if (filterPeriod === 'Last Month') {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear;
    }
    if (filterPeriod === 'This Year') {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <>
      <style>{`
        .earnings-container {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          width: 100%;
        }
        .page-title-group {
          display: flex;
          flex-direction: column;
        }
        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #1C1917;
          letter-spacing: -0.4px;
        }
        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: white;
          border: 1.5px solid #E7E5E4;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #57534E;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .export-btn:hover {
          border-color: #EA580C;
          color: #EA580C;
          background: #FFF7ED;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
          width: 100%;
        }
        .stat-card {
          background: white;
          border-radius: 14px;
          padding: 20px 22px;
          min-height: 120px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
          cursor: pointer;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.07);
        }
        .stat-card::before {
          display: none;
        }

        .stat-card-label {
          font-size: 11px;
          font-weight: 700;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 14px;
        }
        .stat-card-value {
          font-size: 28px;
          font-weight: 800;
          color: #000000;
          letter-spacing: -1px;
          line-height: 1;
        }
        .stat-card-value .rs {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          letter-spacing: 0;
        }
        .stat-card-sub {
          font-size: 12px;
          color: #000000;
          display: flex;
          align-items: center;
          gap: 4px;
        }


        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 20px;
          margin-bottom: 20px;
          width: 100%;
          align-items: start;
        }

        .chart-card {
          width: 100%;
          box-sizing: border-box;
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 22px 24px;
          margin-bottom: 20px;
        }
        .chart-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .chart-title {
          font-size: 15px;
          font-weight: 700;
          color: #1C1917;
        }
        .chart-period-tabs {
          display: flex;
          background: #F5F2EF;
          border-radius: 8px;
          padding: 3px;
          gap: 2px;
        }
        .chart-tab {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #78716C;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          background: transparent;
        }
        .chart-tab.active {
          background: white;
          color: #EA580C;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chart-area {
          height: 200px;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 0 4px;
          border-bottom: 1px solid #F5F2EF;
          margin-bottom: 12px;
          position: relative;
        }
        .chart-area::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 100%;
          background: repeating-linear-gradient(
            180deg,
            #F8F6F3 0px, #F8F6F3 1px,
            transparent 1px, transparent 25%
          );
          pointer-events: none;
        }
        .chart-bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .chart-bar {
          width: 100%;
          max-width: 40px;
          background: linear-gradient(180deg, #FB923C, #EA580C);
          border-radius: 6px 6px 0 0;
          min-height: 4px;
          opacity: 0.15;
          transition: opacity 0.2s;
        }
        .chart-bar:hover { opacity: 0.5; }
        .chart-bar-label {
          font-size: 11px;
          color: #A8A29E;
          text-align: center;
        }
        .chart-empty-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }
        .chart-empty-icon {
          font-size: 32px;
          opacity: 0.3;
          display: block;
          margin-bottom: 6px;
        }
        .chart-empty-text {
          font-size: 13px;
          color: #A8A29E;
        }

        .transactions-card {
          width: 100%;
          box-sizing: border-box;
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .transactions-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #F5F2EF;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .transactions-title {
          font-size: 15px;
          font-weight: 700;
          color: #1C1917;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .transactions-title-icon {
          width: 28px;
          height: 28px;
          background: #FFF7ED;
          border: 1px solid #FED7AA;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: #EA580C;
        }
        .filter-pills {
          display: flex;
          gap: 6px;
        }
        .filter-pill {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border: 1.5px solid #E7E5E4;
          color: #78716C;
          background: white;
        }
        .filter-pill.active {
          background: #FFF7ED;
          border-color: #FED7AA;
          color: #C2410C;
        }
        .filter-pill:hover {
          border-color: #EA580C;
          color: #EA580C;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }
        .transactions-table thead tr {
          background: #F8F6F3;
          border-bottom: 1px solid #F0EDE9;
        }
        .transactions-table thead th {
          padding: 12px 24px;
          font-size: 11px;
          font-weight: 700;
          color: #A8A29E;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: left;
        }
        .transactions-table thead th.right { text-align: right; }
        .transactions-table thead th.commission { color: #DC2626; }
        .transactions-table thead th.net { color: #16A34A; }

        .transactions-table tbody tr {
          border-bottom: 1px solid #F8F5F2;
          transition: background 0.1s;
        }
        .transactions-table tbody tr:hover {
          background: #FAFAF8;
        }
        .transactions-table tbody tr:last-child {
          border-bottom: none;
        }
        .transactions-table tbody td {
          padding: 14px 24px;
          font-size: 13px;
          color: #57534E;
          vertical-align: middle;
        }
        .td-date {
          font-weight: 500;
          color: #1C1917;
          white-space: nowrap;
        }
        .td-description {
          color: #57534E;
          max-width: 200px;
        }
        .td-amount {
          font-weight: 600;
          color: #1C1917;
          text-align: right;
          white-space: nowrap;
        }
        .td-commission {
          font-weight: 600;
          color: #DC2626;
          text-align: right;
          white-space: nowrap;
        }
        .td-net {
          font-weight: 700;
          color: #16A34A;
          text-align: right;
          white-space: nowrap;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }
        .status-pill.paid {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #15803D;
        }
        .status-pill.pending {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          color: #B45309;
        }
        .status-pill.overdue {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #B91C1C;
        }

        .table-empty-state {
          padding: 56px 24px;
          text-align: center;
        }
        .table-empty-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
          border: 1px solid #FED7AA;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 16px;
        }
        .table-empty-title {
          font-size: 15px;
          font-weight: 700;
          color: #1C1917;
          margin-bottom: 6px;
        }
        .table-empty-sub {
          font-size: 13px;
          color: #A8A29E;
          line-height: 1.6;
          max-width: 280px;
          margin: 0 auto;
        }

        .right-panel {
          width: 100%;
          position: sticky;
          top: 84px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .commission-card {
          width: 100%;
          box-sizing: border-box;
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
          margin-bottom: 0;
        }
        .commission-card-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid #F5F2EF;
          background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
        }
        .commission-card-title {
          font-size: 14px;
          font-weight: 700;
          color: #92400E;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }
        .commission-card-sub {
          font-size: 12px;
          color: #B45309;
        }
        .commission-body {
          padding: 16px 20px;
        }
        .commission-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 0;
          border-bottom: 1px solid #F8F5F2;
        }
        .commission-row:last-of-type { border-bottom: none; }
        .commission-row-label {
          font-size: 13px;
          color: #78716C;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .commission-row-label-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .commission-row-value {
          font-size: 13px;
          font-weight: 700;
          color: #1C1917;
        }
        .commission-row-value.due { color: #DC2626; }
        .commission-row-value.paid { color: #16A34A; }

        .pay-commission-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #DC2626, #B91C1C);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 14px;
          transition: all 0.2s;
          box-shadow: 0 3px 10px rgba(220,38,38,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .pay-commission-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(220,38,38,0.35);
          background: linear-gradient(135deg, #EF4444, #DC2626);
        }

        .info-card {
          width: 100%;
          box-sizing: border-box;
          background: white;
          border-radius: 16px;
          border: 1px solid #F0EDE9;
          padding: 18px 20px;
          margin-bottom: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .info-card-title {
          font-size: 13px;
          font-weight: 700;
          color: #1C1917;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .info-step {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: flex-start;
        }
        .info-step:last-child { margin-bottom: 0; }
        .info-step-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFF7ED;
          border: 1px solid #FED7AA;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #EA580C;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .info-step-text {
          font-size: 12px;
          color: #78716C;
          line-height: 1.5;
        }
        .info-step-text strong {
          color: #1C1917;
          font-weight: 600;
        }

        .tips-card {
          width: 100%;
          box-sizing: border-box;
          background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
          border: 1px solid #BBF7D0;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
          margin-bottom: 0;
        }
        .tips-card-title {
          font-size: 13px;
          font-weight: 700;
          color: #14532D;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tip-item {
          font-size: 12px;
          color: #166534;
          line-height: 1.5;
          margin-bottom: 7px;
          display: flex;
          align-items: flex-start;
          gap: 7px;
        }
        .tip-item::before {
          content: '✓';
          font-weight: 700;
          color: #16A34A;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── RESPONSIVE BREAKPOINTS ── */
        @media (max-width: 900px) {
          .content-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .right-panel {
            position: static;
          }
        }
        @media (max-width: 768px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }
          .stat-card {
            padding: 16px 14px;
            min-height: auto;
            border-radius: 12px;
          }
          .stat-card-label {
            font-size: 10px;
            letter-spacing: 0.04em;
          }
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
          }
          .page-title {
            font-size: 19px;
          }
          .chart-card {
            padding: 16px;
            border-radius: 14px;
            margin-bottom: 16px;
          }
          .chart-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 16px;
          }
          .chart-area {
            height: 160px;
          }
          .transactions-card {
            border-radius: 14px;
          }
          .transactions-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
          }
          .filter-pills {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 4px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .filter-pills::-webkit-scrollbar {
            display: none;
          }
          .filter-pill {
            white-space: nowrap;
            padding: 6px 14px;
            font-size: 11px;
            flex-shrink: 0;
          }
          .stat-card-value {
            font-size: 20px;
          }
          .stat-card-value .rs {
            font-size: 12px;
          }
          .stat-card-sub {
            font-size: 11px;
          }
          .commission-card, .info-card, .tips-card {
            border-radius: 14px;
          }
          .commission-card-header, .commission-body {
            padding: 14px 16px;
          }
          .info-card, .tips-card {
            padding: 16px;
          }
          .transactions-table thead th {
            padding: 10px 14px;
            font-size: 10px;
          }
          .transactions-table tbody td {
            padding: 12px 14px;
            font-size: 12px;
          }
        }
        @media (max-width: 480px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .stat-card {
            padding: 12px 10px;
          }
          .stat-card-value {
            font-size: 17px;
          }
          .chart-period-tabs {
            width: 100%;
            display: flex;
          }
          .chart-tab {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>

      <div className="earnings-container">
        <div className="page-header">
          <div className="page-title-group">
            <h1 className="page-title">Earnings & Commission</h1>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card all-time">
            <div className="stat-card-label">NET EARNINGS ALL TIME</div>
            <div className="stat-card-value"><span className="rs">Rs.</span> {netAllTime.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div className="stat-card monthly">
            <div className="stat-card-label">THIS MONTH</div>
            <div className="stat-card-value"><span className="rs">Rs.</span> {netMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div className="stat-card today">
            <div className="stat-card-label">TODAY'S EARNINGS</div>
            <div className="stat-card-value"><span className="rs">Rs.</span> {netToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div className="stat-card wallet-balance">
            <div className="stat-card-label">WALLET BALANCE</div>
            <div className="stat-card-value"><span className="rs">Rs.</span> {walletBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="content-grid">
          {/* LEFT COLUMN */}
          <div className="min-w-0 w-full overflow-hidden">
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-title">Earnings Overview</div>
                <div className="chart-period-tabs">
                  <button className={`chart-tab ${chartPeriod === 'Week' ? 'active' : ''}`} onClick={() => setChartPeriod('Week')}>Week</button>
                  <button className={`chart-tab ${chartPeriod === 'Month' ? 'active' : ''}`} onClick={() => setChartPeriod('Month')}>Month</button>
                  <button className={`chart-tab ${chartPeriod === 'Year' ? 'active' : ''}`} onClick={() => setChartPeriod('Year')}>Year</button>
                </div>
              </div>
              
              <div className="chart-area">
                {!hasChartData && (
                  <div className="chart-empty-overlay">
                    <span className="chart-empty-icon"><BarChart2 size={32} /></span>
                    <div className="chart-empty-text">Not enough data to display chart</div>
                  </div>
                )}
                {chartDays.map(item => {
                  const pct = hasChartData && maxChartVal > 0 ? Math.max((item.amount / maxChartVal) * 85, 6) : 0;
                  return (
                    <div key={item.day} className="chart-bar-group" title={`${item.day}: Rs. ${Number(item.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`}>
                      <div 
                        className="chart-bar" 
                        style={{ 
                          height: hasChartData ? `${pct}%` : '4px',
                          opacity: item.amount > 0 ? 0.9 : 0.15 
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {chartDays.map(item => (
                  <div key={item.day} className="chart-bar-group" style={{marginTop: '0'}}>
                    <div className="chart-bar-label">{item.day}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="transactions-card">
              <div className="transactions-header">
                <div className="transactions-title">
                  <div className="transactions-title-icon"><Wallet size={14} /></div>
                  Recent Transactions
                </div>
                <div className="filter-pills">
                  {['All', 'This Month', 'Last Month', 'This Year'].map(pill => (
                    <div 
                      key={pill} 
                      className={`filter-pill ${filterPeriod === pill ? 'active' : ''}`}
                      onClick={() => setFilterPeriod(pill)}
                    >
                      {pill}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="right">Job Amount</th>
                    <th className="right commission">Commission (10%)</th>
                    <th className="right net">Net Earnings</th>
                    <th style={{textAlign: 'center'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{padding: 0}}>
                        <div className="table-empty-state">
                          <div className="table-empty-icon"><CreditCard size={28} /></div>
                          <div className="table-empty-title">No transactions yet</div>
                          <div className="table-empty-sub">Your completed job payments and commission records will appear here once you start accepting jobs.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr key={t._id}>
                        <td className="td-date">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="td-description">{t.description}</td>
                        <td className="td-amount">Rs. {(t.jobAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="td-commission">-Rs. {Number(t.commissionAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="td-net">Rs. {Number((t.jobAmount || 0) - (t.commissionAmount || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td style={{textAlign: 'center'}}>
                          <span className={`status-pill ${t.status === 'UNPAID' ? 'pending' : 'paid'}`}>
                            {t.status === 'UNPAID' ? 'Pending' : 'Paid'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-panel">
            <div className="commission-card">
              <div className="commission-card-header">
                <div className="commission-card-title"><CreditCard size={14} /> Commission Breakdown</div>
                <div className="commission-card-sub">Current billing cycle</div>
              </div>
              <div className="commission-body">
                <div className="commission-row">
                  <div className="commission-row-label"><div className="commission-row-label-dot" style={{background: '#EA580C'}}></div> Commission Rate</div>
                  <div className="commission-row-value">10%</div>
                </div>
                <div className="commission-row">
                  <div className="commission-row-label"><div className="commission-row-label-dot" style={{background: '#DC2626'}}></div> Total Due</div>
                  <div className="commission-row-value due">Rs. {commDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="commission-row">
                  <div className="commission-row-label"><div className="commission-row-label-dot" style={{background: '#16A34A'}}></div> Total Paid</div>
                  <div className="commission-row-value paid">Rs. {commPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="commission-row">
                  <div className="commission-row-label"><div className="commission-row-label-dot" style={{background: '#A8A29E'}}></div> Next Due Date</div>
                  <div className="commission-row-value">
                    {safeData.nextDueDate ? new Date(safeData.nextDueDate).toLocaleDateString() : '—'}
                  </div>
                </div>
                
                <button className="pay-commission-btn" disabled={!commDue || commDue <= 0}>
                  Pay Commission Now <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-title"><Info size={14} style={{color: '#EA580C'}} /> How commission works</div>
              <div className="info-step">
                <div className="info-step-num">1</div>
                <div className="info-step-text">Customer pays you the <strong>full job amount</strong> directly</div>
              </div>
              <div className="info-step">
                <div className="info-step-num">2</div>
                <div className="info-step-text">DoorStep deducts <strong>10% commission</strong> from your earnings</div>
              </div>
              <div className="info-step">
                <div className="info-step-num">3</div>
                <div className="info-step-text">You keep the <strong>remaining 90%</strong> as your net earnings</div>
              </div>
              <div className="info-step">
                <div className="info-step-num">4</div>
                <div className="info-step-text">Commission is due <strong>monthly</strong> — pay via bank transfer</div>
              </div>
            </div>

            <div className="tips-card">
              <div className="tips-card-title"><Lightbulb size={14} /> Quick Tips</div>
              <div className="tip-item">Accept more jobs to increase your monthly earnings</div>
              <div className="tip-item">Pay commission on time to avoid account suspension</div>
              <div className="tip-item">Customers never see your commission deduction</div>
              <div className="tip-item">Top earners on DoorStep make over Rs. 80,000/month</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Earnings;
