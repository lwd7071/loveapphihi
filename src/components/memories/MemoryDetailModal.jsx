import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const categoryLabel = {
  first_time: { label: 'Lần đầu', emoji: '🌟', color: 'bg-yellow-100 text-yellow-600' },
  travel: { label: 'Du lịch', emoji: '✈️', color: 'bg-blue-100 text-blue-600' },
  anniversary: { label: 'Kỷ niệm', emoji: '🎉', color: 'bg-pink-100 text-pink-600' },
  daily: { label: 'Hằng ngày', emoji: '☀️', color: 'bg-orange-100 text-orange-500' },
  special: { label: 'Đặc biệt', emoji: '💫', color: 'bg-purple-100 text-purple-500' },
};

export default function MemoryDetailModal({ memory, onClose, onToggleFav }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  if (!memory) return null;

  const cat = categoryLabel[memory.category] || { label: 'Đặc biệt', emoji: '💫', color: 'bg-muted' };
  const photos = memory.photos || [];

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => (i - 1 + photos.length) % photos.length);
  const next = () => setLightboxIndex(i => (i + 1) % photos.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl z-10 flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <h2 className="font-bold text-base leading-tight">{memory.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {memory.memory_date ? format(parseISO(memory.memory_date), 'dd/MM/yyyy', { locale: vi }) : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onToggleFav(memory)}>
                <Star className={`w-5 h-5 ${memory.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </button>
              <button onClick={onClose} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Category badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${cat.color}`}>{cat.emoji} {cat.label}</span>

            {/* Description */}
            {memory.description && (
              <p className="text-sm text-foreground/80 leading-relaxed">{memory.description}</p>
            )}

            {/* Photo grid */}
            {photos.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">📷 {photos.length} ảnh</p>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((url, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openLightbox(i)}
                      className="aspect-square overflow-hidden rounded-2xl"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {photos.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">Kỷ niệm này chưa có ảnh nào 📷</div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
            <X className="w-6 h-6" />
          </button>
          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-semibold">
            {lightboxIndex + 1} / {photos.length}
          </p>

          {photos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 text-white/70 hover:text-white z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 text-white/70 hover:text-white z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <motion.img
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={photos[lightboxIndex]}
            alt=""
            className="max-w-full max-h-full object-contain rounded-xl px-14"
            onClick={e => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}