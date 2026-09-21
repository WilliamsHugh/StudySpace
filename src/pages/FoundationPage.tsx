export function FoundationPage({ title, description }: { title: string; description: string }) {
  return <section className="panel empty-state"><div className="empty-state__icon">◫</div><h2>{title}</h2><p>{description}</p><span className="coming-soon">Mô hình dữ liệu đã sẵn sàng · Chức năng sẽ hoàn thiện ở giai đoạn tiếp theo</span></section>
}
