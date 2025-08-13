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
  // Store the original fetched data to revert changes on "Cancel"
  const [originalSalaries, setOriginalSalaries] = useState<SalaryDetail[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState<{ [key: number]: SavingStatus }>({});
  // New state to track which row is being edited
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

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
        setOriginalSalaries(data); // Keep a copy of the original data
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
    const recordToSave = salaries.find((s: SalaryDetail) => s.id === id);
    if (!recordToSave) return;

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
      // Update both salaries and originalSalaries to reflect the saved state
      const newSalaries = salaries.map((s: SalaryDetail) => s.id === id ? updatedRecord : s);
      setSalaries(newSalaries);
      setOriginalSalaries(newSalaries);
      setSavingStatus(prev => ({ ...prev, [id]: 'success' }));
      setEditingRowId(null); // Exit editing mode on successful save

    } catch (error) {
        console.error("Failed to save:", error);
        setSavingStatus(prev => ({ ...prev, [id]: 'error' }));
        alert('Failed to save changes. Please check the console and try again.');
    } finally {
        setTimeout(() => {
            setSavingStatus(prev => ({ ...prev, [id]: null }));
        }, 2000);
    }
  };

  // Handle canceling an edit, reverting changes for that row
  const handleCancel = (id: number) => {
    setSalaries(originalSalaries); // Revert all changes to the last saved state
    setEditingRowId(null);
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
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s: SalaryDetail) => {
              const isEditing = editingRowId === s.id;
              return (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{s.name}</td>
                  <td className="py-4 px-6">{s.email}</td>
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <div className="flex relative">
                        <input type="number" value={s.salary_in_local_currency} onChange={(e) => handleInputChange(s.id, 'salary_in_local_currency', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-14"/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 font-semibold text-gray-500 pointer-events-none">{s.currency}</span>
                      </div>
                    ) : (
                      `${s.salary_in_local_currency} ${s.currency}`
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input type="number" value={s.salary_in_euros ?? ''} onChange={(e) => handleInputChange(s.id, 'salary_in_euros', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
                    ) : (
                      s.salary_in_euros
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {isEditing ? (
                      <input type="number" value={s.commission} onChange={(e) => handleInputChange(s.id, 'commission', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
                    ) : (
                      s.commission
                    )}
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{s.displayed_salary.toFixed(2)} €</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      {isEditing ? (
                        <>
                          <button onClick={() => handleSave(s.id)} disabled={savingStatus[s.id] === 'saving'} className="px-4 py-2 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400 bg-green-600 hover:bg-green-700">
                            {savingStatus[s.id] === 'saving' ? '...' : savingStatus[s.id] === 'success' ? '✓' : 'Save'}
                          </button>
                          <button onClick={() => handleCancel(s.id)} className="px-4 py-2 text-gray-700 font-semibold bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditingRowId(s.id)} disabled={editingRowId !== null} className="px-4 py-2 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400 bg-indigo-600 hover:bg-indigo-700">
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
