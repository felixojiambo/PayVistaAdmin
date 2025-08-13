'use client';
import { useState, useEffect } from 'react';

// Define the type for our salary detail object to match the backend
type SalaryDetail = {
  id: number;
  name: string;
  email: string;
  salary_in_local_currency: string;
  currency: string; // Add currency to the type
  salary_in_euros: string | null;
  commission: string;
  displayed_salary: number;
};

// Define a type for the saving status of each row
type SavingStatus = 'saving' | 'success' | 'error' | null;

export default function AdminPanel() {
  const [salaries, setSalaries] = useState<SalaryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState<{ [key: number]: SavingStatus }>({});

  // Fetch all salary records when the component mounts
  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salaries`);
        if (!response.ok) {
          throw new Error('Failed to fetch salary data. Is the backend running?');
        }
        const data = await response.json();
        setSalaries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);
  
  // Handles changes to the input fields, updating the local state
  const handleInputChange = (id: number, field: keyof SalaryDetail, value: string) => {
    setSalaries(salaries.map((s: SalaryDetail) => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Handles saving a single row's data to the backend
  const handleSave = async (id: number) => {
    const originalSalaries = [...salaries];
    const recordToSave = salaries.find((s: SalaryDetail) => s.id === id);

    if (!recordToSave) return;

    // Set status to 'saving' for this specific row
    setSavingStatus(prev => ({ ...prev, [id]: 'saving' }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            salary_in_local_currency: recordToSave.salary_in_local_currency,
            salary_in_euros: recordToSave.salary_in_euros,
            commission: recordToSave.commission,
        }),
      });

      if (!response.ok) throw new Error('Update failed on the server.');
      
      const updatedRecord = await response.json();
      setSalaries(salaries.map((s: SalaryDetail) => s.id === id ? updatedRecord : s));
      setSavingStatus(prev => ({ ...prev, [id]: 'success' }));

    } catch (error) {
        console.error("Failed to save:", error);
        setSalaries(originalSalaries); // Revert on failure
        setSavingStatus(prev => ({ ...prev, [id]: 'error' }));
        alert('Failed to save changes. Please check the console and try again.');
    } finally {
        // Reset the status icon after 2 seconds
        setTimeout(() => {
            setSavingStatus(prev => ({ ...prev, [id]: null }));
        }, 2000);
    }
  };

  if (loading) return <p className="text-center p-8">Loading dashboard...</p>;
  if (error) return <p className="text-center p-8 text-red-600">Error: {error}</p>;

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Salary Dashboard</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Salary (Local)</th>
              <th className="py-3 px-6">Salary (EUR)</th>
              <th className="py-3 px-6">Commission (EUR)</th>
              <th className="py-3 px-6">Displayed Salary (EUR)</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s: SalaryDetail) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{s.name}</td>
                <td className="py-4 px-6">{s.email}</td>
                <td className="py-4 px-6">
                   <div className="flex items-center space-x-2">
                     <input type="number" value={s.salary_in_local_currency} 
                            onChange={(e) => handleInputChange(s.id, 'salary_in_local_currency', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"/>
                     <span className="font-semibold text-gray-500">{s.currency}</span>
                   </div>
                </td>
                <td className="py-4 px-6">
                    <input type="number" value={s.salary_in_euros ?? ''} 
                           onChange={(e) => handleInputChange(s.id, 'salary_in_euros', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md"/>
                </td>
                <td className="py-4 px-6">
                    <input type="number" value={s.commission} 
                           onChange={(e) => handleInputChange(s.id, 'commission', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md"/>
                </td>
                <td className="py-4 px-6 font-semibold text-gray-900">{s.displayed_salary.toFixed(2)} €</td>
                <td className="py-4 px-6">
                  <button onClick={() => handleSave(s.id)} disabled={savingStatus[s.id] === 'saving'}
                          className="px-4 py-2 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400 bg-indigo-600 hover:bg-indigo-700">
                    {savingStatus[s.id] === 'saving' ? '...' : 
                     savingStatus[s.id] === 'success' ? '✓' :
                     savingStatus[s.id] === 'error' ? '!' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
