"use client";

import { Camera, MessageSquare, Star, Trash2, User } from "lucide-react";
import { ProductReview } from "@/modules/checkout/domain/entities/catalog-product";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ExtendedReview extends ProductReview {
  images?: string[];
}

interface ProductReviewsProps {
  reviews: ProductReview[];
  rating?: number;
}

export function ProductReviews({
  reviews: initialReviews,
  rating,
}: ProductReviewsProps) {
  const [localReviews, setLocalReviews] =
    useState<ExtendedReview[]>(initialReviews);

  // Estados locais do formulário de criação de avaliações
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Simulado de Upload Multimídia
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImagesUrls = filesArray.map((file) => URL.createObjectURL(file));
      // Acopla os novos anexos limitando ao teto estrito de 3 imagens por avaliação
      setSelectedImages((prev) => [...prev, ...newImagesUrls].slice(0, 3));
      toast.success("Foto do produto anexada ao rascunho com sucesso!");
    }
  };

  const handleAddReview = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!reviewerName.trim() || !comment.trim()) {
      toast.error(
        "Por favor, preencha todos os campos obrigatórios da avaliação.",
      );
      return;
    }

    const newReview: ExtendedReview = {
      reviewerName: reviewerName.trim(),
      reviewerEmail: `tester-${Date.now()}@nightowl.com`,
      comment: comment.trim(),
      rating: formRating,
      date: new Date().toISOString(),
      images: selectedImages, // Aloca o array de fotos enviadas localmente
    };

    // Insere a nova opinião com prioridade no topo do feed de comentários
    setLocalReviews([newReview, ...localReviews]);
    toast.success("Sua avaliação foi publicada com sucesso!");

    // Descarrega os buffers do formulário controlado
    setReviewerName("");
    setComment("");
    setFormRating(5);
    setSelectedImages([]);
  };

  // Remove o comentário comparando o nome e a data exata da publicação de forma combinada
  const handleDeleteReview = (name: string, reviewDate: string) => {
    setLocalReviews(
      localReviews.filter(
        (rev) => !(rev.reviewerName === name && rev.date === reviewDate),
      ),
    );
    toast.success("Avaliação excluída com sucesso.");
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
      {/* Formulário Interativo de Envio */}
      <section className="bg-white dark:bg-[#OF172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-5 transition-colors">
        <div className="flex flex-col gap-0.5 border-b border-slate-100 dark:border-slate-900 pb-2">
          <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-300 flex items-center gap-2">
            <MessageSquare
              size={16}
              className="text-electric-blue dark:text-electric-cyan"
            />
            Deixe sua Avaliação
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Compartilhe sua experiência de compra e anexe fotos do produto
            recebido
          </p>
        </div>

        <form onSubmit={handleAddReview} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                Seu Nome Completo
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Ex.: Dev FrontEnd"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg text-xs outline-hidden text-slate-800 dark:text-slate-200 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
                Sua Nota
              </label>
              <div className="flex items-center gap-1.5 h-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={18}
                      className={
                        star <= formRating
                          ? "fill-current"
                          : "text-slate-300 dark:text-slate-700"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
              Mensagem da Avaliação
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="O que você achou da qualidade do material e do prazo de entrega?"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-electric-blue dark:focus:border-electric-cyan/50 rounded-lg outline-hidden text-slate-800 dark:text-slate-200 resize-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-electric-blue dark:text-electric-cyan tracking-widest uppercase">
              Anexar Fotos do Produto (Max.: 3)
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="w-12 h-12 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-electric-blue dark:hover:border-electric-cyan rounded-xl flex items-center justify-center text-slate-400 hover:text-electric-blue dark:hover:text-electric-cyan cursor-pointer transition-colors">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={selectedImages.length >= 3}
                />
              </label>

              {selectedImages.map((src, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden group bg-slate-100 dark:bg-slate-950"
                >
                  {/* eslint-disable-next-line @next/next/no-img/element */}
                  <img
                    src={src}
                    alt="Preview anexo"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImages(
                        selectedImages.filter((_, i) => i !== idx),
                      )
                    }
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-500 transition-opacity cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-fit px-6 py-2.5 bg-electric-blue hover:bg-electric-vivid text-white text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer ml-auto shadow-md active:scale-[0.99]"
          >
            Publicar Avaliação
          </button>
        </form>
      </section>

      {/* Listagem Pública de Depoimentos */}
      <div className="w-full max-w-5xl bg-white dark:[#0F172A] border border-slate-200 dark:border-slate-900 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-xl transition-colors mt-8">
        {/* Resumo do Head de Avaliações */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900 gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-slate-300">
              Avaliações e Depoimentos
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Veja o que os outros clientes acharam deste produto.
            </p>
          </div>

          {rating && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 px-3 py-1.5 rounded-lg shrink-0 w-fit">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {rating.toFixed(1)} / 5.0
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                ({localReviews.length} notas)
              </span>
            </div>
          )}
        </div>

        {/* Listagem Dinâmica dos Comentários */}
        {localReviews.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Ainda não existem avaliações registradas para este produto.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {localReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/60 rounded-xl p-4 flex flex-col gap-2.5 transition-colors"
              >
                {/* Topo do Card de Comentário */}
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex flex-col min-w-0">
                    <div className="w-7 h-7 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <User size={12} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {rev.reviewerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate">
                        {new Date(rev.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {/* Mostra as estrelas e o botão de exclusão reativa */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < rev.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-300 dark:text-slate-800"
                          }
                        />
                      ))}
                    </div>

                    {/* Botão de Excluir Comentário */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteReview(rev.reviewerName, rev.date)
                      }
                      title="Excluir esta publicação"
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-all cursor-pointer block"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Texto do Depoimento */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic pr-2 pl-9">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Renderização das Imagens anexadas locais */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex items-center gap-2 pl-9 mt-1 flex-wrap">
                    {rev.images.map((imgSrc, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="w-14 h-14 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs bg-slate-100 dark:bg-slate-950"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc}
                          alt="Anexo do cliente"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
