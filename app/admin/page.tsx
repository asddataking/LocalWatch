"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const reports = useQuery(api.reports.getAllReportsForAdmin, { limit: 100 }) ?? [];
  const deleteReport = useMutation(api.reports.deleteReport);
  const updateStatus = useMutation(api.reports.updateReportStatus);

  if (!isLoaded || !isSignedIn) {
    return <div className="p-8 text-center">Loading Admin...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[var(--navy)]" style={{ fontFamily: "Merriweather, serif" }}>Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user.firstName || "Admin"}</p>
        </div>
        <UserButton />
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-[var(--navy)]">Date</th>
              <th className="p-4 font-bold text-[var(--navy)]">Category</th>
              <th className="p-4 font-bold text-[var(--navy)]">Report</th>
              <th className="p-4 font-bold text-[var(--navy)]">Status</th>
              <th className="p-4 font-bold text-[var(--navy)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="p-4 whitespace-nowrap text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}<br/>
                  {new Date(r.createdAt).toLocaleTimeString()}
                </td>
                <td className="p-4 font-medium">{r.category}</td>
                <td className="p-4">
                  <strong className="block text-gray-900">{r.title}</strong>
                  <span className="text-gray-500 text-xs block truncate max-w-[200px]">{r.description}</span>
                  <span className="text-xs text-[var(--red)]">{r.isSpam ? "FLAGGED SPAM" : ""}</span>
                </td>
                <td className="p-4">
                  <select 
                    value={r.status}
                    onChange={(e) => updateStatus({ id: r._id, status: e.target.value })}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="UNVERIFIED">UNVERIFIED</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="HIDDEN">HIDDEN</option>
                    <option value="NEEDS REVIEW">NEEDS REVIEW</option>
                  </select>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this report?")) {
                        deleteReport({ id: r._id });
                      }
                    }}
                    className="text-red-600 hover:text-red-800 font-bold text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
