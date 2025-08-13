'use client';
import { useState, useEffect } from 'react';

// Define the type for our salary detail object to match the backend
type SalaryDetail = {
  id: number;
  name: string;
  email: string;
  salary_in_local_currency: string;
  salary_in_euros: string | null;
  commission: string;
  displayed_salary: number;
};

export default function AdminPanel() {
  const [salaries, setSalaries] = useState<SalaryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  
  // Handler to update a specific field for a record
  const handleUpdate = async (id: number, field: string, value: string) => {
    const originalSalaries = [...salaries];
    
    // Optimistically update the UI for a better user experience
    setSalaries(salaries.map(s => s.id === id ? { ...s, [field]: value } : s));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) throw new Error('Update failed on the server.');
      
      // Update the state with the final record from the server to ensure consistency
      const updatedRecord = await response.json();
      setSalaries(salaries.map(s => s.id === id ? updatedRecord : s));

    } catch (error) {
        console.error("Failed to update:", error);
        // If the update fails, revert the UI to its original state
        setSalaries(originalSalaries);
        alert('Failed to save changes. Please check the console and try again.');
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
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{s.name}</td>
                <td className="py-4 px-6">{s.email}</td>
                <td className="py-4 px-6">
                   <input type="number" defaultValue={s.salary_in_local_currency} 
                          onBlur={(e) => handleUpdate(s.id, 'salary_in_local_currency', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                </td>
                <td className="py-4 px-6">
                    <input type="number" defaultValue={s.salary_in_euros ?? ''} 
                           onBlur={(e) => handleUpdate(s.id, 'salary_in_euros', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                </td>
                <td className="py-4 px-6">
                    <input type="number" defaultValue={s.commission} 
                           onBlur={(e) => handleUpdate(s.id, 'commission', e.target.value)}
                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                </td>
                 <td className="py-4 px-6 font-semibold text-gray-900">{s.displayed_salary.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
