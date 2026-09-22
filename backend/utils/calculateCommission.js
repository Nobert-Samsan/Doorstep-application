const calculateCommission = (amount) => {
  const rate = process.env.COMMISSION_RATE ? parseFloat(process.env.COMMISSION_RATE) : 10;
  const commissionAmount = (amount * rate) / 100;
  const workerNetAmount = amount - commissionAmount;
  return {
    commissionAmount: parseFloat(commissionAmount.toFixed(2)),
    workerNetAmount: parseFloat(workerNetAmount.toFixed(2))
  };
};

module.exports = calculateCommission;
