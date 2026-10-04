"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

const EMPTY_VALUES = {
  title: "",
  price: "",
  stock: "",
  category: "",
  images: [],
} as unknown as ProductDraft;

function toFormValues(editing: Product | null): ProductDraft {
  return editing
    ? { title: editing.title, price: editing.price, stock: editing.stock, category: editing.category, images: editing.images }
    : EMPTY_VALUES;
}

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onChange",
    defaultValues: toFormValues(editing),
  });

  useEffect(() => {
    reset(toFormValues(editing));
  }, [editing, reset]);

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset(EMPTY_VALUES);
  }

  return (
    <section className="form-card">
      <div className="form-heading">
        <div className="form-icon">{editing ? "✎" : "+"}</div>
        <div>
          <p className="eyebrow">{editing ? "EDIT PRODUCT" : "NEW PRODUCT"}</p>
          <h2>{editing ? "แก้ไขรายการสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
          <p>{editing ? "ปรับปรุงข้อมูลสินค้าในระบบ" : "กรอกข้อมูลเพื่อลงทะเบียนสินค้าใหม่"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(saveProduct)} noValidate className="product-form">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">ชื่อสินค้า</label>
            <input id="title" {...register("title")} placeholder="เช่น Wireless Headphones" />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="category">หมวดหมู่</label>
            <select id="category" {...register("category")}>
              <option value="">เลือกหมวดหมู่</option>
              {CATEGORIES.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            {errors.category && <span className="field-error">{errors.category.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="price">ราคา <span>(บาท)</span></label>
            <input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="0.00" />
            {errors.price && <span className="field-error">{errors.price.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="stock">จำนวนคงเหลือ</label>
            <input id="stock" type="number" {...register("stock", { valueAsNumber: true })} placeholder="0" />
            {errors.stock && <span className="field-error">{errors.stock.message}</span>}
          </div>
        </div>

        <div className="form-actions">
          {editing && <button type="button" className="secondary-button" onClick={onCancel}>ยกเลิก</button>}
          <button type="submit" className="primary-button">{editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}</button>
        </div>
      </form>
    </section>
  );
}
