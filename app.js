const { useState, useEffect, useCallback } = React;

// Mock data
const mockData = {
  mockTasks: [
    {
      id: "task_001",
      pickupAddress: "Andheri East, Mumbai",
      dropoffAddress: "Bandra West, Mumbai", 
      packageDescription: "Documents",
      suggestedFee: 150,
      status: "OPEN",
      distance: "8.5 km",
      estimatedTime: "25 mins"
    },
    {
      id: "task_002", 
      pickupAddress: "Malad West, Mumbai",
      dropoffAddress: "Goregaon East, Mumbai",
      packageDescription: "Food",
      suggestedFee: 80,
      status: "OPEN", 
      distance: "4.2 km",
      estimatedTime: "15 mins"
    },
    {
      id: "task_003",
      pickupAddress: "Powai, Mumbai",
      dropoffAddress: "Thane West",
      packageDescription: "Electronics", 
      suggestedFee: 200,
      status: "OPEN",
      distance: "12.8 km", 
      estimatedTime: "35 mins"
    }
  ],
  packageTypes: [
    "Documents",
    "Food", 
    "Electronics",
    "Clothing",
    "Medicine",
    "Books",
    "Other"
  ],
  countryCodes: [
    {code: "+91", country: "India"},
    {code: "+1", country: "USA"},
    {code: "+44", country: "UK"}
  ],
  mockUser: {
    id: "user_123",
    phone: "+911234567890",
    rating: 4.5,
    totalDeliveries: 23,
    role: null
  },
  statusFlow: {
    "OPEN": "Task created, waiting for rider",
    "ACCEPTED": "Rider assigned, heading to pickup",
    "IN_TRANSIT": "Package picked up, en route to destination", 
    "COMPLETED": "Package delivered successfully"
  }
};

// Utility Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl cursor-pointer transition-all hover:scale-110 ${
            star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Authentication Components
const PhoneLogin = ({ onLogin }) => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin(countryCode + phoneNumber);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13l2.5-5m6.5 5l2.5-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to DropKart</h1>
          <p className="text-gray-600 mt-2">Enter your phone number to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-l-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mockData.countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} {country.country}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter phone number"
                className="flex-1 px-3 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="10"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner /> : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

