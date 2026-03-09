import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { getHotel, deleteHotel, type Hotel } from '../api/client';
import { useToast } from '../components/toast';
import { Modal } from '../components/Modal';

export default function HotelView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const numId = id ? parseInt(id, 10) : NaN;
    if (Number.isNaN(numId)) {
      setError('Invalid hotel id');
      setLoading(false);
      return;
    }
    let cancelled = false;
    getHotel(numId)
      .then((data) => {
        if (!cancelled) setHotel(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load hotel');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
        Loading…
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div>
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error ?? 'Hotel not found'}
        </p>
        <Link to="/hotels" className="text-sm font-medium text-violet-600 hover:text-violet-700">
          ← Back to list
        </Link>
      </div>
    );
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
        <h1 className="text-xl font-semibold text-slate-800 mb-6">{hotel.name}</h1>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-slate-500">Address</dt>
            <dd className="mt-0.5 text-slate-800">{hotel.address}</dd>
          </div>
        </dl>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/hotels"
            state={{ openEdit: hotel, returnTo: `/hotels/${hotel.id}` }}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            Edit hotel
          </Link>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete hotel
          </button>
        </div>
      </div>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete hotel?"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete &quot;{hotel.name}&quot;? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(false)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              setDeleting(true);
              setError('');
              try {
                await deleteHotel(hotel.id);
                toast.success(`Deleted "${hotel.name}".`);
                setDeleteModalOpen(false);
                navigate('/hotels', { replace: true });
              } catch (e) {
                const msg = e instanceof Error ? e.message : 'Failed to delete hotel';
                setError(msg);
                toast.error(msg);
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
