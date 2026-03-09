import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createHotel } from '../api/client';
import { useToast } from '../components/toast';

export default function HotelAdd() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; address?: string }>({});
  const navigate = useNavigate();
  const toast = useToast();

  function validate(): boolean {
    const nameTrim = name.trim();
    const addressTrim = address.trim();
    const err: { name?: string; address?: string } = {};
    if (!nameTrim) err.name = 'Name is required';
    if (!addressTrim) err.address = 'Address is required';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const hotel = await createHotel({ name: name.trim(), address: address.trim() });
      toast.success('Hotel created.');
      navigate(`/hotels/${hotel.id}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create hotel');
      toast.error(e instanceof Error ? e.message : 'Failed to create hotel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link
        to="/hotels"
        className="mb-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to list
      </Link>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800 mb-6">Add Hotel</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
              }}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Hotel name"
            />
            {fieldErrors.name && (
              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (fieldErrors.address) setFieldErrors((p) => ({ ...p, address: undefined }));
              }}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Street, city, country"
            />
            {fieldErrors.address && (
              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.address}</p>
            )}
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
            <Link
              to="/hotels"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
