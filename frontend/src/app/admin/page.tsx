'use client';
import { useState, useEffect } from 'react';

// Define the type for our salary detail object
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

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salaries`);
        if (!response.ok) throw new Error('Failed to fetch data');
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
  
  // Handler to update a field
  const handleUpdate = async (id: number, field: string, value: string) => {
    // Optimistically update UI
    const originalSalaries = [...salaries];
    setSalaries(salaries.map(s => s.id === id ? { ...s, [field]: value } : s));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (!response.ok) throw new Error('Update failed');
      // Re-fetch or update with response data for accuracy
      const updatedRecord = await response.json();
      setSalaries(salaries.map(s => s.id === id ? updatedRecord : s));

    } catch (error) {
        console.error("Failed to update:", error);
        // Revert on failure
        setSalaries(originalSalaries);
        alert('Failed to save changes. Please try again.');
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Salary Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          {/* Table headers */}
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Salary (Local)</th>
              <th className="py-2 px-4 border-b">Salary (EUR)</th>
              <th className="py-2 px-4 border-b">Commission (EUR)</th>
              <th className="py-2 px-4 border-b">Displayed Salary (EUR)</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <tr key={s.id}>
                <td className="py-2 px-4 border-b">{s.name}</td>
                <td className="py-2 px-4 border-b">{s.email}</td>
                {/* Editable Fields */}
                <td className="py-2 px-4 border-b">
                   <input type="number" defaultValue={s.salary_in_local_currency} onBlur={(e) => handleUpdate(s.id, 'salary_in_local_currency', e.target.value)}
                           className="w-full p-1 border rounded"/>
                </td>
                <td className="py-2 px-4 border-b">
                    <input type="number" defaultValue={s.salary_in_euros ?? ''} onBlur={(e) => handleUpdate(s.id, 'salary_in_euros', e.target.value)}
                           className="w-full p-1 border rounded"/>
                </td>
                <td className="py-2 px-4 border-b">
                    <input type="number" defaultValue={s.commission} onBlur={(e) => handleUpdate(s.id, 'commission', e.target.value)}
                           className="w-full p-1 border rounded"/>
                </td>
                 <td className="py-2 px-4 border-b font-semibold">{s.displayed_salary.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}