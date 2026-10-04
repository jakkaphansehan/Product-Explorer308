"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductList, SearchQuery, ProductDraft } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ");
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  function saveProduct(draft: ProductDraft) {
    if (editing) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editing.id ? { ...product, ...draft } : product
        )
      );
      setEditing(null);
    } else {
      setProducts((prev) => [{ ...draft, id: Date.now() }, ...prev]);
    }
  }

  function removeProduct(id: number) {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <p className="eyebrow">PRODUCT EXPLORER</p>
            <h1>ระบบจัดการสินค้า</h1>
            <p className="subtitle">ค้นหา เพิ่ม แก้ไข และจัดการรายการสินค้าได้ในที่เดียว</p>
          </div>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={() => loadProducts(defaultQuery)}
          disabled={status === "loading"}
        >
          <span className="refresh-icon">↻</span>
          {status === "loading" ? "กำลังโหลด..." : "รีเฟรช"}
        </button>
      </header>

      <ProductSearchForm onSearch={loadProducts} />

      <ProductForm
        editing={editing}
        onSave={saveProduct}
        onCancel={() => setEditing(null)}
      />

      <section className="products-card" aria-live="polite">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVENTORY</p>
            <h2>รายการสินค้า</h2>
          </div>
          <span className="count-badge">{products.length} รายการ</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="product-column">สินค้า</th>
                <th>หมวดหมู่</th>
                <th className="number-column">ราคา</th>
                <th className="stock-column">คงเหลือ</th>
                <th className="actions-column">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="loader" />
                    <span>กำลังโหลดข้อมูล...</span>
                  </td>
                </tr>
              )}

              {status === "error" && (
                <tr>
                  <td colSpan={5} className="empty-state error-state">{errorMessage}</td>
                </tr>
              )}

              {status === "ready" && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="empty-icon">∅</div>
                    <span>ไม่พบรายการสินค้า</span>
                  </td>
                </tr>
              )}

              {status === "ready" &&
                products.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="product-cell">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.title} />
                        ) : (
                          <div className="product-placeholder">ไม่มีรูป</div>
                        )}
                        <div className="product-info">
                          <strong>{item.title}</strong>
                          <span>รหัส #{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{item.category || "ทั่วไป"}</span>
                    </td>
                    <td className="number-column price">฿{Number(item.price).toLocaleString()}</td>
                    <td className="stock-column">
                      <span className={`stock-badge ${item.stock > 0 ? "in-stock" : "out-stock"}`}>
                        <span className="status-dot" />
                        {item.stock > 0 ? `${item.stock} ชิ้น` : "หมด"}
                      </span>
                    </td>
                    <td className="actions-column">
                      <div className="row-actions">
                        <button type="button" className="edit-button" onClick={() => setEditing(item)}>
                          แก้ไข
                        </button>
                        <button type="button" className="delete-button" onClick={() => removeProduct(item.id)}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
