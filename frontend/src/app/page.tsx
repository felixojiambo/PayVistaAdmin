'use client';
import { useState, FormEvent } from 'react';

export default function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState(''); // New state for currency
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          salary_in_local_currency: salary,
          currency, // Send the currency
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = Object.values(data).flat().join(', ');
        throw new Error(errorMessages || 'An unknown error occurred.');
      }

      setMessage('Your details have been submitted successfully!');
      setName('');
      setEmail('');
      setSalary('');
      setCurrency(''); // Clear currency on success
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Submit Your Salary Details</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Email inputs */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          {/* New Currency Dropdown */}
          //I have hardcoded currencies for showing, in production I will use api 
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="" disabled>Select Currency</option>
              <option value="KES">KES (Kenyan Shilling)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (British Pound)</option>
              <option value="INR">INR (Indian Rupee)</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary Amount</label>
            <input type="number" id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} required placeholder="e.g., 150000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center text-sm ${message.startsWith('Error:') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
