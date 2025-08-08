import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import api from "../../lib/axiosInstance";

// Define transaction types
interface Transaction {
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  invitation_code: string;
}

interface TransactionResponse {
  investor_id: string;
  transactions: Transaction[];
  pagination: {
    page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  success: boolean;
}

const Transactions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'failed'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total_records: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });

  // Function to map API status to display status
  const getStatusDisplay = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'waiting' || statusLower === 'pending') {
      return 'pending';
    }
    if (statusLower === 'approved') {
      return 'approved';
    }
    if (statusLower === 'failed') {
      return 'failed';
    }
    return statusLower;
  };

  const fetchTransactions = async (isLoadingMore = false) => {
    try {
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Get userId from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      // Determine status filter based on active tab
      let statusFilter = '';
      if (activeTab === 'pending') statusFilter = 'pending';
      if (activeTab === 'failed') statusFilter = 'failed';
      
      const response = await api.get<TransactionResponse>('/subadmin/investors/transactions', {
        params: {
          investor_id: userId,
          page: pagination.page,
          per_page: pagination.per_page,
          ...(activeTab !== 'all' && { status: statusFilter })
        }
      });
      
      if (response.data.success) {
        if (isLoadingMore) {
          setTransactions(prev => [...prev, ...response.data.transactions]);
        } else {
          setTransactions(response.data.transactions);
        }
        setPagination(response.data.pagination);
      } else {
        throw new Error("Failed to fetch transactions");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again later.");
      if (!isLoadingMore) {
        setTransactions([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more transactions when user scrolls to the bottom
  const loadMoreTransactions = useCallback(() => {
    if (pagination.has_next && !loadingMore) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.has_next, loadingMore]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.has_next && !loadingMore) {
        loadMoreTransactions();
      }
    });
    
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, pagination.has_next, loadMoreTransactions, loadingMore]);

  // Fetch transactions when component mounts or active tab changes
  useEffect(() => {
    // Reset pagination when tab changes
    setPagination(prev => ({ ...prev, page: 1 }));
    setTransactions([]);
  }, [activeTab]);

  // Fetch transactions when pagination page changes
  useEffect(() => {
    const isLoadingMore = pagination.page > 1;
    fetchTransactions(isLoadingMore);
  }, [pagination.page, activeTab]);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Format amount with currency
  const formatAmount = (amount: number, currency: string) => {
    if (currency === "INR") return `₹${amount.toLocaleString('en-IN')}`;
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get appropriate status badge based on transaction status
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'pending' || statusLower === 'waiting') {
      return (
        <span className="inline-block bg-yellow-800/30 text-yellow-400 text-xs px-2 py-0.5 rounded">
          {status}
        </span>
      );
    }
    
    if (statusLower === 'approved' || statusLower === 'success' || statusLower === 'completed') {
      return (
        <span className="inline-block bg-green-800/30 text-green-400 text-xs px-2 py-0.5 rounded">
          {status}
        </span>
      );
    }
    
    if (statusLower === 'failed' || statusLower === 'rejected' || statusLower === 'cancelled') {
      return (
        <span className="inline-block bg-red-800/30 text-red-400 text-xs px-2 py-0.5 rounded">
          {status}
        </span>
      );
    }
    
    // Default case for any other status
    return (
      <span className="inline-block bg-gray-800/30 text-gray-400 text-xs px-2 py-0.5 rounded">
        {status}
      </span>
    );
  };

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
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error && transactions.length === 0 ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        ) : transactions.length > 0 ? (
          <>
            {transactions.map((transaction, index) => (
              <div 
                key={index}
                className="flex items-center border-b border-gray-800 p-3"
              >
                {/* Transaction icon */}
                <div className="w-10 h-10 bg-purple-100 rounded mr-3 flex items-center justify-center">
                  <span className="text-xs text-purple-800 font-medium">
                    {transaction.transaction_type.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Transaction Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{transaction.transaction_type}</h3>
                      <p className="text-xs text-gray-400">
                        {formatDate(transaction.created_at)} • {transaction.invitation_code || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatAmount(transaction.amount, transaction.currency)}</p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Infinite scroll loader */}
            <div 
              ref={loadMoreRef} 
              className="py-4 flex justify-center"
            >
              {loadingMore && (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              )}
            </div>
          </>
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
