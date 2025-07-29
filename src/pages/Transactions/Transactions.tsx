import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

// Define transaction types
interface Transaction {
  id: string;
  company: string;
  category: string;
  subcategory: string;
  amount: string;
  status: "approved" | "waiting" | "failed";
}

const Transactions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'failed'>('all');

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: "1",
      company: "Infotech Pvt. Ltd.",
      category: "ED-TECH",
      subcategory: "SEED",
      amount: "₹18.25L",
      status: "waiting",
    },
    {
      id: "2",
      company: "Infotech Pvt. Ltd.",
      category: "ED-TECH",
      subcategory: "SEED",
      amount: "₹18.25L",
      status: "waiting",
    },
    {
      id: "3",
      company: "Infotech Pvt. Ltd.",
      category: "ED-TECH",
      subcategory: "SEED",
      amount: "₹18.25L",
      status: "approved",
    },
    {
      id: "4",
      company: "Infotech Pvt. Ltd.",
      category: "ED-TECH",
      subcategory: "SEED",
      amount: "₹18.25L",
      status: "approved",
    },
  ];

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return transaction.status === 'waiting';
    if (activeTab === 'failed') return transaction.status === 'failed';
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 text-white"
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-medium">Transactions</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-3 bg-black">
        <button
          className={`px-2 py-1 text-sm rounded ${
            activeTab === 'all' 
              ? 'bg-white text-black' 
              : 'bg-[#212121] text-white'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All transactions
        </button>
        <button
          className={`px-2 py-1 text-sm rounded ${
            activeTab === 'pending' 
              ? 'bg-white text-black' 
              : 'bg-[#212121] text-white'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-2 py-1 text-sm rounded ${
            activeTab === 'failed' 
              ? 'bg-white text-black' 
              : 'bg-[#212121] text-white'
          }`}
          onClick={() => setActiveTab('failed')}
        >
          Failed
        </button>
      </div>

      {/* Transaction List */}
      <div>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center border-b border-gray-800 p-3"
            >
              {/* Company Logo/Icon */}
              <div className="w-10 h-10 bg-purple-100 rounded mr-3 flex items-center justify-center">
                <span className="text-xs text-purple-800 font-medium">S</span>
              </div>
              
              {/* Transaction Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{transaction.company}</h3>
                    <p className="text-xs text-gray-400">{transaction.category} • {transaction.subcategory}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{transaction.amount}</p>
                    {transaction.status === 'waiting' && (
                      <span className="inline-block bg-transparent text-xs text-red-500">
                        Waiting for approval
                      </span>
                    )}
                    {transaction.status === 'approved' && (
                      <span className="inline-block bg-green-900 text-xs text-white px-2 py-0.5 rounded">
                        Shares assigned
                      </span>
                    )}
                    {transaction.status === 'failed' && (
                      <span className="inline-block bg-transparent text-xs text-red-500">
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
