"use client";

import { useForm } from "react-hook-form";
import type { SearchQuery } from "@/lib/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    defaultValues: defaultQuery,
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate className="search-card">
      <div className="search-main-field field">
        <label htmlFor="q">ค้นหาสินค้า</label>
        <div className="input-with-icon">
          <span>⌕</span>
          <input id="q" {...register("q")} placeholder="พิมพ์ชื่อสินค้าเพื่อค้นหา..." />
        </div>
      </div>

      <div className="field compact-field">
        <label htmlFor="sortBy">เรียงตาม</label>
        <select id="sortBy" {...register("sortBy")}>
          {SORT_FIELDS.map((field) => <option key={field} value={field}>{field}</option>)}
        </select>
      </div>

      <div className="field limit-field">
        <label htmlFor="limit">แสดงรายการ</label>
        <input id="limit" type="number" {...register("limit", { valueAsNumber: true })} />
        {errors.limit && <span className="field-error">{errors.limit.message}</span>}
      </div>

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "กำลังค้นหา..." : "ค้นหา"}
      </button>
    </form>
  );
}