const OTPVerification = ({ phoneNumber, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (otpCode === "123456") { // Mock OTP
        onVerify();
      } else {
        setError("Invalid OTP. Use 123456 for demo");
      }
    }, 1000);
  };

  // Inline styles for OTP inputs to ensure visibility
  const otpInputStyle = {
    width: '45px',
    height: '45px',
    border: '2px solid #E5E7EB',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  };

  const otpInputFocusStyle = {
    borderColor: '#3B82F6',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Verify Phone Number</h1>
          <p className="text-gray-600 mt-2">
            Enter the OTP sent to {phoneNumber}
          </p>
          <p className="text-sm text-blue-500 mt-2 font-medium">Demo OTP: 123456</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                style={otpInputStyle}
                onFocus={(e) => Object.assign(e.target.style, otpInputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, otpInputStyle)}
                maxLength="1"
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner /> : "Verify OTP"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {timer > 0 ? (
                `Resend OTP in ${timer}s`
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(30)}
                  className="text-blue-500 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Role Selection Component
const RoleSelection = ({ onRoleSelect, user }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hello!</h1>
          <p className="text-gray-600 mt-2">How would you like to use DropKart today?</p>
          
          {user.rating && (
            <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <StarRating rating={user.rating} readonly />
                <span className="text-sm text-gray-600">
                  {user.totalDeliveries} deliveries
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect('sender')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg font-medium text-lg transition-all hover:shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            I need a delivery
          </button>

          <button
            onClick={() => onRoleSelect('rider')}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg font-medium text-lg transition-all hover:shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            I can deliver
          </button>
        </div>
      </div>
    </div>
  );
};

// Sender Components
const TaskCreationForm = ({ onTaskCreated, onBack }) => {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    packageDescription: "Documents",
    suggestedFee: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pickupAddress.trim()) newErrors.pickupAddress = "Pickup address is required";
    if (!formData.dropoffAddress.trim()) newErrors.dropoffAddress = "Drop-off address is required";
    if (!formData.suggestedFee || formData.suggestedFee < 10) newErrors.suggestedFee = "Fee must be at least ₹10";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTask = {
        id: `task_${Date.now()}`,
        ...formData,
        suggestedFee: parseInt(formData.suggestedFee),
        status: "OPEN",
        distance: "~5 km",
        estimatedTime: "15-20 mins"
      };
      
      setLoading(false);
      onTaskCreated(newTask);
    }, 1000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Create Delivery Task</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Pickup Address
            </label>
            <input
              type="text"
              value={formData.pickupAddress}
              onChange={(e) => handleChange('pickupAddress', e.target.value)}
              placeholder="Enter pickup location"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 100 4h14a2 2 0 100-4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Drop-off Address
            </label>
            <input
              type="text"
              value={formData.dropoffAddress}
              onChange={(e) => handleChange('dropoffAddress', e.target.value)}
              placeholder="Enter destination"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dropoffAddress && <p className="text-red-500 text-sm mt-1">{errors.dropoffAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
            <select
              value={formData.packageDescription}
              onChange={(e) => handleChange('packageDescription', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mockData.packageTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Fee (₹)</label>
            <input
              type="number"
              value={formData.suggestedFee}
              onChange={(e) => handleChange('suggestedFee', e.target.value)}
              placeholder="Enter amount"
              min="10"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.suggestedFee && <p className="text-red-500 text-sm mt-1">{errors.suggestedFee}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner /> : "Post Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

const TaskConfirmation = ({ task, onNewTask, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Task Posted Successfully!</h1>
          <p className="text-gray-600 mt-2">Your delivery request is now live</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">From:</p>
              <p className="font-medium">{task.pickupAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To:</p>
              <p className="font-medium">{task.dropoffAddress}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Package:</p>
                <p className="font-medium">{task.packageDescription}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Fee:</p>
                <p className="font-medium text-blue-500">₹{task.suggestedFee}</p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">
                Status: {mockData.statusFlow.OPEN}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNewTask}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Create Another Task
          </button>
          <button
            onClick={onBack}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// Rider Components
const RiderMap = ({ tasks, onTaskSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Available Tasks</h1>
          <div className="w-9 h-9"></div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-gray-200 rounded-lg p-4 mb-4 min-h-[300px] relative overflow-hidden">
          <div className="text-center text-gray-600 mt-8">
            <svg className="w-12 h-12 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-sm">Map View - {tasks.filter(t => t.status === 'OPEN').length} tasks nearby</p>
          </div>
          {/* Simulate map pins */}
          <div 
            className="absolute w-3 h-3 bg-blue-500 rounded-full animate-pulse" 
            style={{top: '20%', left: '30%'}}
          ></div>
          <div 
            className="absolute w-3 h-3 bg-blue-500 rounded-full animate-pulse" 
            style={{top: '50%', left: '60%'}}
          ></div>
          <div 
            className="absolute w-3 h-3 bg-blue-500 rounded-full animate-pulse" 
            style={{top: '70%', left: '25%'}}
          ></div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tasks.filter(task => task.status === 'OPEN').map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskSelect(task)}
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.pickupAddress}</p>
                  <p className="text-gray-600 text-sm">to {task.dropoffAddress}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-500">₹{task.suggestedFee}</p>
                  <p className="text-xs text-gray-500">{task.distance}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {task.packageDescription}
                </span>
                <span className="text-gray-500">{task.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskDetail = ({ task, onAccept, onUpdateStatus, onBack, userRole }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (action === 'accept') {
        onAccept(task.id);
      } else {
        onUpdateStatus(task.id, action);
      }
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'bg-gray-100 text-gray-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Task Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-500">₹{task.suggestedFee}</p>
              <p className="text-sm text-gray-500">{task.distance} • {task.estimatedTime}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <p className="text-sm text-gray-600">Pickup Location</p>
              </div>
              <p className="font-medium ml-6">{task.pickupAddress}</p>
            </div>

            <div className="ml-6 border-l-2 border-gray-200 h-8"></div>

            <div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <p className="text-sm text-gray-600">Drop-off Location</p>
              </div>
              <p className="font-medium ml-6">{task.dropoffAddress}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Package Details</p>
            <p className="font-medium">{task.packageDescription}</p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {mockData.statusFlow[task.status]}
            </p>
          </div>
        </div>

        {userRole === 'rider' && (
          <div className="space-y-3">
            {task.status === 'OPEN' && (
              <button
                onClick={() => handleAction('accept')}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : "Accept Task"}
              </button>
            )}

            {task.status === 'ACCEPTED' && (
              <button
                onClick={() => handleAction('IN_TRANSIT')}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : "Package Picked Up"}
              </button>
            )}

            {task.status === 'IN_TRANSIT' && (
              <button
                onClick={() => handleAction('COMPLETED')}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? <LoadingSpinner /> : "Package Delivered"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Rating Component
const RatingScreen = ({ task, userRole, onRatingSubmit, onSkip }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRatingSubmit(rating);
    }, 1000);
  };

  const roleText = userRole === 'sender' ? 'rider' : 'sender';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Task Completed!</h1>
          <p className="text-gray-600 mt-2">How was your experience with the {roleText}?</p>
        </div>

        <div className="text-center mb-6">
          <StarRating rating={rating} onRatingChange={setRating} />
          <p className="text-sm text-gray-500 mt-2">
            {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner /> : "Submit Rating"}
          </button>
          
          <button
            onClick={onSkip}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            Skip Rating
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const DropKartApp = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(mockData.mockUser);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tasks, setTasks] = useState(mockData.mockTasks);
  const [currentTask, setCurrentTask] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (phone) => {
    setPhoneNumber(phone);
    setCurrentScreen('otp');
  };

  const handleOTPVerify = () => {
    setUser(prev => ({ ...prev, phone: phoneNumber }));
    setCurrentScreen('roleSelect');
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);
    if (role === 'sender') {
      setCurrentScreen('taskForm');
    } else {
      setCurrentScreen('riderMap');
    }
  };

  const handleTaskCreated = (task) => {
    setTasks(prev => [...prev, task]);
    setCurrentTask(task);
    setCurrentScreen('taskConfirmation');
  };

  const handleTaskSelect = (task) => {
    setCurrentTask(task);
    setCurrentScreen('taskDetail');
  };

  const handleTaskAccept = (taskId) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: 'ACCEPTED' } : task
      )
    );
    setCurrentTask(prev => ({ ...prev, status: 'ACCEPTED' }));
  };

  const handleStatusUpdate = (taskId, status) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    );
    setCurrentTask(prev => ({ ...prev, status }));
    
    if (status === 'COMPLETED') {
      setCurrentScreen('rating');
    }
  };

  const handleRatingSubmit = (rating) => {
    console.log('Rating submitted:', rating);
    setCurrentScreen('roleSelect');
    setCurrentTask(null);
    setUserRole(null);
  };

  const handleBack = () => {
    switch(currentScreen) {
      case 'taskForm':
      case 'riderMap':
        setCurrentScreen('roleSelect');
        setUserRole(null);
        break;
      case 'taskDetail':
        if (userRole === 'rider') {
          setCurrentScreen('riderMap');
        } else {
          setCurrentScreen('roleSelect');
        }
        setCurrentTask(null);
        break;
      case 'taskConfirmation':
        setCurrentScreen('roleSelect');
        setCurrentTask(null);
        setUserRole(null);
        break;
      default:
        setCurrentScreen('roleSelect');
    }
  };

  const renderScreen = () => {
    switch(currentScreen) {
      case 'login':
        return <PhoneLogin onLogin={handleLogin} />;
      
      case 'otp':
        return <OTPVerification phoneNumber={phoneNumber} onVerify={handleOTPVerify} />;
      
      case 'roleSelect':
        return <RoleSelection onRoleSelect={handleRoleSelect} user={user} />;
      
      case 'taskForm':
        return <TaskCreationForm onTaskCreated={handleTaskCreated} onBack={handleBack} />;
      
      case 'taskConfirmation':
        return (
          <TaskConfirmation 
            task={currentTask} 
            onNewTask={() => setCurrentScreen('taskForm')}
            onBack={handleBack}
          />
        );
      
      case 'riderMap':
        return <RiderMap tasks={tasks} onTaskSelect={handleTaskSelect} onBack={handleBack} />;
      
      case 'taskDetail':
        return (
          <TaskDetail 
            task={currentTask}
            onAccept={handleTaskAccept}
            onUpdateStatus={handleStatusUpdate}
            onBack={handleBack}
            userRole={userRole}
          />
        );
      
      case 'rating':
        return (
          <RatingScreen 
            task={currentTask}
            userRole={userRole}
            onRatingSubmit={handleRatingSubmit}
            onSkip={() => handleRatingSubmit(0)}
          />
        );
      
      default:
        return <PhoneLogin onLogin={handleLogin} />;
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      {renderScreen()}
    </div>
  );
};

// Render the app
ReactDOM.render(<DropKartApp />, document.getElementById('root'));