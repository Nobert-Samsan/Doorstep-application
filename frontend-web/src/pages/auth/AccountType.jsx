import React from 'react';
import { Link } from 'react-router-dom';

const AccountType = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-text-primary">Join DoorStep</h2>
      <p className="text-center text-text-secondary mb-8">Choose how you want to use the platform.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/register/customer" className="border-2 border-border rounded-lg p-6 hover:border-primary text-center group transition-colors bg-card-bg">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary">Customer</h3>
          <p className="text-sm text-text-secondary mt-2">I want to find skilled workers for my home needs.</p>
        </Link>
        
        <Link to="/register/worker" className="border-2 border-border rounded-lg p-6 hover:border-primary text-center group transition-colors bg-card-bg">
          <div className="text-4xl mb-4">🛠️</div>
          <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary">Worker</h3>
          <p className="text-sm text-text-secondary mt-2">I want to offer my services and find jobs.</p>
        </Link>
      </div>
      
      <div className="mt-8 text-center">
        <Link to="/login" className="text-sm text-secondary hover:text-primary">Already have an account? Log in</Link>
      </div>
    </div>
  );
};

export default AccountType;
