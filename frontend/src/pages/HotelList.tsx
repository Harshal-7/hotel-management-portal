import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { getHotels, deleteHotel, createHotel, updateHotel, type Hotel } from '../api/client';
import { useToast } from '../components/toast';
import { Modal } from '../components/Modal';

function useHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = () => {
    setLoading(true);
    setError('');
    getHotels()
      .then(setHotels)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load hotels'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    getHotels()
      .then((data) => {
        if (!cancelled) setHotels(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load hotels');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { hotels, setHotels, loading, error, setError, refetch };
}

export default function HotelList() {
  const { hotels, setHotels, loading, error, setError, refetch } = useHotels();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalHotel, setEditModalHotel] = useState<Hotel | null>(null);
  const [editReturnToPath, setEditReturnToPath] = useState<string | null>(null);
  const [deleteModalHotel, setDeleteModalHotel] = useState<Hotel | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Open add modal when navigating from header "Add Hotel" with state
  useEffect(() => {
    if ((location.state as { openAdd?: boolean })?.openAdd) {
      setAddModalOpen(true);
      navigate('/hotels', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Open edit modal when navigating from View page "Edit" with state
  useEffect(() => {
    const state = location.state as { openEdit?: Hotel; returnTo?: string } | undefined;
    if (state?.openEdit) {
      setEditModalHotel(state.openEdit);
      setEditReturnToPath(state.returnTo ?? null);
      navigate('/hotels', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Add form state
  const [addName, setAddName] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addFieldErrors, setAddFieldErrors] = useState<{ name?: string; address?: string }>({});

  function validateAdd(): boolean {
    const nameTrim = addName.trim();
    const addressTrim = addAddress.trim();
    const err: { name?: string; address?: string } = {};
    if (!nameTrim) err.name = 'Name is required';
    if (!addressTrim) err.address = 'Address is required';
    setAddFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  function closeAddModal() {
    setAddModalOpen(false);
    setAddName('');
    setAddAddress('');
    setAddError('');
    setAddFieldErrors({});
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    if (!validateAdd()) return;
    setAddLoading(true);
    try {
      await createHotel({ name: addName.trim(), address: addAddress.trim() });
      toast.success('Hotel created.');
      closeAddModal();
      refetch();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Failed to create hotel');
      toast.error(e instanceof Error ? e.message : 'Failed to create hotel');
    } finally {
      setAddLoading(false);
    }
  }

  // Edit form state (synced when editModalHotel opens)
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editFieldErrors, setEditFieldErrors] = useState<{ name?: string; address?: string }>({});

  useEffect(() => {
    if (editModalHotel) {
      setEditName(editModalHotel.name);
      setEditAddress(editModalHotel.address);
      setEditError('');
      setEditFieldErrors({});
    }
  }, [editModalHotel]);

  function validateEdit(): boolean {
    const nameTrim = editName.trim();
    const addressTrim = editAddress.trim();
    const err: { name?: string; address?: string } = {};
    if (!nameTrim) err.name = 'Name is required';
    if (!addressTrim) err.address = 'Address is required';
    setEditFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  function closeEditModal() {
    if (editReturnToPath) {
      navigate(editReturnToPath);
      setEditReturnToPath(null);
    }
    setEditModalHotel(null);
    setEditName('');
    setEditAddress('');
    setEditError('');
    setEditFieldErrors({});
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editModalHotel) return;
    setEditError('');
    if (!validateEdit()) return;
    const nameTrim = editName.trim();
    const addressTrim = editAddress.trim();
    if (nameTrim === editModalHotel.name && addressTrim === editModalHotel.address) {
      toast.info('No changes to save');
      closeEditModal();
      return;
    }
    setEditLoading(true);
    try {
      await updateHotel(editModalHotel.id, { name: nameTrim, address: addressTrim });
      toast.success('Hotel updated.');
      closeEditModal();
      refetch();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to update hotel');
      toast.error(e instanceof Error ? e.message : 'Failed to update hotel');
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteModalHotel) return;
    const hotel = deleteModalHotel;
    setDeletingId(hotel.id);
    setError('');
    try {
      await deleteHotel(hotel.id);
      setHotels((prev) => prev.filter((h) => h.id !== hotel.id));
      toast.success(`Deleted "${hotel.name}".`);
      setDeleteModalHotel(null);
      refetch();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to delete hotel';
      setError(msg);
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
        Loading hotels…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Hotels</h1>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="rounded-md px-3 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors cursor-pointer"
        >
          Add Hotel
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {hotels.length === 0 && !error ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No hotels yet. Add one to get started.</p>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-700 cursor-pointer"
          >
            Add your first hotel →
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              <tr>
                <th className="text-left py-3.5 px-4 text-sm font-semibold text-slate-700">
                  Name
                </th>
                <th className="text-left py-3.5 px-4 text-sm font-semibold text-slate-700">
                  Address
                </th>
                <th className="text-right py-3.5 px-4 text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-800 font-medium">{hotel.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{hotel.address}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 font-medium text-sm mr-4 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      {/* View */}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditModalHotel(hotel)}
                      className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 font-medium text-sm mr-4 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                      {/* Edit */}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModalHotel(hotel)}
                      disabled={deletingId === hotel.id}
                      className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      {/* {deletingId === hotel.id ? 'Deleting…' : 'Delete'} */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Hotel modal */}
      <Modal open={addModalOpen} onClose={closeAddModal} title="Add Hotel">
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="add-name"
              type="text"
              value={addName}
              onChange={(e) => {
                setAddName(e.target.value);
                if (addFieldErrors.name) setAddFieldErrors((p) => ({ ...p, name: undefined }));
              }}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Hotel name"
            />
            {addFieldErrors.name && (
              <p className="mt-1.5 text-sm text-red-600">{addFieldErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="add-address" className="block text-sm font-medium text-slate-700 mb-1.5">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="add-address"
              type="text"
              value={addAddress}
              onChange={(e) => {
                setAddAddress(e.target.value);
                if (addFieldErrors.address)
                  setAddFieldErrors((p) => ({ ...p, address: undefined }));
              }}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Street, city, country"
            />
            {addFieldErrors.address && (
              <p className="mt-1.5 text-sm text-red-600">{addFieldErrors.address}</p>
            )}
          </div>
          {addError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {addError}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={addLoading}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
            >
              {addLoading ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={closeAddModal}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Hotel modal */}
      <Modal open={!!editModalHotel} onClose={closeEditModal} title="Edit Hotel">
        {editModalHotel && (
          <form onSubmit={handleEditSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="edit-name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  if (editFieldErrors.name)
                    setEditFieldErrors((p) => ({ ...p, name: undefined }));
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="Hotel name"
              />
              {editFieldErrors.name && (
                <p className="mt-1.5 text-sm text-red-600">{editFieldErrors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="edit-address"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-address"
                type="text"
                value={editAddress}
                onChange={(e) => {
                  setEditAddress(e.target.value);
                  if (editFieldErrors.address)
                    setEditFieldErrors((p) => ({ ...p, address: undefined }));
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="Street, city, country"
              />
              {editFieldErrors.address && (
                <p className="mt-1.5 text-sm text-red-600">{editFieldErrors.address}</p>
              )}
            </div>
            {editError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {editError}
              </p>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={editLoading}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
              >
                {editLoading ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteModalHotel}
        onClose={() => setDeleteModalHotel(null)}
        title="Delete hotel?"
      >
        {deleteModalHotel && (
          <>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete &quot;{deleteModalHotel.name}&quot;? This cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteModalHotel(null)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletingId === deleteModalHotel.id}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
              >
                {deletingId === deleteModalHotel.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
